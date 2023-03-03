class Tag {
	constructor() {
		this.name = "";
		this.address = -1;
	}
}

class Operand {
	constructor(op) {
		console.group("Operand: " + op);
		this.type = OperandType.unknown;
		this.value = -1;

		this.parse_operand(op);
		console.groupEnd();
	}

	parse_operand(op) {
		op = op.trim();

		if (op.includes("[")) {
			let is_register = operand.search(/[A-D]L/);
			if (is_register) {
				this.type = OperandType.imemory;
			} else {
				this.type = OperandType.dmemory;
			}
		} else if (op.search(/^[A-D]L$/i) == 0) {
			this.type = OperandType.register;
		} else if (op.search(/^[A-F0-9]+$/i) == 0) {
			this.type = OperandType.immediate;
		} else if (op.search(/^[a-z]+[a-z0-9]*/i) == 0) {
			this.type = OperandType.tag;
		} else {
			this.type = OperandType.unknown;
		}

		console.log(this.type);
	}
}

class Command {
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

	/***
	 * Extract command, op1, op2 from line that is not a comment or tag
	 * @param line Line to be processed
	 */
	parse_command(line) {
		line = line.trim(); // clean line
		this.type = CommandType.unidentified; // upgrade a type to command type
		let com_ops = line.split(" "); // devide command and operands

		if (com_ops.length > 1) {
			this.parse_operands(com_ops);
		} else {
			this.type = CommandType.end;
		}

		this.op_code = get_op_code(com_ops[0], this.type);

		this.byte_len = 0;
	}

	constructor(line) {
		console.group("Command: " + line);
		this.line = line;
		this.ops = new Array();

		let only_comment = this.remove_comment(line);
		if (!only_comment) {
			let is_tag = this.check_if_tag(line);

			if (!is_tag) {
				this.parse_command(line);
			}
		}

		console.log("Command type: " + this.type);
		console.log("Hex: " + this.op_code);
		console.groupEnd();
	}

	/***
	 * Parse 1 or 2 operands and detiermine their type
	 * @param com_ops Operands divided by ,
	 */
	parse_operands(com_ops) {
		let ops = com_ops[1].split(","); // split operands by ,
		let command_types = new Array();

		for (let i = 0; i < ops.length; i++) {
			let tmp_operand = new Operand(ops[i]); // skip if tag type
			command_types.push(tmp_operand.type);
			this.ops.push(tmp_operand);
		}

		if (command_types.length == 1 && command_types[0] == OperandType.tag) {
			this.type = CommandType.jump_forw; // TODO_L if label unknown then forward else backward
		} else {
			this.type = command_types[0] + "_" + command_types[1];
		}
	}

	add_address(address) {
		this.address = address;
	}
}

class Assembler {
	constructor() {
		// Intrnal variables init
		this.address = 0;
		this.commands = new Array();
	}

	main(lines) {
		console.group("ASM Main");
		console.log(lines);
		this.parse_lines(lines);

		// resolve_tags(); // check all jump and call? instructions for tags and resolve them
		console.groupEnd();
	}

	parse_lines(lines) {
		for (let cnt = 0; cnt < lines.length; cnt++) {
			let tmp_command = new Command(lines[cnt]);
			// tmp_command.add_address(address);
			// address += tmp_command.get_length();
			this.commands.push(tmp_command);
		}
	}

	resolve_tags() {}
}
