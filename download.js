var https = require("https");
var fs = require('fs');
var path = require('path');
var request = require('request');
var cheerio = require("cheerio");
var Q = require("Q");
var Mustache = require("mustache");
var output = {people:[]};

function createRequest(id,isImage) {
  return { 
    hostname: 'jigsaw.thoughtworks.com',
    path: '/consultants/' + id + (isImage ? '/show_picture' : ''),
    method: 'GET',
    headers: {'cookie': '_jigsaw_session=KpHzwmwvXz9STfx3Ml39Lz3N'}
  };
}

function requestConsultant(id) {

  var deferred = Q.defer()
  var results = '';
  var req = https.request(createRequest(id,false), function(res) {
    
    res.on('data', function (chunk) {
      results = results + chunk;
    }); 

    res.on('end', function (data) {
      if(res.statusCode == '200') {
        var $ = cheerio.load(results);
        var _image = $("#image_upload_section img");
        output.people.push({"name": $("h1").text().split(' - ')[1], "image": _image.attr("src")});
        process.stdout.write('*')
      }
      deferred.resolve();
    });

  });

  req.on('error', function(e) {
    console.log('error');
    deferred.reject();
  });

  req.end();
  return deferred.promise;
}


function createTemplate(output) {
  var template = fs.readFileSync(path.resolve('output_template.html'),'utf8');
  return Mustache.render(template, output);
}

function downloadRange(from, to) {
  var promises = [];
  for (var i = from; i < to; i++) {    
    promises.push(requestConsultant(i));
  };

  Q.all(promises).then(function() {
    console.log('\nDONE!')
    fs.writeFileSync('output.js', JSON.stringify(output));
    fs.writeFileSync('output.html',createTemplate(output));
  })
}

downloadRange(11600,11601);



