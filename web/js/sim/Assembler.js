class Tag {
	constructor(line, address) {
		line = line.replace(":", "");
		console.group("Tag: " + line + " @ " + address);
		this.name = line;
		this.address = address;
		console.groupEnd();
	}
}

class Operand {
	constructor(op) {
		console.group("Operand: " + op);
		this.op = op;
		this.type = OperandType.unknown;
		this.value = -1;

		this.parse_operand(op);

		console.log(this.type);
		console.log(this.value);
		console.groupEnd();
	}

	parse_operand(op) {
		op = op.trim();

		if (op.includes("[")) {
			let mem_location = op.substring(1, op.length - 1);
			let is_register = mem_location.search(/^[A-D]L$/) != -1;
			if (is_register) {
				this.type = OperandType.imemory;
				this.value = get_register_index(mem_location);
			} else {
				this.type = OperandType.dmemory;
				this.value = Number.parseInt(mem_location);
			}
		} else if (op.search(/^[A-D]L$/i) == 0) {
			this.type = OperandType.register;
			this.value = get_register_index(op);
		} else if (op.search(/^[A-F0-9]+$/i) == 0) {
			this.type = OperandType.immediate;
			this.value = Number.parseInt(op, 16);
		} else if (op.search(/^[a-z]+[a-z0-9]*/i) == 0) {
			this.type = OperandType.tag;
			this.value = -1;
		} else if (op.search(/^"[A-Z0-9]*"$/i) == 0) {
			this.type = OperandType.data_bytes;
			this.value = op.substring(1, op.length - 1);
		} else {
			this.type = OperandType.unknown;
		}
	}
}

class Command {
	/***
	 * Command constructor
	 * @param line An instruction line to be parsed
	 */
	constructor(line, address, raw_line) {
		console.group("Command: " + line);
		this.address = address;
		this.line = raw_line;
		this.byte_len = 0;
		this.operands = new Array();

		this.parse_command(line);

		console.log("Command type: " + this.type);
		console.log("Hex: " + this.op_code);
		for (let i = 0; i < this.operands.length; i++) {
			console.log("OP" + i + ": " + this.operands[i].value);
		}
		console.log("Len: " + this.byte_len);
		console.groupEnd();
	}

	/***
	 * Extract command, op1, op2 from line that is not a comment or tag
	 * @param line Line to be processed
	 */
	parse_command(line) {
		line = line.trim(); // clean line
		this.type = CommandType.unidentified; // upgrade a type to command type
		let com_ops = line.split(" "); // devide command and operands
		let byte_len = 1;

		if (com_ops.length > 1) {
			byte_len += this.parse_operands(com_ops);
		} else {
			this.type = CommandType.noop;
		}

		this.op_code = get_op_code(com_ops[0], this.type);

		if (this.op_code == -1) {
			//DB command specific code
			this.byte_len = 1;
			this.type = CommandType.data_byte;
			this.op_code = "";
		} else if (this.op_code == -2) {
			this.byte_len = this.operands[0].value.length;
			this.type = CommandType.data_bytes;
			this.op_code = "";
			let tmp_operand = this.operands[0];
			this.operands = new Array();
			for (let i = 0; i < tmp_operand.value.length; i++) {
				this.operands.push(
					new Operand(tmp_operand.value.charCodeAt(i).toString(16))
				);
			}
		} else if (this.op_code == -127) {
			this.byte_len = this.operands[0].value - this.address;
			this.operands = new Array();
		} else if (this.op_code == -128) {
			this.byte_len = 0;
		} else {
			this.byte_len = byte_len;
		}
	}

	/***
	 * Parse 1 or 2 operands and detiermine their type
	 * @param com_ops Operands divided by ,
	 */
	parse_operands(com_ops) {
		let ops = com_ops[1].split(","); // split operands by ,
		let command_types = new Array();
		let num_of_operands = 0;

		for (let i = 0; i < ops.length; i++) {
			let tmp_operand = new Operand(ops[i]); // skip if tag type
			command_types.push(tmp_operand.type);
			this.operands.push(tmp_operand);
			num_of_operands++;
		}

		if (command_types.length == 1 && command_types[0] == OperandType.tag) {
			this.type = CommandType.jump;
			// resolve on pass 2
		} else if (command_types.length == 1) {
			this.type = command_types[0];
		} else {
			this.type = command_types[0] + "_" + command_types[1];
		}

		return num_of_operands;
	}

	get_byte_length() {
		return this.byte_len;
	}
}

let tags = new Array();

class Assembler {
	constructor() {
		// Intrnal variables init
		this.init();
	}

	init() {
		tags = new Array();
		this.commands = new Array();
		this.address = 0;
	}

	main(lines) {
		console.group("ASM Main");
		console.log(lines);
		this.init();
		this.parse_lines_pass1(lines);
		this.parse_lines_pass2();
		console.groupEnd();
	}

	/***
	 * Process all lines and extract commands, operands.
	 * This method only resolves some tags (backward tags)
	 * @param lines Lines to process
	 */
	parse_lines_pass1(lines) {
		let error_lines = new Array();
		for (let cnt = 0; cnt < lines.length; cnt++) {
			console.log("Addr: " + this.address);
			let line = lines[cnt];
			if (line.trim() != "") {
				let res = this.remove_comment(line);
				let only_comment = res.only_comment;
				line = res.line;

				if (!only_comment) {
					let is_tag = this.check_if_tag(line);

					if (!is_tag) {
						let tmp_command = new Command(line, this.address, lines[cnt]);
						if (tmp_command.op_code != -128) {
							this.address += tmp_command.get_byte_length();
							if (tmp_command.op_code != -127) {
								// push command if not ORG(-127) (Only ORG has length but no opcode)
								this.commands.push(tmp_command);
							}
						} else {
							error_lines.push(cnt);
						}
					} else {
						// if tag then save as tag
						tags.push(new Tag(line, this.address));
					}
				}
			}
		}

		print_asm_error(error_lines);
	}

	parse_lines_pass2() {
		for (let i = 0; i < this.commands.length; i++) {
			let tmp_command = this.commands[i];
			for (let j = 0; j < tmp_command.operands.length; j++) {
				let tmp_operand = tmp_command.operands[j];
				if (tmp_operand.type == OperandType.tag && tmp_operand.value == -1) {
					tags.find(function (value) {
						if (value.name == this.op) {
							this.value = value.address - tmp_command.address;
						}
					}, tmp_operand);
				}
			}
		}

		let error_lines = new Array();
		for (let i = 0; i < this.commands.length; i++) {
			for (let j = 0; j < this.commands[i].operands.length; j++) {
				if (this.commands[i].operands[j].value == -1) error_lines.push(i);
			}
		}

		print_asm_error(error_lines);
	}

	/***
	 * Removes comment from line, if line is just a comment true is returned else false
	 * @param line Line to be evaluated and comment removed
	 */
	remove_comment(line) {
		let comment_positon = line.search(";"); // search for comment
		let only_comment = false;

		if (comment_positon == 0) {
			// line is comment
			line = "";
			this.type = CommandType.comment;
			only_comment = true;
		} else if (comment_positon > 0) {
			// line has comment - remove it
			line = line.split(";")[0];
		}

		return { only_comment: only_comment, line: line };
	}

	/***
	 * Checks if line is a tag (no starting tab)
	 * @param line Line to be evaluated
	 */
	check_if_tag(line) {
		let is_tag = !line.search("\t") == 0; // check if line starts with \t
		if (is_tag) is_tag = !line.search("    ") == 0;
		return is_tag;
	}

	/***
	 * Returns RAM as array generated from all the parsed commands
	 */
	commands_to_ram() {
		const ram_array = new Array(256).fill(0);

		for (let i = 0; i < this.commands.length; i++) {
			let index = this.commands[i].address;

			if (
				this.commands[i].op_code != "" &&
				this.commands[i].op_code >= 0 &&
				this.commands[i].op_code <= 256
			) {
				ram_array[index++] = this.commands[i].op_code;
			}

			for (let j = 0; j < this.commands[i].operands.length; j++) {
				ram_array[index++] = this.commands[i].operands[j].value;
			}
		}

		return ram_array;
	}
}
