#!/usr/bin/env node

var express = require("express");
var app = express();

app.use(express.static("/home/ubuntu/Projects/MAG/web/"));

app.get("/", function (req, res) {
	res.sendFile("/home/ubuntu/Projects/MAG/web/index.html");
});

var server = app.listen(8080, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log("Example app listening at http://%s:%s", host, port);
});
