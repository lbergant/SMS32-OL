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
	data_byte: "data_byte",
	data_bytes: "data_bytes",
	// no operands,
	end: "end",
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
	switch (op_code) {
		case 0xa0: // ADD
			return CommandType.register_register;
		case 0xb0: // ADD
		case 0xd0: // MOV
			return CommandType.register_immediate;
		case 0xd1: // MOV
			return CommandType.register_dmemory;
		case 0xd2: // MOV
			return CommandType.dmemory_register;
		case 0xd3: // MOV
			return CommandType.register_imemory;
		case 0xd4: // MOV
			return CommandType.imemory_register;
		case 0xc0: // JMP
			return CommandType.jump;
		case 0xc6: //JNO
			return CommandType.jump;
		case 0xc4: //JNS
			return CommandType.jump;
		case 0xc2: //JNZ
			return CommandType.jump;
		case 0xc5: //JO
			return CommandType.jump;
		case 0xc3: //JS
			return CommandType.jump;
		case 0xc1: //JZ
			return CommandType.jump;
		case 0xca: // CALL
			return CommandType.jump;
		case 0xcb: // RET
			return CommandType.jump;
		case 0xda:
			return CommandType.register_register;
		case 0xdb:
			return CommandType.register_immediate;
		case 0xdc:
			return CommandType.register_dmemory;
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
			switch (type) {
				case CommandType.end:
					return 0x00;
			}
			break;
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
	}

	return -128;
}

function get_command_len(op_code) {
	// ADD COMMAND
	switch (op_code) {
		// END, HALT
		case 0x00:
		// RET
		case 0xcb:
			return 0;
		// JMP
		case 0xc0:
		case 0xc1:
		case 0xc2:
		case 0xc3:
		case 0xc4:
		case 0xc5:
		case 0xc6:
		// Call
		case 0xca:
			return 1;
		// ADD
		case 0xa0:
		case 0xb0:
		// MOV
		case 0xd0:
		case 0xd1:
		case 0xd2:
		case 0xd3:
		case 0xd4:
		// CMP
		case 0xda:
		case 0xdb:
		case 0xdc:
			return 2;
	}

	return 10;
}
