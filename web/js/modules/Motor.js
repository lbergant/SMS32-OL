let numberOfDots = 36;
let same = 6;

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
		var dot = $('<div class="dot dot-' + (i % same) + '"></div');

		// Calculate the position of each dot relative to the container
		var x = radius * Math.cos((angle * i * Math.PI) / 180);
		var y = radius * Math.sin((angle * i * Math.PI) / 180);

		// Set the position of the dot relative to the container
		dot.css({
			position: "absolute",
			top: "calc(50% + " + y + "px)",
			left: "calc(50% + " + x + "px)",
		});

		// Append the dot to the container
		container.append(dot);
	}
}

function updateDotCSS(inval, color) {
	$(".dot-" + inval).css({
		"background-color": color,
	});
}

let pos = 0;

function rotate_motor(deg) {
	updateDotCSS((pos / (360 / numberOfDots)) % same, "gray");
	pos += deg;
	console.log("hello");
	updateDotCSS((pos / (360 / numberOfDots)) % same, "red");

	$(".star").css({
		transform: "rotate(" + pos + "deg)",
	});
}
