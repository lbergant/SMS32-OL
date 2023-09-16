function displayDigit(display, digit) {
	// Define segment configurations for digits 0 through 9
	const segments = [
		[1, 1, 1, 1, 1, 1, 0], // 0
		[0, 1, 1, 0, 0, 0, 0], // 1
		[1, 1, 0, 1, 1, 0, 1], // 2
		[1, 1, 1, 1, 0, 0, 1], // 3
		[0, 1, 1, 0, 0, 1, 1], // 4
		[1, 0, 1, 1, 0, 1, 1], // 5
		[1, 0, 1, 1, 1, 1, 1], // 6
		[1, 1, 1, 0, 0, 0, 0], // 7
		[1, 1, 1, 1, 1, 1, 1], // 8
		[1, 1, 1, 1, 0, 1, 1], // 9
	];

	const segmentElements = display.find(".segment");

	// Turn on/off segments based on the digit
	for (let i = 0; i < 7; i++) {
		if (segments[digit][i] === 1) {
			segmentElements.eq(i).addClass("on");
		} else {
			segmentElements.eq(i).removeClass("on");
		}
	}
}

function byteToBinaryArray(byte) {
	if (byte >= 0 && byte <= 255) {
		const binaryString = byte.toString(2).padStart(8, "0"); // Convert to binary and pad to 8 bits
		const binaryArray = binaryString.split("").map(Number);
		return binaryArray;
	} else {
		console.error("Invalid byte value. Byte value must be between 0 and 255.");
		return [];
	}
}

function displayRaw(display, digit) {
	display = $(".display:eq(" + display + ")");
	const segmentElements = display.find(".segment");

	if (digit < 0) digit += 256;

	segments = byteToBinaryArray(digit);

	// Turn on/off segments based on the digit
	for (let i = 0; i < 7; i++) {
		if (segments[i] === 1) {
			segmentElements.eq(i).addClass("on");
		} else {
			segmentElements.eq(i).removeClass("on");
		}
	}
}

// // Example usage:
// displayDigit($(".display:eq(0)"), 1); // Display the digit '3' on the first display
// displayDigit($(".display:eq(1)"), 7); // Display the digit '7' on the second display
