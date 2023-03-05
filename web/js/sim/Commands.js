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
	tag: "tag",
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

function get_register(text_register) {
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

function get_op_code(text_command, type) {
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
	}

	return -128;
}
