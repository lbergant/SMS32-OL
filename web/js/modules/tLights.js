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

function toggleLights(value) {
	const trafficLights = $(".traffic-light");

	if (value < 0) value += 256;

	let bin_arr = byteToBinaryArray(value);

	for (let i = 0; i < 6; i++) {
		let selector = i;
		let light_selector = Math.floor(selector / 3);
		let ryg_selector = selector % 3;
		let on_off_class = "";

		switch (ryg_selector) {
			case 0:
				on_off_class = "on-red";
				break;
			case 1:
				on_off_class = "on-yellow";
				break;
			case 2:
				on_off_class = "on-green";
				break;
		}
		if (bin_arr[i] == 1) {
			trafficLights
				.eq(light_selector)
				.children()
				.eq(ryg_selector)
				.addClass(on_off_class);
		} else {
			trafficLights
				.eq(light_selector)
				.children()
				.eq(ryg_selector)
				.removeClass(on_off_class);
		}
	}
}

// // Call the toggleLights function to start the traffic lights
// toggleLights();

// // You can use setInterval to cycle through the lights at a specific interval
// setInterval(toggleLights, 2000); // Change lights every 2 seconds
