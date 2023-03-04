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

	console.log(lines);

	let asm = new Assembler();
	asm.main(lines);

	let ram_text = "";
	let pad_addr = "0000";
	let pad = "00";

	for (let i = 0; i < asm.commands.length; i++) {
		// add address and command to line
		ram_text +=
			(pad_addr + asm.commands[i].address.toString(16).toUpperCase()).slice(
				-pad_addr.length
			) +
			": " +
			(pad + asm.commands[i].op_code.toString(16).toUpperCase()).slice(
				-pad.length
			);

		// add operands to line
		for (let j = 0; j < asm.commands[i].operands.length; j++) {
			ram_text +=
				" " +
				(
					pad + asm.commands[i].operands[j].value.toString(16).toUpperCase()
				).slice(-pad.length);
		}

		// left pad for shorter instructions
		for (let j = 0; j < 2 - asm.commands[i].operands.length; j++) {
			ram_text += "   ";
		}

		ram_text += "\t" + asm.commands[i].line + "\n";
	}
	$("#taMem").val(ram_text);
}
