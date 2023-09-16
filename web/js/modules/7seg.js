function displayDigit(display, digit) {
	// Define which segments should be on for each digit
	const segments = [
		[1, 1, 1, 1, 1, 1, 0], // 0
		[0, 1, 1, 0, 0, 0, 0], // 1
		// Define segments for other digits
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
