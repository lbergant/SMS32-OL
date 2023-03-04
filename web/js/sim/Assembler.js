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
				this.value = get_register(mem_location);
			} else {
				this.type = OperandType.dmemory;
				this.value = Number.parseInt(mem_location);
			}
		} else if (op.search(/^[A-D]L$/i) == 0) {
			this.type = OperandType.register;
			this.value = get_register(op);
		} else if (op.search(/^[A-F0-9]+$/i) == 0) {
			this.type = OperandType.immediate;
			this.value = Number.parseInt(op);
		} else if (op.search(/^[a-z]+[a-z0-9]*/i) == 0) {
			this.type = OperandType.tag;
			this.value = -1;
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
	constructor(line, address) {
		console.group("Command: " + line);
		this.address = address;
		this.line = line;
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
			this.type = CommandType.end;
		}

		this.op_code = get_op_code(com_ops[0], this.type);

		if (this.op_code == -1) {
			//DB command specific code
			this.byte_len = 1;
			this.type = CommandType.data_byte;
			this.op_code = this.operands[0].value;
			this.operands = new Array();
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
		} else if (
			command_types.length == 1 &&
			command_types[0] == OperandType.immediate
		) {
			this.type = CommandType.immediate;
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
		this.address = 0;
		this.commands = new Array();
	}

	main(lines) {
		console.group("ASM Main");
		console.log(lines);
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
		for (let cnt = 0; cnt < lines.length; cnt++) {
			console.log("Addr: " + this.address);

			let only_comment = this.remove_comment(lines[cnt]);
			if (!only_comment) {
				let is_tag = this.check_if_tag(lines[cnt]);

				if (!is_tag) {
					let tmp_command = new Command(lines[cnt], this.address);
					this.address += tmp_command.get_byte_length();
					this.commands.push(tmp_command);
				} else {
					// if tag then save as tag
					tags.push(new Tag(lines[cnt], this.address));
				}
			}
		}
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
	}

	/***
	 * Removes comment from line, if line is just a comment true is returned else false
	 * @param line Line to be evaluated and comment removed
	 */
	remove_comment(line) {
		let comment_positon = line.search(";"); // search for comment

		if (comment_positon == 0) {
			// line is comment
			line = "";
			this.type = CommandType.comment;
			return true;
		} else if (comment_positon > 0) {
			// line has comment - remove it
			line = line.split(";")[0];
		}

		return false;
	}

	/***
	 * Checks if line is a tag (no starting tab)
	 * @param line Line to be evaluated
	 */
	check_if_tag(line) {
		let is_tag = line.search("\t") == -1; // check if line starts with \t
		if (is_tag) this.type = CommandType.tag;
		return is_tag;
	}

	resolve_tags() {}
}
