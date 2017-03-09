var request = require('request');
var fs = require('fs');
var cloudconvert = new (require('cloudconvert'))('t8TwkosdpKisitvjuGZXftDNb9GZrSDtE0JuyK6F0aCqk0MtGCOHT3Jb98jR1dEdx-Dy6JN2jBQi18rm3s2Qyw');
var PDFs = []

function convertUrl(inputUrl) {
  return new Promise(function(resolve, reject) {
    var query = 'apikey=t8TwkosdpKisitvjuGZXftDNb9GZrSDtE0JuyK6F0aCqk0MtGCOHT3Jb98jR1dEdx-Dy6JN2jBQi18rm3s2Qyw&inputformat=website&outputformat=pdf&input=url&file=' + inputUrl + '&converteroptions[page_orientation]=portrait&converteroptions&converteroptions[image_dpi]=600&converteroptions[image_quality]=94&converteroptions[zoom]=1.0&converteroptions[print_media_type]=true&converteroptions[page_size]=A4&converteroptions[margin_top]=10&converteroptions[margin_bottom]=10&converteroptions[margin_left]=10&converteroptions[margin_right]=10&wait=true'
    var URL = 'https://api.cloudconvert.com/convert?' + query
    console.log(inputUrl);
    var outputFile = inputUrl.substring(54) + '.pdf'
    request(URL)
      .pipe(fs.createWriteStream('tmp/' + outputFile))
      .on('finish', () => resolve(outputFile));
  })
}

function createPdfs() {
  convertUrl('http%3A%2F%2Fcaa-2017-program.herokuapp.com%2Fprint%2Ftuesday')
  .then(outputFile => {
    PDFs.push(outputFile)
    console.log('Write complete for: ' + outputFile);
    combinePdfs()
  })
  convertUrl('http%3A%2F%2Fcaa-2017-program.herokuapp.com%2Fprint%2Fwednesday')
  .then(outputFile => {
    PDFs.push(outputFile)
    console.log('Write complete for: ' + outputFile);
    combinePdfs()
  })
  convertUrl('http%3A%2F%2Fcaa-2017-program.herokuapp.com%2Fprint%2Fthursday')
  .then(outputFile => {
    PDFs.push(outputFile)
    console.log('Write complete for: ' + outputFile);
    combinePdfs()
  })
  convertUrl('http%3A%2F%2Fcaa-2017-program.herokuapp.com%2Fprint%2Fposters')
  .then(outputFile => {
    PDFs.push(outputFile)
    console.log('Write complete for: ' + outputFile);
    combinePdfs()
  })
}

function combinePdfs() {
  if (PDFs.length === 4) {
    console.log('There are FOUR: ' + PDFs);
    cloudconvert.createProcess({
        "mode": "combine",
        "inputformat": "pdf",
        "outputformat": "pdf"
    }, function(err, process) {
      console.log(process);
      process.start({
        "mode": "combine",
        "input": "download",
        "files": [
          "/tmp/" + PDFs[0],
          "/tmp/" + PDFs[1],
          "/tmp/" + PDFs[2],
          "/tmp/" + PDFs[3]
        ],
        "outputformat": "pdf",
        "wait": true
      })
      .pipe(fs.createWriteStream('/tmp/caa-final.pdf'))
    });
  } else if (PDFs.length === 3) {
    console.log('There are THREE: ' + PDFs);
  } else if (PDFs.length === 2) {
    console.log('There are TWO: ' + PDFs);
  } else if (PDFs.length === 1) {
    console.log('There is ONE: ' + PDFs);
  }
}




module.exports = createPdfs;
