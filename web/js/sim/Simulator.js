class Register {
	value;

	constructor(value = 0) {
		this.init(value);
	}

	init(value = 0) {
		this.value = value;
	}

	set(value) {
		this.value = value;
	}

	get() {
		return this.value;
	}
}

class StatusRegister extends Register {
	constructor() {
		super();
		this.clear_Z();
		this.clear_S();
		this.clear_O();
		this.clear_I();
	}

	set_Z() {
		this.setBit(0, 1);
	}
	set_S() {
		this.setBit(1, 1);
	}
	set_O() {
		this.setBit(2, 1);
	}
	set_I() {
		this.setBit(3, 1);
	}

	clear_Z() {
		this.setBit(0, 0);
	}
	clear_S() {
		this.setBit(1, 0);
	}
	clear_O() {
		this.setBit(2, 0);
	}
	clear_I() {
		this.setBit(3, 0);
	}

	get_Z() {
		this.getBit(0);
	}
	get_S() {
		this.getBit(1);
	}
	get_O() {
		this.getBit(2);
	}
	get_I() {
		this.getBit(3);
	}

	setBit(bitIndex, value) {
		if (bitIndex >= 0 && bitIndex <= 3) {
			// Clear the bit
			this.value &= ~(1 << bitIndex);

			// Set the bit to the new value
			if (value) {
				this.value |= 1 << bitIndex;
			}
		}
	}

	getBit(bitIndex) {
		if (bitIndex >= 0 && bitIndex <= 3) {
			return !!(this.value & (1 << bitIndex));
		}
		return false;
	}
}

class InstructionPointer extends Register {
	increment(value = 1) {
		this.value += value;
	}
}

class RAM {
	#ram;

	constructor() {
		this.#ram = new Array(256);
	}

	flash(ram) {
		// TODO_L enable smaller input ram size
		this.#ram = ram;
	}

	get(address) {
		return this.#ram[address];
	}

	set(address, value) {
		this.#ram[address] = value;
	}
}

class Simulator {
	init_registers() {
		this.AL = new Register();
		this.BL = new Register();
		this.CL = new Register();
		this.DL = new Register();

		this.SR = new StatusRegister();

		// SP
		this.SP = 0;
		// IP
		this.IP = new InstructionPointer();
	}

	init_memory() {
		this.ram = new RAM();
	}

	init() {
		this.init_registers();
		this.init_memory();

		this.running = false;
	}

	constructor() {
		this.init();
	}

	load_program(ram) {
		this.ram.flash(ram);
	}

	run() {
		this.running = true;

		let op_code = 0;

		do {
			//
			op_code = this.fetch();

			let res = this.decode(op_code);
			let target_register = res.register;
			let operands = res.ops;

			let result = this.execute(op_code, operands, target_register);

			console.log(
				"Executing: " + op_code + " | " + operands + " Result : " + result
			);
			this.IP.increment(operands.length + 1);
		} while (op_code != 0);
	}

	reset() {
		this.init();
	}

	fetch() {
		return this.ram.get(this.IP.get());
	}

	decode(op_code) {
		let num_operands = get_command_len(op_code);
		let operands = new Array();
		let op_type = get_op_type(op_code).split("_");
		let res_register = new Register();

		for (let i = 0; i < num_operands; i++) {
			let operand_token = this.ram.get(this.IP.get() + i + 1);

			let value = 0;

			switch (op_type[i]) {
				case OperandType.register:
					if (i == 0) {
						res_register = this.get_register(operand_token);
					}
					value = this.get_register_value(operand_token);
					break;
				case OperandType.immediate:
					value = operand_token;
					break;
				case OperandType.dmemory:
					value = this.ram.get(operand_token);
					break;
				case OperandType.imemory:
					value = this.ram.get(this.get_register_value(operand_token));
					break;
				case OperandType.tag:
					res_register = this.IP; // jump
					break;
				case OperandType.data_bytes:
					break;
				default:
					break;
			}

			operands.push(value);
		}

		return { ops: operands, register: res_register };
	}

	execute(command, operands, target_register) {
		switch (command) {
			//ADD
			case 0xa0:
			case 0xb0:
				target_register.set(operands[0] + operands[1]);
				return target_register.get();
		}
	}

	get_register_value(index) {
		switch (index) {
			case 0:
				return this.AL.get();
			case 1:
				return this.BL.get();
			case 2:
				return this.CL.get();
			case 3:
				return this.DL.get();
		}
	}

	get_register(index) {
		switch (index) {
			case 0:
				return this.AL;
			case 1:
				return this.BL;
			case 2:
				return this.CL;
			case 3:
				return this.DL;
		}
	}
}
