var https = require("https");
var fs = require('fs');
var path = require('path');
var cookieParser = require('cookie-parser');
var cookie = require('cookies.txt');
var request = require('request');

var alive = 0;
var dead = 0;

function createRequest(id,isImage) {
  return { 
    hostname: 'jigsaw.thoughtworks.com',
    path: '/consultants/' + id + (isImage ? '/show_picture' : ''),
    method: 'GET',
    headers: {'cookie': '_jigsaw_session=KpHzwmwvXz9STfx3Ml39Lz3N'}
  };
}

function requestConsultant(id) {

  var results = '';
  var req = https.request(createRequest(id,false), function(res) {
    
    res.on('data', function (chunk) {
      results = results + chunk;
    }); 

    res.on('end', function (data) {
      console.log(res.statusCode);
      if(res.statusCode == '404') {
        dead++;
      } else {
        alive++;
      }
      console.log('alive: ' + alive);
      console.log('dead: ' + dead);
    });

  });

  req.on('error', function(e) {
    console.log('error');
  });

  req.end();
}

function downloadPic(personId) {

  var results = ''; 
  var req = https.request(createRequest(personId), function(res) {
      res.setEncoding('binary')
      
      res.on('data', function (chunk) {
        results = results + chunk;
      }); 
      
      res.on('end', function (data) {
        fs.writeFile('images/' + personId + ".jpg", results, 'binary', function(err) {
          if (err) {
            throw err;
          }

          console.log('File ' + personId + 'saved.')
        });
      });
  });

  req.on('error', function(e) {
    console.log('error');
  });

  req.end();
}

function downloadRange(from, to) {
  for (var i = from; i < to; i++) {
    requestConsultant(i);
  };
}

downloadRange(12000,12100);


