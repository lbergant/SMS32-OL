class StatusRegister {
	constructor() {
		// SR
		this.Z = 0;
		this.S = 0;
		this.O = 0;
		this.I = 0;
	}
}

class Simulator {
	init_registers() {
		this.AL = 0;
		this.BL = 0;
		this.CL = 0;
		this.DL = 0;

		this.SR = new StatusRegister();

		// SP
		this.SP = 0;
		// IP
		this.IP = 0;
	}

	init_memory() {
		this.memory = new Array(256);
	}

	init() {
		this.init_registers();
		this.init_memory();
	}

	constructor() {
		this.init();
	}

	load_program(commands) {
		for (let i = 0; i < commands.length; i++) {
			// Add values to ram
		}
	}
}
