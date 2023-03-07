let default_base = 16;
let default_pad = 2;
let ignore_zero = true;

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

	const base_options = [
		{ label: "Binary", value: 2, pad: 8 },
		{ label: "Decimal", value: 10, pad: 3 },
		{ label: "Hexadecimal", value: 16, pad: 2 },
		// { label: "ASCII", value: 0, pad: 1 },
	];
	init_base_radio_buttons(
		"dRadioBaseContainer",
		base_options,
		"base",
		function (option) {
			console.log("Selected base:", option.value);
			default_base = option.value;
			default_pad = option.pad;

			let local_ram = sim.ram.copy();
			print_ram(local_ram, sim.IP.get());
			print_assembler_result(asm);
		}
	);

	const zero_options = [
		{ label: "OFF", value: false },
		{ label: "ON", value: true },
	];
	init_base_radio_buttons(
		"dRadioZeroContainer",
		zero_options,
		"zero",
		function (option) {
			ignore_zero = option.value;

			let local_ram = sim.ram.copy();
			print_ram(local_ram, sim.IP.get());
			print_assembler_result(asm);
		}
	);
});

function assemble() {
	let lines = $("#taASM").val().split("\n");

	console.clear();

	asm.main(lines);

	print_assembler_result(asm);
	let ram = asm.commands_to_ram();

	// load compiled program to sim
	sim.init();
	sim.load_program(ram);
	print_ram(ram, sim.IP.get());
	// print_tags();
}

function run() {
	// Simulator
	sim.run();
}

function step() {
	sim.step();
}

function reset() {
	sim.init_registers();
	print_ram(sim.ram.copy(), sim.IP.get());
}

function stop() {}

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

function print_ram(ram, IP) {
	for (let i = 0; i < 16; i++) {
		for (let j = 0; j < 16; j++) {
			const ram_idx = i * 16 + j;
			const cell = $("#cell-" + i + "-" + j);
			let tmp_cell_text = ram[ram_idx];

			if (ignore_zero && tmp_cell_text == 0) {
				tmp_cell_text = ".";
			} else {
				tmp_cell_text = tmp_cell_text
					.toString(default_base)
					.padStart(default_pad, "0")
					.padEnd(default_pad + 1, " ");
			}
			cell.text(tmp_cell_text.toUpperCase());

			// // Color cell
			// if (ram_idx == IP) {
			// 	cell.css("color", "#00FF00");
			// } else {
			// 	cell.css("color", "#FFFFFF");
			// }
			let color = "#FFFFFF";
			if (ram_idx == IP) {
				color = "#00FF00";
			}
			color_ram(ram_idx, color);
		}
	}
}

function color_ram(cell_idx, color) {
	// Color cell
	let cell = $("#cell-" + Math.floor(cell_idx / 16) + "-" + (cell_idx % 16));
	cell.css("color", color);
}

function update_register(reg, value) {
	if (reg != "td") {
		$("#" + reg).html(value.toString(default_base).toUpperCase());
	}
}

// Add radion buttons
function init_base_radio_buttons(parent, options, name, on_click) {
	const $radioContainer = $("#" + parent);

	$.each(options, function (index, option) {
		// Create the radio button element and its label
		const $radioBtn = $("<input>", {
			type: "radio",
			name: name,
			value: option.value,
		});
		const $label = $("<label>", { text: option.label });

		// Add the radio button and label to the container element
		$radioContainer.append($radioBtn).append($label);

		// Attach an onclick event handler to the radio button
		$radioBtn.on("click", function () {
			on_click(option);
		});
	});
}
