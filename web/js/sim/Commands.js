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
	// default
	default: "default",
};

const CommandType = {
	// common types
	register_register: "register_register",
	register_dmemory: "register_dmemory",
	dmemory_register: "dmemory_register",
	register_imemory: "register_imemory",
	imemory_register: "imemory_register",

	// one operand
	jump: "jump",
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

function get_op_code(text_command, type) {
	switch (text_command) {
		case "ADD":
			switch (type) {
				case register_register:
					return 0xa0;
				case register_Immediate:
					return 0xb0;
			}

		case "MOV":
			switch (type) {
				case register_Immediate:
					return 0xd0;
				case register_dmemory:
					return 0xd1;
				case dmemory_register:
					return 0xd2;
				case register_imemory:
					return 0xd3;
				case imemory_register:
					return 0xd4;
			}
			break;
	}
}
