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

	const base_options = [
		// { label: "Binary", value: 2, pad: 8 },
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
			print_assembler_result(asm);
			print_ram(local_ram);
			let color = "#FFFFFF";
			color_ram(ram_idx, color);
			change_register_base();
		}
	);

	const zero_options = [
		{ label: "ON", value: false },
		{ label: "OFF", value: true },
	];
	init_base_radio_buttons(
		"dRadioZeroContainer",
		zero_options,
		"zero",
		function (option) {
			ignore_zero = option.value;

			let local_ram = sim.ram.copy();
			print_ram(local_ram);
			color_ram(sim.IP.get(), "#00FF00");
			print_assembler_result(asm);
			color_dis_asm();
		}
	);

	draw_table("tRAM", 17, 16);
});

function draw_table(table_name, x_size, y_size) {
	let table = $("#" + table_name);
	let table_txt = "<tbody>";
	for (let i = 0; i < y_size; i++) {
		table_txt += "<tr>";
		for (let j = 0; j < x_size; j++) {
			table_txt +=
				'<td class="' +
				table_name +
				'_td_class" id="' +
				table_name +
				"_cell-" +
				i +
				"-" +
				j +
				'">.</td>';
		}
		table_txt += "</tr>";
	}
	table_txt += "</tbody>";
	table.html(table_txt);
}

function change_register_base() {
	let registers = $(".register");
	for (let i = 0; i < registers.length; i++) {
		let val = Number.parseInt(
			registers[i].innerHTML,
			default_base == 16 ? 10 : 16
		);
		registers[i].innerHTML = val.toString(default_base).toUpperCase();
	}
}

function assemble() {
	let lines = $("#taASM").val().split("\n");

	console.clear();

	asm.main(lines);

	let ram = asm.commands_to_ram();

	// load compiled program to sim
	sim.init();
	sim.load_program(ram);

	print_ram(ram);
	color_ram(sim.IP.get(), "#00FF00");
	print_assembler_result(asm);
	color_dis_asm(0, "#00FF00");
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
	color_ram(sim.IP.get(), "#00FF00");
	color_dis_asm(0, "#00ff00");
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
	draw_table("tDisAsm", 3, asm.commands.length);

	for (let i = 0; i < asm.commands.length; i++) {
		let cell = $("#tDisAsm_cell-" + i + "-0");
		cell.text(
			asm.commands[i].address
				.toString(default_base)
				.toUpperCase()
				.padStart(default_pad, "0") + ":"
		);
		cell.css("width", 40);

		// address to string
		let op_code = asm.commands[i].op_code;
		if (op_code != "") {
			op_code = op_code
				.toString(default_base)
				.toUpperCase()
				.padStart(default_pad, "0");
		}

		// operands to string
		let ram_text = "";
		for (let j = 0; j < asm.commands[i].operands.length; j++) {
			ram_text +=
				" " +
				asm.commands[i].operands[j].value
					.toString(default_base)
					.toUpperCase()
					.padStart(default_pad, "0");
		}

		cell = $("#tDisAsm_cell-" + i + "-1");
		cell.text(op_code + ram_text);

		cell = $("#tDisAsm_cell-" + i + "-2");
		cell.text(asm.commands[i].line);
	}
	// $("#taDisAsm").val(ram_text);
}

function print_ram(ram) {
	for (let i = 0; i < 16; i++) {
		for (let j = 0; j < 17; j++) {
			const cell = $("#tRAM_cell-" + i + "-" + j);
			let tmp_cell_text = "";

			if (j == 0) {
				tmp_cell_text = (i * 16).toString(default_base) + ":";
			} else {
				const ram_idx = i * 16 + (j - 1);
				tmp_cell_text = ram[ram_idx];
				if (ignore_zero && tmp_cell_text == 0) {
					tmp_cell_text = ".";
				} else {
					tmp_cell_text = tmp_cell_text
						.toString(default_base)
						.padStart(default_pad, "0")
						.padEnd(default_pad + 1, " ");
				}
			}
			cell.text(tmp_cell_text.toUpperCase());
		}
	}
}

function color_ram(cell_idx, color) {
	// Clear all
	$(".tRAM_td_class").css("color", "");

	// Color cell
	let cell = $(
		"#tRAM_cell-" + Math.floor(cell_idx / 16) + "-" + ((cell_idx % 16) + 1)
	);
	cell.css("color", color);
}

function color_dis_asm(idx, color) {
	for (let i = 0; i < asm.commands.length; i++) {
		if (asm.commands[i].address == idx) {
			$("#tDisAsm_cell-" + i + "-0").css("color", color);
			$("#tDisAsm_cell-" + i + "-1").css("color", color);
			$("#tDisAsm_cell-" + i + "-2").css("color", color);
		} else {
			$("#tDisAsm_cell-" + i + "-0").css("color", "#FFFFFF");
			$("#tDisAsm_cell-" + i + "-1").css("color", "#FFFFFF");
			$("#tDisAsm_cell-" + i + "-2").css("color", "#FFFFFF");
		}
	}
}

function update_register(reg, value) {
	if (reg != "td") {
		$("#" + reg).html(value.toString(default_base).toUpperCase());
		$("#" + reg).css("color", "#00FF00");
	}
}

function clear_register_color() {
	$(".register").css("color", "#FFFFFF");
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
			checked: "checked",
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
