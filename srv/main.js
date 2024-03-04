#!/usr/bin/env node

// *********************************
//			   Includes
// *********************************
var path = require("path");
var express = require("express");

// *********************************
//			   CONFIG
// *********************************
var web_port = 8080;
var web_path = path.join(__dirname, "../web");

// *********************************
//			   Server
// *********************************
var app = express();
app.use(express.static(web_path));

app.get("/", function (req, res) {
	res.sendFile(web_path + "/index.html");
});

var server = app.listen(web_port, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log("Example app listening at http://%s:%s", host, port);
});
