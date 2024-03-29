let charCode = 0;
let enteredChar = " ";

$(document).ready(function () {
	$("#char-input").keypress(function (e) {
		// Check if the entered value is a valid character (letters, numbers, symbols, etc.)
		$("#char-input").val("");
		charCode = e.which;
		if (is_valid_character(charCode)) {
			// Handle the input here (e.g., display it, send it to the server, etc.)
			enteredChar = String.fromCharCode(charCode);
			// console.log("Entered character: " + enteredChar + " " + Number(charCode));
		} else {
			// Prevent entering invalid characters
			e.preventDefault();
		}
	});

	// Handle button clicks on the numeric keypad
	$(".key").click(function () {
		enteredChar = $(this).text();
		// Append the clicked digit to the input field
		$("#char-input").val(enteredChar);
		charCode = Number(enteredChar) + 0x30;
	});

	$(".key-enter").click(function () {
		enteredChar = $(this).text().trim();
		// Append the clicked digit to the input field
		$("#char-input").val(enteredChar);
		charCode = 10;
	});

	// Handle the "Clear" button click
	$(".key-clear").click(function () {
		// Clear the input field
		$("#char-input").val("");
	});
});

// Function to validate the input (you can customize this as needed)
function is_valid_character(charCode) {
	return Number(charCode) <= 255;
}

function read_input_char() {
	return Number(charCode);
}
