var express = require('express')
var router = express.Router()
const base = require('airtable').base('appf6aPxwZ2Jn78Os');

router.get('/papers', function (req, res, next) {
  base('Imported Table').select({
      // Selecting the first 3 records in Main View:
      maxRecords: 10,
      view: "Main View"
  }).eachPage(function page(records, fetchNextPage) {
      // This function (`page`) will get called for each page of records.
      var papers = []
      records.forEach(function(record) {
          console.log('Retrieved', record.get('Submission ID'));
          var id = record.get('Submission ID')
          var title = record.get('Title')
          var abstract = record.get('Abstract')
          var newPaper = {id: id, title: title, abstract: abstract}
          papers.push(newPaper)
      });

      // To fetch the next page of records, call `fetchNextPage`.
      // If there are more records, `page` will get called again.
      // If there are no more records, `done` will get called.
      console.log(req.query);
      if(req.query){
        fetchNextPage();
      }
      res.render('papers', {papers})

  }, function done(err) {
      if (err) { console.error(err); res.send('error fetching data from AirTable'); }
  });

});

module.exports = function (app) {
  app.use('/', router);
};
