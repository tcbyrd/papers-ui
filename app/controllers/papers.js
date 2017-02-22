var express = require('express')
var router = express.Router()
const base = require('airtable').base('appf6aPxwZ2Jn78Os');
let papers = [];

function getPapers(filterOpts) {
  return new Promise(function(resolve, reject) {
  let newPapers = []
  base('Imported Table').select(filterOpts).eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.
    records.forEach(function(record) {
        console.log('Retrieved', record.get('Submission ID'));
        var id = record.get('Submission ID')
        var title = record.get('Title')
        var abstract = record.get('Abstract')
        var order = record.get('Order in Session')
        var day = record.get('Day')
        var startTime = record.get('Time Start')
        var endTime = record.get('Time End')
        var sessionType = record.get('Session Type')
        var trackTitle = record.get('Track title')
        var firstName1 = record.get('First name (Author 1)')
        var lastName1 = record.get('Last name (Author 1)')
        var firstName2 = record.get('First name (Author 2)')
        var lastName2 = record.get('Last name (Author 2)')
        var abstract = record.get('Abstract')
        var newPaper = {
          id: id,
          title: title,
          abstract: abstract,
          order: order,
          day: day,
          startTime: startTime,
          endTime: endTime,
          sessionType: sessionType,
          trackTitle: trackTitle,
          firstName1: firstName1,
          lastName1: lastName1,
          firstName2: firstName2,
          lastName2: lastName2
        }
        // console.log(newPaper);
        newPapers.push(newPaper)
    });
    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.
    fetchNextPage();
    }, function done(err) {
        if (err) { console.error(err); return; }
        papers = newPapers
        resolve(papers)
    });
  });
}

router.get('/papers/abstracts', function (req, res, next) {
  var filterOpts = {
    // Selecting the first 100 records in Abstracts view:
    maxRecords: 400,
    view: "Abstracts"
  }
  getPapers(filterOpts)
    .then(papers => res.render('abstracts', {title: 'abstracts', papers}));
});

router.get('/papers/:day', function (req, res, next){
  var date = ''
  var view = ''
  var day = req.params.day
  switch (day) {
    case 'tuesday':
      date = '3/14/17'
      view = 'Tuesday'
      break;
    case 'wednesday':
      date = '3/15/17'
      view = 'Wednesday'
      break;
    case 'thursday':
      date = '3/16/17'
      view = 'Thursday'
      break;
    case 'all':
      date = ''
      view = "Filtered for Web"
      break;
    default:
      date = ''
      view = "Default"
      break;
  }
  if (date !== '') {
    var filterDate = "({Day} = '" + date + "')"
    var filterOpts = {
      // Selecting the first 25 records in the track defined in 'view':
      maxRecords: 400,
      view: view,
      filterByFormula: filterDate
    }
  } else {
    var filterOpts = {
      maxRecords: 400,
      pageSize: 100,
      view: view
    }
  }
  console.log('Formula: ', filterOpts.filterByFormula);
  getPapers(filterOpts)
    .then(papers => res.render('papers', {title: 'Papers', day: day, papers}))
});

// router.get('/papers', function (req, res, next) {
//   console.log(req.url);
//   base('Imported Table').select({
//       // Selecting the first 3 records in Main View:
//       maxRecords: 100,
//       view: "Main View",
//       filterByFormula: "NOT({Time Start} = '')"
//   }).eachPage(function page(records, fetchNextPage) {
//       // This function (`page`) will get called for each page of records.
//       var papers = []
//       records.forEach(function(record) {
//           console.log('Retrieved', record.get('Submission ID'));
//           var id = record.get('Submission ID')
//           var title = record.get('Title')
//           var abstract = record.get('Abstract')
//           var order = record.get('Order in Session')
//           var day = record.get('Day')
//           var startTime = record.get('Time Start')
//           var endTime = record.get('Time End')
//           var sessionType = record.get('Session Type')
//           var trackTitle = record.get('Track title')
//           var firstName1 = record.get('First name (Author 1)')
//           var lastName1 = record.get('Last name (Author 1)')
//           var firstName2 = record.get('First name (Author 2)')
//           var lastName2 = record.get('Last name (Author 2)')
//           var newPaper = {
//             id: id,
//             title: title,
//             abstract: abstract,
//             order: order,
//             day: day,
//             startTime: startTime,
//             endTime: endTime,
//             sessionType: sessionType,
//             trackTitle: trackTitle,
//             firstName1: firstName1,
//             lastName1: lastName1,
//             firstName2: firstName2,
//             lastName2: lastName2
//           }
//           console.log(newPaper);
//           papers.push(newPaper)
//       });
//
//       // To fetch the next page of records, call `fetchNextPage`.
//       // If there are more records, `page` will get called again.
//       // If there are no more records, `done` will get called.
//       res.render('papers', {title: 'Papers', papers})
//
//   }, function done(err) {
//       if (err) { console.error(err); res.send('error fetching data from AirTable'); }
//   });
//
// });


module.exports = function (app) {
  app.use('/', router);
};
