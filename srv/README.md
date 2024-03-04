# SMS32 OL server

This server is used to serve SMS32 online simulator files

## How to run

1. Install NodeJS: https://nodejs.org/en
2. npm install
3. node main.js
4. Open browser on 127.0.0.1:8080

## Troubleshootnig

If `npm install` failes you can manually install `express` and `path` modules.

## How to configure

Configuration can be made to the following two parameters in file **main.js** .

```
var web_port = 8080;
var web_path = path.join(__dirname, "../web");
```
