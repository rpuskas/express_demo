var express = require("express");
var app = express();
 
app.get("/",function(req, res) {
  res.send("Hello from express")
});
 
var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
