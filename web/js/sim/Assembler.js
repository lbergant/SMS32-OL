class Tag {
	constructor() {
		this.name = "";
		this.address = -1;
	}
}

class Operand {
	constructor() {
		this.type = OpType.unknown;
		this.value = -1;
	}
}

class Command {
	constructor(line) {
		console.group("Command: " + line);
		this.line = line;
		this.ops = new Array();

		let comment_positon = line.search(";"); // search for comment

		if (comment_positon == 0) {
			console.log("line is a comment");
			console.groupEnd();
			return;
		} else if (comment_positon > 0) {
			line = line.split(";")[0];
		}

		let is_tag = line.search("\t") == -1; // check if line starts with \t

		if (is_tag) {
		} else {
			line = line.trim();
			this.type = OpType.default;
			let com_ops = line.split(" ");
			if (com_ops.length > 1) {
				let ops = com_ops[1].split(","); // split operands by ,
				for (let i = 0; i < ops.length; i++) {
					this.ops.push(this.parse_operand(ops[i])); // skip if tag type
				}
			}
			this.command = this.parse_command(line);
			this.byte_len = 0;
		}
		console.groupEnd();
	}

	parse_command(line) {
		return "";
	}

	parse_operand(op) {
		let operand = new Operand();
		// let op = line.split(" ")[1].split(",")[pos];
		console.group("Operand: " + op);
		op = op.trim();

		if (op.includes("[")) {
			let is_register = operand.search(/[A-D]L/);
			if (is_register) {
				operand.type = OpType.imemory;
			} else {
				operand.type = OpType.dmemory;
			}
		} else if (op.search(/[A-D]L/) == 0) {
			operand.type = OpType.register;
		} else if (op.search(/[A-F0-9*]/) == 0) {
			operand.type = OpType.immediate;
		} else {
			operand.type = OpType.unknown;
		}

		console.log(operand.type);
		console.groupEnd();
		return operand;
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
