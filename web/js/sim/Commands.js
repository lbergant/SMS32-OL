const OpType = {
	register,
	// immediate
	immediate,
	// direct memory
	dmemory,
	//indirect memroy
	imemory,
	// one operand
	jump,
	// tags
	tag,
	// default
	unknown,
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
