class Register {
	value;
	reg_name;

	constructor(name = "", value = 0) {
		this.asm = asm;
		this.reg_name = name;
		this.value = value;
	}

	set(value) {
		this.value = value;
		update_register("td" + this.reg_name, value);
	}

	get() {
		return this.value;
	}
}

class GeneralRegister extends Register {
	constructor(asm, name = "", value = 0) {
		super(name, value);
		this.asm = asm;
	}

	set(value) {
		if (value > 127) {
			value -= 256;
			if (this.asm) this.asm.SR.set_O();
		} else if (value < -128) {
			value += 256;
			if (this.asm) this.asm.SR.set_O();
		} else {
			if (this.asm) this.asm.SR.clear_O();
		}

		if (value == 0) {
			if (this.asm) this.asm.SR.set_Z();
		} else {
			if (this.asm) this.asm.SR.clear_Z();
		}

		if (value < 0) {
			if (this.asm) this.asm.SR.set_S();
		} else {
			if (this.asm) this.asm.SR.clear_S();
		}

		// set(value);
		this.value = value;
		update_register("td" + this.reg_name, value);
	}
}

class StatusRegister extends Register {
	constructor() {
		super("SR");
		this.clear();
		// this.value = 0;
	}

	clear() {
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
		return this.getBit(0);
	}
	get_S() {
		return this.getBit(1);
	}
	get_O() {
		return this.getBit(2);
	}
	get_I() {
		return this.getBit(3);
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

		this.set(this.value);
	}

	getBit(bitIndex) {
		if (bitIndex >= 0 && bitIndex <= 3) {
			return !!(this.value & (1 << bitIndex));
		}
		return false;
	}
}

class InstructionPointer extends Register {
	// this should be Register so flags are not updated
	increment(value = 1) {
		this.set(this.value + value);
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
		if (address < 0) address += 256;
		return this.#ram[address];
	}

	set(address, value) {
		if (address < 0) address += 256;
		this.#ram[address] = value;
		// update_ram_GUI(this.#ram); // TODO_L do this nicer
		update_RAM_GUI(address, value);
	}

	copy() {
		return this.#ram.slice();
	}
}

class Device {
	#id;
	#value;

	constructor(id) {
		this.id = id;
		this.value = 0;
	}
}

class OutputDevice extends Device {
	reset() {
		this.write(0);
		this.write(1);
	}

	write(input) {
		this.value = input;
	}
}

class SevenSegDisplay extends OutputDevice {
	write(input) {
		super.write(input);

		displayRaw(input % 2, input);
	}
}

class TLight extends OutputDevice {
	write(input) {
		super.write(input);

		toggleLights(input);
	}
}

class InputDevice extends Device {
	id;
	value;

	read() {
		return this.value;
	}
}

class Keyboard extends InputDevice {
	read() {
		let val = read_input_char();
		this.value = val;

		return val;
	}
}

class Simulator {
	running;
	hw_interrupt_timer_interval;
	hw_interrupt_timer_counter;

	set_hw_interrupt_interval(interval) {
		interval = Number(interval)*1000;
		this.hw_interrupt_timer_interval = interval;
	}

	init_registers() {
		// Status register
		this.SR = new StatusRegister();

		// Instruction pointer
		this.IP = new InstructionPointer("IP");

		this.AL = new GeneralRegister(this, "AL");
		this.BL = new GeneralRegister(this, "BL");
		this.CL = new GeneralRegister(this, "CL");
		this.DL = new GeneralRegister(this, "DL");

		// SP
		this.SP = new InstructionPointer("SP", 255);

		clear_register_color();
	}

	zero_registers() {
		this.IP.set(0);

		this.AL.set(0);
		this.BL.set(0);
		this.CL.set(0);
		this.DL.set(0);

		// SP
		this.SP.set(255);
		this.SR.set(0);
	}

	zero_input_output() {
		for (let i = 0; i < this.output_devices.length; i++) {
			this.output_devices[i].reset();
		}

		// Do the same for input devices
		// for (let i = 0; i < num_of_output_devices; i++) {
		// 	this.output_devices[i].reset();
		// }
	}

	init_memory() {
		this.ram = new RAM();
	}

	init_devices() {
		// OUTPUT:
		// 	1 - Traffic lights
		// 	2 - 7 segment
		// 	3 - Heater
		// 	4 - Snake
		// 	5 - Motor
		const num_of_output_devices = 5;

		// INPUT
		// 	00 - Key
		// 	03 - Heater
		const num_of_input_devices = 2;

		this.output_devices = new Array(num_of_output_devices);

		for (let i = 0; i < num_of_output_devices; i++) {
			this.output_devices[i] = new OutputDevice(i);
		}

		this.output_devices[1] = new TLight(1);
		this.output_devices[2] = new SevenSegDisplay(2);

		this.input_devices = new Array(num_of_input_devices);

		this.input_devices[0] = new Keyboard(0);
		// this.input_devices[3] = new InputDevice(3);
	}

	init() {
		this.init_registers();
		this.init_memory();
		this.init_devices();

		this.hw_interrupt_timer_interval = 3000;
		this.hw_interrupt_timer_counter = 0;
		this.running = false;
	}

	constructor() {
		this.init();
	}

	load_program(ram) {
		this.ram.flash(ram);
	}

	async run() {
		this.running = true;

		let op_code = -1;

		while (op_code != 0 && this.running) {
			let timer_interval = 10 - get_speed_value();
			this.hw_interrupt_timer_counter += timer_interval * 100;

			if (this.hw_interrupt_timer_counter >= this.hw_interrupt_timer_interval) {
				let result = this.execute(0xcc, [0x02 - 2], this.IP);

				console.log("Executing: HW Interrupt, jumping to " + result);

				this.IP.increment(2);

				this.hw_interrupt_timer_counter = 0;
			}
			op_code = this.step();

			await this.sleep(timer_interval * 100);
		}
	}

	sleep(ms) {
		return new Promise((r) => setTimeout(r, ms));
	}

	step(override_op_code = null) {
		clear_register_color();
		// this.SR.clear();

		let op_code = this.fetch();

		let res = this.decode(op_code);
		let target_register = res.register;
		let operands = res.ops;

		let result = this.execute(op_code, operands, target_register);

		console.log(
			"Executing: " + op_code + " | " + operands + " Result : " + result
		);
		this.IP.increment(operands.length + 1);
		color_ram(this.IP.get(), default_highlight);
		color_dis_asm(this.IP.get(), default_highlight);
		return op_code;
	}

	reset() {
		this.zero_registers();
		this.zero_input_output();
		this.hw_interrupt_timer_counter = 0;
	}

	fetch() {
		return this.ram.get(this.IP.get());
	}

	decode(op_code) {
		let num_operands = get_command_len(op_code);
		let operands = new Array();
		let op_type = get_op_type(op_code).split("_");
		let res_register = new Register();

		if (num_operands < 1) {
			// RET special case
			res_register = this.IP;
		} else {
			for (let i = 0; i < num_operands; i++) {
				let operand_token = this.ram.get(this.IP.get() + i + 1);

				let value = 0;

				switch (op_type[i]) {
					case OperandType.imemory: // return memory address to read/write
					case OperandType.register:
						if (i == 0) {
							res_register = this.get_register(operand_token);
						}
						value = this.get_register_value(operand_token);
						break;
					case OperandType.dmemory: // return memory addres to read/write
					case OperandType.immediate:
						value = operand_token;
						break;
					case OperandType.tag:
					case "jump":
						value = operand_token - 2; //offset jump length TODO_L is this ok?
						res_register = this.IP; // jump
						break;
					case OperandType.data_bytes:
						break;
					default:
						break;
				}

				if (value > 127) value -= 256;
				else if (value < -128) value += 256;
				operands.push(value);
			}
		}

		return { ops: operands, register: res_register };
	}

	execute_jump(command, operands, target_register) {
		let tmp;

		switch (command) {
			// JMP
			case 0xc0:
				target_register.set(this.IP.get() + operands[0]);
				break;
			case 0xc1:
				tmp = operands[0];
				if (!this.SR.get_Z()) {
					tmp = 0;
				}
				target_register.set(this.IP.get() + tmp);
				break;
			case 0xc2:
				tmp = operands[0];
				if (this.SR.get_Z()) {
					tmp = 0;
				}
				target_register.set(this.IP.get() + tmp);
				break;
			case 0xc3:
				tmp = operands[0];
				if (!this.SR.get_S()) {
					tmp = 0;
				}
				target_register.set(this.IP.get() + tmp);
				break;
			case 0xc4:
				tmp = operands[0];
				if (this.SR.get_S()) {
					tmp = 0;
				}
				target_register.set(this.IP.get() + tmp);
				break;
			case 0xc5:
				tmp = operands[0];
				if (!this.SR.get_O()) {
					tmp = 0;
				}
				target_register.set(this.IP.get() + tmp);
				break;
			case 0xc6:
				tmp = operands[0];
				if (this.SR.get_O()) {
					tmp = 0;
				}
				target_register.set(this.IP.get() + tmp);
				break;
		}
	}

	execute_move(command, operands, target_register) {
		switch (command) {
			// MOV
			//      immediate to register
			case 0xd0:
				target_register.set(operands[1]);
				break;
			//      mem to register
			case 0xd1:
			case 0xd3:
				target_register.set(this.ram.get(operands[1]));
				break;
			//      register to mem
			case 0xd2:
			case 0xd4:
				this.ram.set(operands[0], operands[1]);
				break;
		}
	}

	execute_cmp(val1, val2) {
		this.SR.clear_S;
		this.SR.clear_Z;

		if (val1 == val2) {
			this.SR.set_Z();
		} else if (val1 < val2) {
			this.SR.set_S();
		}
	}

	execute_device_write(device) {
		this.output_devices[device].write(this.AL.get());
	}

	execute_device_read(device) {
		this.AL.set(this.input_devices[device].read());
	}

	execute(command, operands, target_register) {
		let tmp;

		// ADD COMMAND
		switch (command) {
			// ADD
			case 0xa0:
			case 0xb0:
				target_register.set(operands[0] + operands[1]);
				break;
			// SUB
			case 0xa1:
			case 0xb1:
				target_register.set(operands[0] - operands[1]);
				break;
			// MUL
			case 0x0b2:
			case 0x0a2:
				target_register.set(Math.floor(operands[0] * operands[1]));
				break;
			// DIV
			case 0x0b3:
			case 0x0a3:
				target_register.set(Math.floor(operands[0] / operands[1]));
				break;
			// MOD
			case 0x0b6:
			case 0x0a6:
				target_register.set(operands[0] % operands[1]);
				break;
			// NOT
			case 0xad:
				target_register.set(~target_register.get());
				break;
			case 0x9c: // SHL
				target_register.set(operands[0] << 1);
				break;
			case 0x9d: // SHR
				target_register.set((operands[0] >> 1) & 0x7f); // >> is sign preserving, >>> is
				break;
			case 0x9a: // ROL
				tmp = (operands[0] & 0x80) > 0 ? 0x01 : 0x00;
				target_register.set((operands[0] << 1) | tmp);
				break;
			case 0x9b: // ROR
				tmp = (operands[0] & 0x01) > 0 ? 0x80 : 0x00;
				target_register.set((operands[0] >> 1) | tmp);
				break;
			// AND
			case 0x0ba:
			case 0x0aa:
				target_register.set(operands[0] & operands[1]);
				break;
			// OR
			case 0x0bb:
			case 0x0ab:
				target_register.set(operands[0] | operands[1]);
				break;
			// XOR
			case 0x0bc:
			case 0x0ac:
				target_register.set(operands[0] ^ operands[1]);
				break;
			// MOV
			case 0xd0:
			case 0xd1:
			case 0xd3:
			case 0xd2:
			case 0xd4:
				this.execute_move(command, operands, target_register);
				break;
			// JMP
			case 0xc0:
			case 0xc1:
			case 0xc2:
			case 0xc3:
			case 0xc4:
			case 0xc5:
			case 0xc6:
				this.execute_jump(command, operands, target_register);
				break;
			// CMP
			case 0xda:
				// register register
				this.execute_cmp(operands[0], operands[1]);
				break;
			case 0xdb:
				// register immediate
				this.execute_cmp(operands[0], operands[1]);
				break;
			case 0xdc:
				// register dmemory
				this.execute_cmp(operands[0], this.ram.get(operands[1]));
				break;
			// INC
			case 0xa4:
				target_register.set(target_register.get() + 1);
				break;
			// DEC
			case 0xa5:
				target_register.set(target_register.get() - 1);
				break;
			// CALL
			case 0xca:
				this.ram.set(this.SP.get(), this.IP.get() + 2);
				this.SP.increment(-1);
				target_register.set(operands[0]);
				break;
			// RET, IRET
			case 0xcb:
			case 0xcd:
				this.SP.increment();
				target_register.set(this.ram.get(this.SP.get()) - 1);
				break;
			// PUSH
			case 0xe0:
				this.ram.set(this.SP.get(), operands[0]);
				this.SP.increment(-1);
				break;
			// POP
			case 0xe1:
				this.SP.increment();
				target_register.set(this.ram.get(this.SP.get()));
				break;
			// PUSHF
			case 0xea:
				this.ram.set(this.SP.get(), this.SR.get());
				this.SP.increment(-1);
				break;
			// POPF
			case 0xeb:
				this.SP.increment();
				this.SR.set(this.ram.get(this.SP.get()));
				break;
			// IN
			case 0xf0:
				this.execute_device_read(operands[0]);
				break;
			// OUT
			case 0xf1:
				this.execute_device_write(operands[0]);
				break;
			// INT
			case 0xcc:
				this.ram.set(this.SP.get(), this.IP.get());
				this.SP.increment(-1);
				target_register.set(this.ram.get(operands[0] + 2) - 2);
				break;
			case 0xfc:
				this.SR.set_I;
				break;
			case 0xfd:
				this.SR.clear_I;
				break;
			// NOP
			case 0xff:
				break;
		}

		return target_register.get();
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
