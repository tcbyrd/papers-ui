var request = require('request');
var fs = require('fs');
var cckey = process.env.CLOUDCONVERT_API_KEY
var cloudconvert = new (require('cloudconvert'))(cckey);
var PDFs = []

function convertUrl(inputUrl) {
  return new Promise(function(resolve, reject) {
    var query = 'apikey=' + cckey + '&inputformat=website&outputformat=pdf&input=url&file=' + inputUrl + '&converteroptions[page_orientation]=portrait&converteroptions&converteroptions[image_dpi]=600&converteroptions[image_quality]=94&converteroptions[zoom]=1.0&converteroptions[print_media_type]=true&converteroptions[page_size]=A4&converteroptions[margin_top]=10&converteroptions[margin_bottom]=10&converteroptions[margin_left]=10&converteroptions[margin_right]=10&wait=true'
    var URL = 'https://api.cloudconvert.com/convert?' + query
    console.log(inputUrl);
    var outputFile = inputUrl.substring(54) + '.pdf'
    request(URL)
      .pipe(fs.createWriteStream('public/' + outputFile))
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
    }, (err, process) => {
      console.log(process);
      process.start({
        "mode": "combine",
        "input": "download",
        "files": [
          "http://caa-2017-program.herokuapp.com/tuesday.pdf",
          "http://caa-2017-program.herokuapp.com/posters.pdf",
          "http://caa-2017-program.herokuapp.com/wednesday.pdf",
          "http://caa-2017-program.herokuapp.com/thursday.pdf"
        ],
        "outputformat": "pdf",
        "wait": true
      }, (err, process) => {
          process.wait( (err, process) => {
            console.log('From Download', process);
            process.pipe(
              fs.createWriteStream('public/caa-2017.pdf')
                .on('finish', () => {
                  console.log('Finished combining file!')
                  PDFs.forEach(PDF => fs.unlink('public/' + PDF, (err) => {
                                                  if(err) return console.log(err);
                                                    console.log(PDF + ' deleted successfully!');
                                                  }
                                               )
                              )
                })
              )
          })
      })
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
