let numberOfDots = 24;
let same = 4;

function init_motor() {
	// Get the container element
	var container = $(".dot-container");

	// Calculate the angle between each dot
	var angle = 360 / numberOfDots;

	// Calculate the radius of the circle based on container dimensions
	var containerWidth = container.width();
	var containerHeight = container.height();
	var radius = Math.min(containerWidth, containerHeight) / 2;

	// Create and append the dots
	for (var i = 0; i < numberOfDots; i++) {
		var dot = $('<div class="dot dot-' + (i % same) + '"></div>');

		// Calculate the position of each dot relative to the container
		var x = radius * Math.cos((angle * i * Math.PI) / 180);
		var y = radius * Math.sin((angle * i * Math.PI) / 180);

		// Set the position of the dot relative to the container
		dot.css({
			position: "absolute",
			top: "calc(50% + " + y + "px)",
			left: "calc(50% + " + x + "px)",
		});
		dot.html(2 ** (i % same));

		// Append the dot to the container
		container.append(dot);
	}
}

function updateDotCSS(inval, color) {
	$(".dot-" + inval).css({
		"background-color": color,
	});
}

function clear_dots() {
	$(".dot").css({
		"background-color": "lightgrey",
	});
}

let pos = 0;
let cnt = 1;

function rotate_motor(deg) {
	move_motor(cnt);
	cnt = cnt + 1;
	if (cnt > 15) cnt = 1;
}

function move_motor(value) {
	let arr = byte_to_bin_arr(value);
	clear_dots();

	for (let i = arr.length - 1; i > 3; i--) {
		if (arr[i] == 1) {
			updateDotCSS(arr.length - 1 - i, "var(--secondary)");
		}
	}

	switch (value) {
		case 15:
		case 11:
		case 1:
			pos = 0;
			break;
		case 7:
		case 5:
		case 2:
			pos = 1;
			break;
		case 14:
		case 10:
		case 4:
			pos = 2;
			break;
		case 13:
		case 8:
			pos = 3;
			break;
		case 3:
			pos = 0.5;
			break;
		case 6:
			pos = 1.5;
			break;
		case 9:
			pos = 3.5;
			break;
		case 12:
			pos = 2.5;
			break;
	}

	deg = pos * 15;
	$(".star").css({
		transform: "rotate(" + deg + "deg)",
	});
}

function byte_to_bin_arr(byte) {
	if (byte >= 0 && byte <= 255) {
		const binaryString = byte.toString(2).padStart(8, "0"); // Convert to binary and pad to 8 bits
		const binaryArray = binaryString.split("").map(Number);
		return binaryArray;
	} else {
		console.error("Invalid byte value. Byte value must be between 0 and 255.");
		return [];
	}
}
