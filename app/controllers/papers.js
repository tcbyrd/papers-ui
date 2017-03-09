var express = require('express')
var router = express.Router()
const base = require('airtable').base('appf6aPxwZ2Jn78Os');
let papers = [];
let sessions = {};

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
        var sessionTitle = record.get('Session title')
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
        var room = record.get('Room')
        var ampm = record.get('Morning / Afternoon')
        var affilName1 = record.get('Affiliation (Author 1)')
        var affilName2 = record.get('Affiliation (Author 2)')
        var affilName3 = record.get('Affiliation (Author 3)')
        var affilName4 = record.get('Affiliation (Author 4)')
        var affilName5 = record.get('Affiliation (Author 5)')
        var affilName6 = record.get('Affiliation (Author 6)')
        var affilName7 = record.get('Affiliation (Author 7)')
        var affilName8 = record.get('Affiliation (Author 8)')
        var track = record.get('Track')
        var newPaper = {
          id: id,
          title: title,
          abstract: abstract,
          order: order,
          day: day,
          startTime: startTime,
          endTime: endTime,
          sessionType: sessionType,
          sessionTitle: sessionTitle,
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
          lastName8: lastName8,
          room: room,
          ampm: ampm,
          affilName1: affilName1,
          affilName2: affilName2,
          affilName3: affilName3,
          affilName4: affilName4,
          affilName5: affilName5,
          affilName6: affilName6,
          affilName7: affilName7,
          affilName8: affilName8,
          track: track

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

function getSessions() {
  return new Promise(function(resolve, reject) {
  let newSessions = {}
  base('Sessions').select({view: "Main View"}).eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.
    records.forEach(function(record) {
        console.log('Session Retrieved', record.get('Submission ID'));
        var sessionTitle = record.get('Session Title')
        var firstNameOrg1 = record.get('First Name (Organizer 1)')
        var lastNameOrg1 = record.get('Last Name (Organizer 1)')
        var firstNameOrg2 = record.get('First Name (Organizer 2)')
        var lastNameOrg2 = record.get('Last Name (Organizer 2)')
        var firstNameOrg3 = record.get('First Name (Organizer 3)')
        var lastNameOrg3 = record.get('Last Name (Organizer 3)')
        var firstNameOrg4 = record.get('First Name (Organizer 4)')
        var lastNameOrg4 = record.get('Last Name (Organizer 4)')
        var firstNameOrg5 = record.get('First Name (Organizer 5)')
        var lastNameOrg5 = record.get('Last Name (Organizer 5)')
        var newSession = {
          firstNameOrg1: firstNameOrg1,
          lastNameOrg1: lastNameOrg1,
          firstNameOrg2: firstNameOrg2,
          lastNameOrg2: lastNameOrg2,
          firstNameOrg3: firstNameOrg3,
          lastNameOrg3: lastNameOrg3,
          firstNameOrg4: firstNameOrg4,
          lastNameOrg4: lastNameOrg4,
          firstNameOrg5: firstNameOrg5,
          lastNameOrg5: lastNameOrg5
        }
        // console.log(newPaper);
        newSessions[sessionTitle] = newSession
    });
    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.
    fetchNextPage();
    }, function done(err) {
        if (err) { console.error(err); return; }
        sessions = newSessions
        resolve(sessions)
    });
  });
}

router.get('/print/abstracts', function (req, res, next) {
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
  getSessions()
    .then(sessions => console.log(sessions))
    .then(
      getPapers(filterOpts)
      .then(papers => res.render('papers', {title: 'Papers', day: day, papers, sessions}))
    )

});

router.get('/print/posters', function (req, res, next){
  var date = ''
  var view = ''
  var day = 'tuesday'
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
  getSessions()
    .then(sessions => console.log(sessions))
    .then(
      getPapers(filterOpts)
      .then(papers => res.render('posters', {title: 'Printer View', day: 'tuesday', papers, sessions}))
    )

});

router.get('/print/:day', function (req, res, next){
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
  getSessions()
    .then(sessions => console.log(sessions))
    .then(
      getPapers(filterOpts)
      .then(papers => res.render('printer', {title: 'Printer View', day: day, papers, sessions}))
    )

});

module.exports = function (app) {
  app.use('/', router);
};
