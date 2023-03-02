class Tag {
	constructor() {
		this.name = "";
		this.address = -1;
	}
}

class Operand {
	constructor() {
		this.Type = OpType.unknown;
		this.value = -1;
	}
}

class Command {
	constructor(line) {
		this.line = line;
		this.type = OpType.default;
		this.op1 = parse_operand(line, 0); // skip if tag type
		this.op2 = parse_operand(line, 1); // skip if jump type
		this.command = parse_command(line);
		this.byte_len = 0;
	}

	parse_command(line) {
		return "";
	}

	parse_operand(line, operand) {
		let operand = line.split(" ")[1].split(",")[pos];

		if (operand.includes("[")) {
			let is_register = operand.search(/[A-D]L/);
			if (is_register) {
				operand.type = OpType.imemory;
			} else {
				operand.type = OpType.dmemory;
			}
		} else if (operand.search(/[A-D]L/)) {
			operand.type = OpType.register;
		} else if (operand.search(/[A-F0-9]*/)) {
			operand.type = OpType.immediate;
		} else {
			operand.type = OpType.unknown;
		}

		return "";
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
		parse_lines();

		add_addresses();
	}

	parse_lines() {
		for (line in lines) {
			this.commands.push(new Command(line));
		}
	}
	add_address() {}
}
