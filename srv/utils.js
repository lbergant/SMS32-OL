function writeLine(line) {
	let fileSizeInBytes = 0;

	if (fs.existsSync(LOG_FILE_NAME)) {
		let stats = fs.statSync(LOG_FILE_NAME);
		fileSizeInBytes = stats.size;
	}

	if (fileSizeInBytes > 100000000) {
		// if file size > 100MB start a new file TODO_L check if this is OK
		fs.renameSync(LOG_FILE_NAME, LOG_FILE_NAME + ".2");
		writeLine("Renamed old file to: " + LOG_FILE_NAME + ".2");
	}

	let date = new Date();
	let parent = arguments.callee.caller.name;
	let outputLine = "[" + date.toISOString() + "][" + parent + "]\t" + line;

	console.log(outputLine);

	outputLine += "\n";
	fs.appendFile(LOG_FILE_NAME, outputLine, function writeFile(err) {
		if (err) {
			console.log("************ APPEND FAILED" + err);
		} else {
			//idk
		}
	});
}
