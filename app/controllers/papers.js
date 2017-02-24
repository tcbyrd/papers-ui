var express = require('express')
var router = express.Router()
const base = require('airtable').base('appf6aPxwZ2Jn78Os');
let papers = [];
let test = '';

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
        var firstName3 = record.get('First name (Author 3)')
        var lastName3 = record.get('Last name (Author 3)')
        var firstName4 = record.get('First name (Author 4)')
        var lastName4 = record.get('Last name (Author 4)')
        var firstName5 = record.get('First name (Author 5)')
        var lastName5 = record.get('Last name (Author 5)')
        var firstName6 = record.get('First name (Author 6)')
        var lastName6 = record.get('Last name (Author 6)')
        var firstName7 = record.get('First name (Author 7)')
        var lastName7 = record.get('Last name (Author 7)')
        var firstName8 = record.get('First name (Author 8)')
        var lastName8 = record.get('Last name (Author 8)')
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
          lastName2: lastName2,
          firstName3: firstName3,
          lastName3: lastName3,
          firstName4: firstName4,
          lastName4: lastName4,
          firstName5: firstName5,
          lastName5: lastName5,
          firstName6: firstName6,
          lastName6: lastName6,
          firstName7: firstName7,
          lastName7: lastName7,
          firstName8: firstName8,
          lastName8: lastName8
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
