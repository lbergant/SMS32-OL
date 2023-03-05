$(document).ready(function () {
	// ASM editor
	$("#taASM").keydown(function (e) {
		var keyCode = e.keyCode || e.which;

		if (keyCode == 9) {
			e.preventDefault();
			// call custom function here
			document.execCommand("insertText", false, "\t");
		}
	});
});

function assemble() {
	let lines = $("#taASM").val().split("\n");

	console.clear();
	console.log(lines);

	let asm = new Assembler();
	asm.main(lines);

	print_assembler_result(asm);
	let ram = asm.commands_to_ram();
	print_ram(ram, 16);
	// print_tags();

	// Simulator
	let sim = new Simulator();
	sim.load_program(ram);
	sim.run();
}

function print_tags() {
	let tag_text = "";

	for (let i = 0; i < tags.length; i++) {
		tag_text += tags[i].name.padEnd(10) + " @ " + tags[i].address + "\n";
	}

	$("#taRam").val(tag_text);
}

function print_assembler_result(asm) {
	let ram_text = "";

	for (let i = 0; i < asm.commands.length; i++) {
		// add address and command to line
		let opCode = asm.commands[i].op_code;
		if (opCode != "") {
			opCode = opCode.toString(16).toUpperCase().padStart(2, "0");
		}

		ram_text +=
			asm.commands[i].address.toString(16).toUpperCase().padStart(4, "0") +
			": " +
			opCode;

		// add operands to line
		for (let j = 0; j < asm.commands[i].operands.length; j++) {
			ram_text +=
				" " +
				asm.commands[i].operands[j].value
					.toString(16)
					.toUpperCase()
					.padStart(2, "0");
		}

		// left pad for shorter instructions
		for (let j = 0; j < 2 - asm.commands[i].operands.length; j++) {
			ram_text += "   ";
		}

		ram_text += "\t" + asm.commands[i].line + "\n";
	}
	$("#taDisAsm").val(ram_text);
}

function print_ram(ram, base) {
	let ram_text = "    ";
	let pad = 4;

	for (let i = 0; i < 16; i++)
		ram_text += i.toString(16).toUpperCase().padStart(2, "0").padEnd(pad);

	for (let i = 0; i < ram.length; i++) {
		if (i % 16 == 0) ram_text += "\n" + i.toString(16).padStart(2) + ": ";
		if (base == 10 || base == 16)
			ram_text += ram[i]
				.toString(base)
				.toUpperCase()
				.padStart(2, "0")
				.padEnd(pad);
		else ram_text += String.fromCharCode(ram[i]).toUpperCase().padEnd(pad);
	}

	$("#taRam").val(ram_text);
}
