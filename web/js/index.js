let default_base = 16;
let default_pad = 3;

let asm = new Assembler();
let sim = new Simulator();

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

	$("#taDisAsm").val("");
	$("#taRam").val("");

	init_base_radio_buttons();
});

function assemble() {
	let lines = $("#taASM").val().split("\n");

	console.clear();
	console.log(lines);

	asm.main(lines);

	print_assembler_result(asm);
	let ram = asm.commands_to_ram();
	print_ram(ram, default_base);
	// print_tags();

	// load compiled program to sim
	sim.load_program(ram);
}

function run() {
	// Simulator
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
			opCode = opCode
				.toString(default_base)
				.toUpperCase()
				.padStart(default_pad, "0");
		}

		ram_text +=
			asm.commands[i].address
				.toString(default_base)
				.toUpperCase()
				.padStart(default_pad, "0") +
			": " +
			opCode;

		// add operands to line
		for (let j = 0; j < asm.commands[i].operands.length; j++) {
			ram_text +=
				" " +
				asm.commands[i].operands[j].value
					.toString(default_base)
					.toUpperCase()
					.padStart(default_pad, "0");
		}

		// left pad for shorter instructions
		for (let j = 0; j < 2 - asm.commands[i].operands.length; j++) {
			ram_text += "   ";
		}

		ram_text += "\t" + asm.commands[i].line + "\n";
	}
	$("#taDisAsm").val(ram_text);
}

function print_ram(ram, base, IP) {
	let ram_text = " ".repeat(default_pad + 2);

	for (let i = 0; i < 16; i++)
		ram_text += i
			.toString(default_base)
			.toUpperCase()
			.padStart(default_pad, "0")
			.padEnd(default_pad + 1);

	for (let i = 0; i < ram.length; i++) {
		if (i == IP) {
		}
		if (i % 16 == 0)
			ram_text += "\n" + i.toString(default_base).padStart(default_pad) + ": ";
		if (base == 0) {
			ram_text += String.fromCharCode(ram[i]).toUpperCase().padEnd(2);
		} else {
			ram_text += ram[i]
				.toString(base)
				.toUpperCase()
				.padStart(default_pad, "0")
				.padEnd(default_pad + 1);
		}
	}

	$("#taRam").val(ram_text);
}

function update_register(reg, value) {
	if (reg != "td") {
		$("#" + reg).html(value.toString(default_base).toUpperCase());
	}
}

// Test radio
function init_base_radio_buttons() {
	const baseOptions = [
		{ label: "Binary", value: 2, pad: 8 },
		{ label: "Decimal", value: 10, pad: 3 },
		{ label: "Hexadecimal", value: 16, pad: 2 },
		// { label: "ASCII", value: 0, pad: 1 },
	];

	const $radioContainer = $("#dRadioContainer");

	$.each(baseOptions, function (index, option) {
		// Create the radio button element and its label
		const $radioBtn = $("<input>", {
			type: "radio",
			name: "base",
			value: option.value,
		});
		const $label = $("<label>", { text: option.label });

		// Add the radio button and label to the container element
		$radioContainer.append($radioBtn).append($label);

		// $("#")

		// Attach an onclick event handler to the radio button
		$radioBtn.on("click", function () {
			console.log("Selected base:", option.value);
			default_base = option.value;
			default_pad = option.pad;

			let local_ram = sim.ram.copy();
			print_ram(local_ram, default_base);
			print_assembler_result(asm);
		});
	});
}
