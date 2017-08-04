// API URL examples: change as needed!
// Rename the file to api-config.js and put in CloudPebble or local build (in "src" folder) when done!

// http://stackoverflow.com/questions/23419315/including-an-external-javascript-library-in-pebble-js-file
// http://stackoverflow.com/questions/34749707/pebble-javascript-multiple-js-files-pebble-js

// CONFIRMED WORKING! (example: var jsfilevar = require('./your-js-file.js'); -- put this or similar in the main function)
// http://stackoverflow.com/questions/31395336/using-rsvp-module-of-ember-js-in-pebble-js

// REFERENCE: RHS APP HIDDEN URLs WITH DATA
// Schedule/Dashboard: http://URL
// Absence list/announcements (DO NOT include announcements for privacy purposes): http://URL

// Export URLs to main function

var api_refs = {
  weatherURL : "https://api.darksky.net/forecast/[KEY]/37.8267,-122.423",
  scheduleURL : "https://www.parsehub.com/api/v2/projects/t[PROJECT_ID]/last_ready_run/data?api_key=[KEY]&format=json",
  schoolDaysURL : "http://[BACKEND URL]/apps/school/api/[URL]"
  NOTWORKING_timelineID : "[timelineID]"
};

this.exports = api_refs;
