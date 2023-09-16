const trafficLights = document.querySelectorAll(".traffic-light");

function toggleLights() {
	trafficLights.forEach((light) => {
		const redLight = light.querySelector(".red");
		const yellowLight = light.querySelector(".yellow");
		const greenLight = light.querySelector(".green");

		if (redLight.classList.contains("on")) {
			redLight.classList.remove("on");
			yellowLight.classList.add("on");
		} else if (yellowLight.classList.contains("on")) {
			yellowLight.classList.remove("on");
			greenLight.classList.add("on");
		} else {
			greenLight.classList.remove("on");
			redLight.classList.add("on");
		}
	});
}

// // Call the toggleLights function to start the traffic lights
// toggleLights();

// // You can use setInterval to cycle through the lights at a specific interval
// setInterval(toggleLights, 2000); // Change lights every 2 seconds
