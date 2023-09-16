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

// // Example usage:
// displayDigit($(".display:eq(0)"), 1); // Display the digit '3' on the first display
// displayDigit($(".display:eq(1)"), 7); // Display the digit '7' on the second display
