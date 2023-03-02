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
}
