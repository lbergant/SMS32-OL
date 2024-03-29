let default_base = 16;
let prev_base = 16;
let default_pad = 2;
let ignore_zero = false;
let default_highlight = getComputedStyle(
	document.documentElement
).getPropertyValue("--primary");
let default_text_color = getComputedStyle(
	document.documentElement
).getPropertyValue("--text");
let default_text_size = getComputedStyle(
	document.documentElement
).getPropertyValue("--font-size");

let asm = new Assembler();
let sim = new Simulator();

$(document).ready(function () {
	// ASM editor
	$("#taASM").keydown(function (e) {
		var keyCode = e.keyCode || e.which;

		if (keyCode == 9) {
			e.preventDefault();
			document.execCommand("insertText", false, "\t");
		}
	});

	init_radio_buttons();

	init_IO_checkboxes();

	draw_table("tRAM", 17, 16, "00");

	init_registers();

	init_file_selection();

	update_theme(get_cookie("SMS_theme"));
	init_colors();

	init_fonts();

	init_speed_slider();

	init_line_numbering();

	init_motor();
});

function init_registers() {
	let table = $("<table>").appendTo("#register-table-container");

	// Create an array of register names
	let registers = ["AL", "BL", "CL", "DL", "SP", "SR", "IP"];

	// Define rows
	let tr4 = $("<tr>").appendTo(table);
	let tr1 = $("<tr>").appendTo(table);
	let tr2 = $("<tr>").appendTo(table);
	let tr3 = $("<tr>").appendTo(table);

	for (let i = 0; i < registers.length; i++) {
		let registerName = registers[i];

		// Add the register name and the corresponding register ID
		$("<td>")
			.text(registerName + ":")
			.appendTo(tr4);
		$("<td>")
			.addClass("register")
			.attr("id", "td" + registerName)
			.css("width", "30px")
			.text("0")
			.appendTo(tr1);

		// Add additional rows for ALh, BLh, CLh, etc.
		// $("<td>").appendTo(tr2);
		$("<td>")
			.addClass("register")
			.attr("id", "td" + registerName + "h")
			.css("width", "30px")
			.text("0")
			.appendTo(tr2);

		// $("<td>").appendTo(tr3);
		$("<td>")
			.addClass("register")
			.attr("id", "td" + registerName + "b")
			.css("width", "30px")
			.text("0")
			.appendTo(tr3);
	}
}

function init_IO_checkboxes() {
	$(".custom-checkbox").prop("checked", false);
}

let $lineNumbers;
let $textarea;

function init_line_numbering() {
	$textarea = $("#taASM");
	$lineNumbers = $(".line-numbers");

	$textarea.on("input", updateLineNumbers);
	$textarea.on("scroll", updateScroll);

	updateLineNumbers();
}

function updateLineNumbers() {
	const lines = $textarea.val().split("\n");
	$lineNumbers.empty();

	for (let i = 0; i < lines.length; i++) {
		$lineNumbers.append(i + "<br>");
	}
}

function updateScroll() {
	$lineNumbers.css("margin-top", -$textarea.scrollTop() + "px");
}

function init_speed_slider() {
	$("#lSpeed").text($("#sSpeed").val());
}

function update_slider() {
	$("#lSpeed").text($("#sSpeed").val());
}

function get_speed_value() {
	return $("#sSpeed").val();
}

function init_file_selection() {
	// File selection
	$("#sFileSelect").change(function () {
		const selectedFile = $(this).val();

		if (!selectedFile) {
			$("#taASM").val("");
		} else {
			$.ajax({
				url: selectedFile,
				dataType: "text",
				success: function (data) {
					$("#taASM").val(data);
					updateLineNumbers();
				},
			});
		}
	});
}

function init_radio_buttons() {
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
			prev_base = default_base;
			default_base = option.value;
			default_pad = option.pad;

			let local_ram = sim.ram.copy();
			print_assembler_result(asm);
			color_dis_asm(sim.IP.get(), default_highlight);
			print_ram(local_ram);
			color_ram(sim.IP.get(), default_highlight);
			change_register_base();
		}
	);

	const zero_options = [
		{ label: "OFF", value: true },
		{ label: "ON", value: false },
	];
	init_base_radio_buttons(
		"dRadioZeroContainer",
		zero_options,
		"zero",
		function (option) {
			ignore_zero = option.value;

			let local_ram = sim.ram.copy();
			print_ram(local_ram);
			color_ram(sim.IP.get(), default_highlight);
		}
	);

	const light_options = [
		{ label: "Light", value: false },
		{ label: "Dark", value: true },
	];

	init_base_radio_buttons(
		"dSchemeContainer",
		light_options,
		"theme",
		function (option) {
			update_theme(option.value);
		}
	);

	const HWINtOptions = [
		{ label: "HW interrupt", value: HWMode.himHWFlag },
		{ label: "Timer", value: HWMode.himTimer },
	];

	init_base_radio_buttons(
		"dHWIntContainer",
		HWINtOptions,
		"HWMode",
		function (option) {
			sim.change_hw_interrupt_mode(option.value);
		}
	);
}

function update_theme(value) {
	if (value.toString() == "true") {
		$(":root").css("--text", "#FFFFFF");
		$(":root").css("--background", "#1f1f1f");
		default_text_color = "#FFFFFF";
		$('input[name="theme"]')[0].checked = false;
		$('input[name="theme"]')[1].checked = true;
		value = true;
	} else {
		$(":root").css("--text", "#000000");
		$(":root").css("--background", "#FFFFFF");
		default_text_color = "#000000";
		$('input[name="theme"]')[1].checked = false;
		$('input[name="theme"]')[0].checked = true;
		value = false;
	}
	clear_register_color();
	set_cookie("SMS_theme", value, 14);
}

function init_colors() {
	$("#iColorPicker").val(default_highlight);
	$("#iColorPicker").on("input", function () {
		let color_value = $(this).val();

		update_primary_color(color_value);

		set_cookie("SMS_color", color_value, 14);

		color_ram(sim.IP.get(), color_value);
		color_dis_asm(sim.IP.get(), color_value);
	});

	let cookie_value = get_cookie("SMS_color");
	if (cookie_value) {
		$("#iColorPicker").val(cookie_value);
		update_primary_color(cookie_value);
	}
}

function init_fonts(){
	let cookie_value = get_cookie("SMS_font_size");
	if (cookie_value) {
		$("#iFontSize").val(cookie_value);
		change_font_size();
	}
}

function change_font_size(){
	default_text_size = $("#iFontSize").val();
	$(":root").css("--font-size", default_text_size + "px");

	set_cookie("SMS_font_size", default_text_size, 14);
}

function set_cookie(name, value, days) {
	var expires = "";
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
		expires = "; expires=" + date.toUTCString();
	}
	document.cookie = name + "=" + value + expires + "; path=/;SameSite=Lax";
}

function get_cookie(name) {
	var cookies = document.cookie.split(";");
	for (var i = 0; i < cookies.length; i++) {
		var cookie = cookies[i].trim();
		if (cookie.indexOf(name) === 0) {
			return cookie.substring(name.length + 1, cookie.length);
		}
	}
	return false; // cookie not found
}

function draw_table(table_name, x_size, y_size, default_value) {
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
				'">' +
				default_value +
				"</td>";
		}
		table_txt += "</tr>";
	}
	table_txt += "</tbody>";
	table.html(table_txt);
}

function change_register_base() {
	// let registers = $(".register");
	// for (let i = 0; i < registers.length; i++) {
	// 	let val = Number.parseInt(registers[i].innerHTML, prev_base);
	// 	registers[i].innerHTML = val.toString(default_base).toUpperCase();
	// }
}

function download(){
	var text = $("#taASM").val();
	var blob = new Blob([text], { type: "text/plain;charset=utf-8" });
	var url = URL.createObjectURL(blob);
	var link = document.createElement("a");
	link.setAttribute("href", url);
	link.setAttribute("download", "SMS_Download.asm");
	link.style.display = "none";
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}

function assemble() {
	let lines = $("#taASM").val().split("\n");

	stop();
	console.clear();

	asm.main(lines);

	let ram = asm.commands_to_ram();

	// load compiled program to sim
	sim.reset();
	sim.load_program(ram);

	print_ram(ram);
	// for (let i = 0xC0; i < 0xD0; i++)
	// 	update_RAM_GUI(i, ram[i]);
	color_ram(sim.IP.get(), default_highlight);
	print_assembler_result(asm);
	color_dis_asm(0, default_highlight);
	// print_tags();
}

function run() {
	// Simulator
	sim.run();
}

function step() {
	sim.running = false;
	sim.step();
}

function reset() {
	sim.reset();
	color_ram(sim.IP.get(), default_highlight);
	color_dis_asm(0, default_highlight);

	// TODO: Reset Outputs
}

function stop() {
	sim.running = false;
}

function print_tags() {
	let tag_text = "";

	for (let i = 0; i < tags.length; i++) {
		tag_text += tags[i].name.padEnd(10) + " @ " + tags[i].address + "\n";
	}

	$("#taRam").val(tag_text);
}

function print_assembler_result(asm) {
	draw_table("tDisAsm", 3, asm.commands.length, "");

	for (let i = 0; i < asm.commands.length; i++) {
		let cell = $("#tDisAsm_cell-" + i + "-0");
		cell.text(
			asm.commands[i].address
				.toString(default_base)
				.toUpperCase()
				.padStart(default_pad, "0") + ":"
		);
		// cell.css("width", 40);

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
		// cell.css("width", 120);
		cell.text(op_code + ram_text);

		cell = $("#tDisAsm_cell-" + i + "-2");
		cell.css("min-width", "90px");
		cell.text(asm.commands[i].line);
	}
	// $("#taDisAsm").val(ram_text);
}

function update_RAM_GUI(address, value) {
	if (address >= 0xc0 && address < 0xc0 + 0x10) update_SVG_GUI(address, value);
	udpate_ram_position(address, value);
}

function udpate_ram_position(pos, value) {
	const cell = $("#tRAM_cell-" + Math.floor(pos / 16) + "-" + ((pos % 16) + 1));
	cell.html(
		value
			.toString(default_base)
			.padStart(default_pad, "0")
			.padEnd(default_pad + 1, " ")
	);
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
			$("#tDisAsm_cell-" + i + "-0").css("color", "");
			$("#tDisAsm_cell-" + i + "-1").css("color", "");
			$("#tDisAsm_cell-" + i + "-2").css("color", "");
		}
	}
}

function update_register(reg, value) {
	if (reg != "td") {
		if (value < 0) value += 256;
		$("#" + reg).html(value.toString(10).padStart(3, "0").toUpperCase());
		$("#" + reg).css("color", default_highlight);

		$("#" + reg + "h").html(value.toString(16).padStart(2, "0").toUpperCase());
		$("#" + reg + "h").css("color", default_highlight);

		$("#" + reg + "b").html(value.toString(2).padStart(8, "0").toUpperCase());
		$("#" + reg + "b").css("color", default_highlight);
	}
}

function clear_register_color() {
	$(".register").css("color", default_text_color);
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

function print_asm_error(error_lines) {
	if (error_lines.length == 0) {
		$("#error").text("");
	} else {
		let err_txt = "Assembler error on lines: ";
		error_lines.forEach(function (value, idx) {
			err_txt += value + ", ";
		});

		$("#error").text(err_txt.slice(0, err_txt.length - 2));
		$("#error").css("color", "red");
	}
}

function print_tag_error(error_lines) {
	if (error_lines.length == 0) {
		$("#tag_err").text("");
	} else {
		let err_txt = "Tag errors: ";
		error_lines.forEach(function (value, idx) {
			err_txt += value + ", ";
		});

		$("#tag_err").text(err_txt.slice(0, err_txt.length - 2));
		$("#tag_err").css("color", "red");
	}
}

let visible_modules = 0;

function toggle_output(name) {
	var $module = $("#" + name);
	if ($module.is(":visible")) {
		$("#" + name).hide();
		visible_modules--;
		if (visible_modules == 0) {
			$("#dCenter").css("height", "calc(100% - 60px)");
		}
	} else {
		$("#" + name).show();
		if (visible_modules == 0) {
			$("#dCenter").css("height", "715px");
		}
		visible_modules++;
	}
}

function toggle_hw_int() {
	let $div = $("#dHWInt");
	if ($div.is(":visible")) {
		$div.hide();
	} else {
		$div.show();
	}
}

function update_hw_interrupt_speed() {
	let hw_interval_value = $("#sHWIntSpeed").val();
	$("#lHWInt").text(hw_interval_value);
	sim.set_hw_interrupt_interval(hw_interval_value);
}
