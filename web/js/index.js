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
	print_tags();
}

function print_tags() {
	let tag_text = "";
	let tag_pad = "          ";

	for (let i = 0; i < tags.length; i++) {
		tag_text += tags[i].name.padEnd(10) + " @ " + tags[i].address + "\n";
	}

	$("#taTag").val(tag_text);
}

function print_assembler_result(asm) {
	let ram_text = "";

	for (let i = 0; i < asm.commands.length; i++) {
		// add address and command to line
		ram_text +=
			asm.commands[i].address.toString(16).toUpperCase().padStart(4, "0") +
			": " +
			asm.commands[i].op_code.toString(16).toUpperCase().padStart(2, "0");

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
	$("#taMem").val(ram_text);
}
