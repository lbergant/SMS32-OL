const OperandType = {
	register: "register",
	// immediate
	immediate: "immediate",
	// direct memory
	dmemory: "dmemory",
	//indirect memroy
	imemory: "imemory",
	// tag
	tag: "tag",
	// string
	data_bytes: "data_bytes",
	// default
	default: "default",
};

const CommandType = {
	// two operands
	register_register: "register_register",
	register_immediate: "register_immediate",
	immediate_register: "immediate_register",
	register_dmemory: "register_dmemory",
	dmemory_register: "dmemory_register",
	register_imemory: "register_imemory",
	imemory_register: "imemory_register",

	// one operand
	jump: "jump",
	immediate: "immediate",
	register: "register",
	data_byte: "data_byte",
	data_bytes: "data_bytes",

	// no operands,
	noop: "noop",
	// tags
	tag: "tag",
	// command
	comment: "comment",
	// unidentified
	unidentified: "unidentified",
	// default
	default: "default",
};

function get_register_index(text_register) {
	switch (text_register) {
		case "AL":
			return 0x00;
		case "BL":
			return 0x01;
		case "CL":
			return 0x02;
		case "DL":
			return 0x03;
	}
}

/***
 * [SIM] Gets command type from op_code. Reverse of ```get_op_code```.
 * @returns CommandType - type of command
 */
function get_op_type(op_code) {
	// ADD COMMAND
	// prettier-ignore
	switch (op_code) {
		case 0xa0: case 0xa1: case 0xa2: case 0xa3: // ADD, SUB, MUL, DIV
		case 0xa6: case 0xaa: case 0xab: case 0xac: // MOD, AND, OR, XOR
		case 0xda: // CMP reg-reg,
		  return CommandType.register_register;
		case 0xb0: case 0xb1: case 0xb2: case 0xb3: // ADD, SUB, MUL, DIV
		case 0xa6: case 0xba: case 0xbb: case 0xbc: // MOD, AND, OR, XOR 
		case 0xdb: //  CMP reg-imm
		case 0xd0: // MOV imm to reg
		  return CommandType.register_immediate;
		case 0xd3: // MOV 
			return CommandType.register_imemory;
		case 0xd4: // MOV 
			return CommandType.imemory_register;
		case 0xd1:  case 0xdc: // MOV, CMP
		  return CommandType.register_dmemory;
		case 0xd2: // MOV dmem reg
			return CommandType.dmemory_register
		case 0xc0: case 0xc6: case 0xc4: // JMP, JNO, JNS
		case 0xc2: case 0xc5: case 0xc3: // JNZ, JO, JS
		case 0xc1: case 0xca: case 0xcb: // JZ, CALL, RET
		  return CommandType.jump;
		case 0x9a: case 0x9b: case 0x9c: case 0x9d: // ROL, ROR, SHL, SHR
		case 0xad: // NOT
		case 0xa4: case 0xa5: // INC, DEC
		case 0xe0: case 0xe1: // PUSH, POP
		  return CommandType.register;
		case 0xea: case 0xeb: // PUSHF, POPF
		case 0xff: // NOP
		  return CommandType.noop;
	  }

	return CommandType.unidentified;
}

/***
 * [ASM] Gets op code from command and its type. Reverse of ```get_type```.
 */
function get_op_code(text_command, type) {
	// ADD COMMAND
	switch (text_command.toUpperCase()) {
		case "ADD":
			switch (type) {
				case CommandType.register_register:
					return 0xa0;
				case CommandType.register_immediate:
					return 0xb0;
			}
		case "SUB":
			switch (type) {
				case CommandType.register_register:
					return 0xa1;
				case CommandType.register_immediate:
					return 0xb1;
			}
		case "MOV":
			switch (type) {
				case CommandType.register_immediate:
					return 0xd0;
				case CommandType.register_dmemory:
					return 0xd1;
				case CommandType.dmemory_register:
					return 0xd2;
				case CommandType.register_imemory:
					return 0xd3;
				case CommandType.imemory_register:
					return 0xd4;
			}
			break;

		case "JMP":
			switch (type) {
				case CommandType.jump:
					return 0xc0;
			}
			break;
		case "END":
		case "HALT":
			return 0x00;
		case "DB":
			switch (type) {
				case CommandType.immediate:
					return -1;
				case CommandType.data_bytes:
					return -2;
			}
			break;
		case "ORG":
			switch (type) {
				case CommandType.immediate:
					return -127;
			}
		case "JNO":
			return 0xc6;
		case "JNS":
			return 0xc4;
		case "JNZ":
			return 0xc2;
		case "JO":
			return 0xc5;
		case "JS":
			return 0xc3;
		case "JZ":
			return 0xc1;
		case "CALL":
			return 0xca;
		case "RET":
			return 0xcb;
		case "CMP":
			switch (type) {
				case CommandType.register_register:
					return 0xda;
				case CommandType.register_immediate:
					return 0xdb;
				case CommandType.register_dmemory:
					return 0xdc;
			}

		case "INC":
			return 0xa4;
		case "DEC":
			return 0xa5;
		case "MUL": // DIV
			switch (type) {
				case CommandType.register_immediate:
					return 0xb2;
				case CommandType.register_register:
					return 0xa2;
			}
		case "DIV": // DIV
			switch (type) {
				case CommandType.register_immediate:
					return 0xb3;
				case CommandType.register_register:
					return 0xa3;
			}
		case "MOD":
			switch (type) {
				case CommandType.register_immediate:
					return 0xb6;
				case CommandType.register_register:
					return 0xa6;
			}
		case "AND":
			switch (type) {
				case CommandType.register_immediate:
					return 0xba;
				case CommandType.register_register:
					return 0xaa;
			}
		case "OR":
			switch (type) {
				case CommandType.register_immediate:
					return 0xbb;
				case CommandType.register_register:
					return 0xab;
			}
		case "XOR":
			switch (type) {
				case CommandType.register_immediate:
					return 0xbc;
				case CommandType.register_register:
					return 0xac;
			}
		case "ROL":
			return 0x9a;
		case "ROR":
			return 0x9b;
		case "SHL":
			return 0x9c;
		case "SHR":
			return 0x9d;
		case "NOT":
			return 0xad;
		case "PUSH":
			return 0xe0;
		case "POP":
			return 0xe1;
		case "PUSHF":
			return 0xea;
		case "POPF":
			return 0xeb;
		case "NOP":
			return 0xff;
	}

	return -128;
}

function get_command_len(op_code) {
	// ADD COMMAND
	// prettier-ignore
	switch (op_code) {
		// END, HALT
		case 0x00:
		case 0xcb: case 0xff: // RET NOP
		case 0xea: case 0xeb: // PUSHF POPF
			return 0;
		case 0xc0: case 0xc1: case 0xc2: case 0xc3: // JMP
		case 0xc4: case 0xc5: case 0xc6: // JMP
		case 0xca: // Call
		case 0xad: // NOT
		case 0xa4: case 0xa5:// INC DEC
		case 0xe0: case 0xe1: // PUSH POP
		case 0x9a: case 0x9b: // ROL ROR
		case 0x9c: case 0x9d: // SHL SHR
			return 1;
		case 0xa0: case 0xb0: // ADD ADD
		case 0xa1: case 0xb1: // SUB SUB
		case 0xd0: case 0xd1: // MOV MOV
		case 0xd2: case 0xd3: case 0xd4: // MOV MOV MOV
		case 0xda: case 0xdb: case 0xdc: // CMP
		case 0xb2: case 0xa2: // MUL MUL
		case 0xb3: case 0xa3: // DIV DIV
		case 0xb6: case 0xa6: // MOD MOD
		case 0xaa: case 0xba: // AND AND
		case 0xbb: case 0xab: // OR OR
		case 0xbc: case 0xac: // XOR XOR
			return 2;
	}

	return 10;
}
