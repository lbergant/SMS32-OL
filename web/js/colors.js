function update_primary_color(color_value) {
	// let complimentary_color = get_complimentary_color(color_value);
	let complimentary_color = get_triadic_color(color_value)[1];

	default_highlight = color_value;
	$(":root").css("--primary", color_value);
	$(":root").css("--secondary", complimentary_color);
}

function hex_to_rgb(hexColor) {
	// Remove the # character from the beginning of the hex string, if it exists
	hexColor = hexColor.replace("#", "");

	// Convert the hex string to a number
	var hexNumber = parseInt(hexColor, 16);

	// Extract the red, green, and blue components from the number
	var r = (hexNumber >> 16) & 255;
	var g = (hexNumber >> 8) & 255;
	var b = hexNumber & 255;

	// Return the RGB components as an array
	return [r, g, b];
}

function rgb_to_hex(rgbColor) {
	// Convert each RGB component to a two-digit hex string
	var rHex = rgbColor[0].toString(16).padStart(2, "0");
	var gHex = rgbColor[1].toString(16).padStart(2, "0");
	var bHex = rgbColor[2].toString(16).padStart(2, "0");

	// Concatenate the hex strings to form the final hex color string
	var hexColor = "#" + rHex + gHex + bHex;

	// Return the hex color string
	return hexColor;
}

function get_complimentary_color(hexColor) {
	// Convert the hex color to an RGB color
	var rgbColor = hex_to_rgb(hexColor);

	// Invert each RGB component to get the complimentary color
	var compR = 255 - rgbColor[0];
	var compG = 255 - rgbColor[1];
	var compB = 255 - rgbColor[2];

	// Flip the brightness of the complimentary color
	var lum = 0.2126 * compR + 0.7152 * compG + 0.0722 * compB;
	var mid = 128;
	if (lum > mid) {
		compR = Math.floor((mid / lum) * compR);
		compG = Math.floor((mid / lum) * compG);
		compB = Math.floor((mid / lum) * compB);
	} else {
		compR = Math.floor(
			((255 - mid) / (255 - lum)) * compR +
				(mid * (mid - lum)) / (lum * (255 - lum))
		);
		compG = Math.floor(
			((255 - mid) / (255 - lum)) * compG +
				(mid * (mid - lum)) / (lum * (255 - lum))
		);
		compB = Math.floor(
			((255 - mid) / (255 - lum)) * compB +
				(mid * (mid - lum)) / (lum * (255 - lum))
		);
	}

	// Convert the complimentary color back to a hex color
	var compHexColor = rgb_to_hex([compR, compG, compB]);

	// Return the complimentary color
	return compHexColor;
}


function get_triadic_color(hexColor){
	var rgbColor = hex_to_rgb(hexColor);

	// Invert each RGB component to get the complimentary color
	let color1 = rgb_to_hex([rgbColor[1], rgbColor[2], rgbColor[0]]);
	let color2 = rgb_to_hex([rgbColor[2], rgbColor[0], rgbColor[1]]);

	return [color1, color2];
}