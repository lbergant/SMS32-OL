$(document).ready(function () {
	draw_table("tVDU", 9, 3, ".");
	// TODO fill 1st row/col numbers
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 9; j++) {
			const cell = $("#tVDU_cell-" + i + "-" + j);

			if ((i == 0) ^ (j == 0)) {
				if (i == 0) cell.html(j - 1);
				if (j == 0) cell.html((i - 1) * 8 + ":");
			} else if (i == 0 && j == 0) {
				cell.html("");
			}
		}
	}
});

function update_SVG_GUI(pos, value) {
	pos -= 0xc0;

	const cell = $(
		"#tVDU_cell-" + (Math.floor(pos / 8) + 1) + "-" + ((pos % 8) + 1)
	);

	cell.html(String.fromCharCode(value));
}
