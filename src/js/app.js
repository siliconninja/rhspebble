
// RHS SCHOOL SCHEDULE, A PEBBLE WATCHAPP
// VERSION 12.0 (Final Release)
// License: CC BY-NC-SA 4.0

// REPO LINK: https://github.com/siliconninja/RHSPebble
// USER LINK: https://github.com/siliconninja

// API dependency -- required since it contains API keys and URLs used a lot throughout the app!
// As for the weather API: no location required since it uses the school's city's weather forecast automatically.
// See here for details: http://stackoverflow.com/questions/23419315/including-an-external-javascript-library-in-pebble-js-file
// Google "pebble.js require": https://www.google.com/?gws_rd=ssl#q=pebble.js+require
var apicfg = require('./api-config.js');

// Import timeline dependency for pushing school schedule and events to timeline
var timelineJS = require('./timeline.js');

// Platform dependency -- differentiates between Pebble, Pebble Time, and PTR hardware.
var platform = require('platform');

// Timeline dependency for Pebble Timeline event handlers
// Useless since it doesn't work & staff at Pebble might've deprecated it already
//var Timeline = require('timeline');

// UI dependency -- definitely REQUIRED for Pebble.js UI-based apps (that use Pebble.js' own GUI library) (HIGHLY/STRONGLY recommended)
var UI = require('ui');

// Window dependency for windows (required to show blue background for app on main/about "cards"/menus) (not needed anymore)
//var Vector2 = require('vector2');

// Dependency for Ajax library (YOU NEED THIS TO GET API REQUESTS)
// Code from: http://developer.getpebble.com/tutorials/pebble-js-tutorial/part1/
var ajax = require('ajax');

// Dependency for adding schedule events for optional notifications
//var wakeup = require('wakeup');

// Body for 'main' card before schedule is displayed to avoid conflicts
// var beforeSchedData = '';

// Body for 'main' card AFTER schedule is displayed to avoid conflicts
//var afterSchedData = '';

// Total school days for 'main' card
var totalSchoolDaysFormatted = 0;

// Title for 'main' card (dynamically updates the name depending on Pebble platform due to PTR display issues)
// Pebble Classic/Pebble Time: Include a space at the beginning for easier icon/title visibility
var mainTitle = ' RHS';

// Image/top-left/top-center icon path for 'main' card (PTR positioning issues, fitting more information is crucial)
var mainIconPath = 'images/rhs_main_icon.png';

// 'Main' card background color
var mainBGColor = '#55AAFF';

// 'About' card background color
var aboutBGColor = '#55AAFF';

// 'More info' card background color
var moreInfoBGColor = '#FFAA55';

// Absence/schedule menu background color
var menuBGColor = '#00AAFF';

// ** APPLICATION VERSION STRING FOR ABOUT SECTION AND OTHER VERSION INFORMATION **
var appVersionString = 'Version 12.0';

// Cached announcements data (gathered on first launch of the News/Announcements screen to prevent excessive API calls,
// which therefore can cause severe phone/Bluetooth battery drain)

// String for adding to the "more info"/News/Announcements information card when clicked on.
// (deprecated in v11.0 since this info is now in a menu)
//var cachedNewsString = "";

// Announcement arrays/lists for more info card if needed
var newsTitles = [];
var newsSubtitles = [];

// Cached weather data (gathered on first launch of the weather screen to prevent excessive API calls,
// reset when app is relaunched again for more accurate but not too excessive analysis to cause API lockdown... which would be sad)

// Array for use for other parts of app that can use it (later on?)
// String for adding to the "more info"/weather information card when clicked on.
var cachedWeatherData = [];
var cachedWeatherString = "";

// String for the rotating schedule's 'day'/block ("4 Day", etc...) message
var rotatingScheduleDay = "";


// MENU AND ITEM DEFINITIONS (announcements/news/weather/etc.)

// Schedule/teacher info card with more information on class/absence
var moreInfoCard = new UI.Card({
  
  // More info card background color
  backgroundColor: moreInfoBGColor,
  
  // Include a space at the beginning for easier icon/title visibility
  title: ' More Info',
  
  // How to insert an image - see https://developer.getpebble.com/docs/pebblejs/
  icon: 'images/rhs_about.png',
  subtitle: '',
  
  // Include a newline so text is easier to read
  body: 'Loading...',
  // Set scrollable property so that you can see all the data: https://github.com/pebble/pebblejs
  scrollable: true
  
});

// Tutorial for Kimono APIs from http://developer.getpebble.com/blog/2014/06/19/Create-your-own-api-with-KimonoLabs/
// Schedule/Absence List/Announcements/Weather Card Code
var scheduleAbsentCard = new UI.Menu({
  // Make the background color a light blue color (so it's more readable on the Pebble Time and it stands out
  // (https://pebble.github.io/pebblejs/#menu) -- see backgroundColor in the example)
  // See all colors at https://developer.pebble.com/more/color-picker/ (the Name section is what you want when selecting your colors)
  // Exact color of 'melon': https://developer.pebble.com/more/color-picker/#FFAAAA
    backgroundColor: menuBGColor,
  // ...and it works surprisingly well!
    sections:
    [
      // The schedule section
      {
          
        items: [{
          title: 'Schedule',
          icon: 'images/rhs_schedule.png',
          subtitle: ''
        }, {
          title: 'Loading...',
          subtitle: ''
        }]
      
      },
      // The absence list section
      {
        items: [{
          title: 'Absence List',
          icon: 'images/rhs_absent.png',
          subtitle: ''
        }, {
          title: 'Loading...',
          subtitle: ''
        }]
        
      },
      // The announcements/"news" section
      // New in version 7.1!
      {
        items: [{
            title: 'News',
            icon: 'images/rhs_announcements.png',
            subtitle: ''
        }]
      },
      // The weather info section
      // New in version 6.0 -- placed here to avoid major conflicts!
      {
        items: [{
          title: 'Weather',
          icon: 'images/rhs_weather.png',
          subtitle: 'Data: Dark Sky'
        }]
      },
      // The about card section
      // New addition: the About card! Now the app isn't so cluttered anymore!
      {
        
        items: [{
          title: 'About',
          icon: 'images/rhs_about.png',
          subtitle: 'Info/Developer'
        }]
        
      }
    ]
});

// Announcements/news menu (new in v11.0!)
var newsMenu = new UI.Menu({
  backgroundColor: moreInfoBGColor,
  sections: [
    {
      items:  [
        {
          title: 'News',
          icon: 'images/rhs_announcements.png',
          subtitle: 'Loading date...'
        }
      ]
    },
    {
      items:  [
        {
          title: 'Connecting...',
          subtitle: 'Loading items...'
        }
      ]
    }
  ]
});

// About menu (new in v11.0!)
var aboutMenu = new UI.Menu({
  // Make the background color a light blue color (so it's more readable on the Pebble Time and it stands out
  // (https://pebble.github.io/pebblejs/#menu) -- see backgroundColor in the example)
  // See all colors at https://developer.pebble.com/more/color-picker/ (the Name section is what you want when selecting your colors)
  // Exact color of 'melon': https://developer.pebble.com/more/color-picker/#FFAAAA
    backgroundColor: aboutBGColor,
  // ...and it works surprisingly well!
    sections:
    [
      // App dev. info
      {
        items: [
          {
            title: 'Developer',
            subtitle: 'siliconninja'
          },
          {
            title: 'App Version',
            icon: 'images/rhs_about.png',
            subtitle: appVersionString
          },
          {
            title: 'Website/Help',
            subtitle: 'github.com/siliconninja'
          }
        ]
      },
      // Icon, Data, etc. Credits
      {
        items: [
          {
            title: 'Credits',
            icon: 'images/rhs_announcements.png',
            subtitle: 'Data/Icon'
          },
          {
            title: 'Weather',
            subtitle: 'Powered by Dark Sky'
          },
          {
            title: 'Dark Sky',
            subtitle: 'darksky.net/poweredby'
          },
          {
            title: 'Data Source',
            subtitle: 'bit.ly/rhsdata'
          },
          {
            title: 'github.com',
            icon: 'images/rhs_main_icon.png',
            subtitle: '/siliconninja/RHSPebble'
          },
          {
            title: 'Miu &quot;Clock&quot;',
            icon: 'images/rhs_schedule.png',
            subtitle: 'Linh Pham Thi Dieu'
          },
          {
            title: 'Hawcons',
            icon: 'images/rhs_absent.png',
            subtitle: 'Yannick Lung'
          },
          {
            title: 'Material',
            icon: 'images/rhs_about.png',
            subtitle: 'Google (Apache2)'
          }
        ]
      }
    ]
});


// IMPORTANT METHODS

// Method that converts 24-hour formatted time to 12-hour time for displaying the schedule and timeline pins (only hours need to be converted)
// and removes leading zeros from the hour
function convertTo12HourTime(hour){
  // If the time is 1pm, 2pm, etc...
  if(hour >= 13){
    // Return 12-hour version of given hour
    return hour - 12;
  }
  // If it's 12pm, 11am, etc...
  else{
    // If it has a leading zero, return given hour without leading zero
    if(hour.substring(0, 1) === '0') return hour.substring(1);
    // Otherwise, just return the given hour
    else return hour;
  }
}

// Method, converts lunch end times to correct end times (offset by 5 minutes)
function convertLunchTime(hour, minute){
  // If the original minute is something like 12:00...
  if(minute - 5 < 0){
    // 12:1 [0], 12:0, 12:-1, 12:-2, 12:-3, 12:-4 [5]
    // 12:1 [0], 12:0, 11:59 [...] 11:56 [5]
    return (hour - 1).toString() + ":" + (60 + (minute - 5)).toString();
  }
  else{
    // 15 --> 10, 16 --> 11, etc. (no leading zero)
    if(minute - 5 >= 10){
      return (hour).toString() + ":" + (minute - 5).toString();
    }
    // 14 --> [0]9, 13 --> [0]8, 10 --> [0]5 (include leading zero)
    else{
      return (hour).toString() + ":0" + (minute - 5).toString();
    }
  }
}

// Method for adding timeline pins (because each part is lengthy), works on PHONE ONLY (not CloudPebble)
// Accepts (period start) hour, (period start) minute, period name, period end time parameters
/* function createScheduleTimelinePin(TLHour, TLMinute, TLTitle, TLEndTime, TLSchedDay, TLID){
  
  // Set the date to what's defined in the function parameters (var hour, var minute)...,
  // except adapt to a 12-hour schedule because of the raw data provided by the school schedule API
  
  // If time is during PM (1PM, 2PM, 3PM), before 7PM, make it adaptable to 24-hour schedule by adding 12 hours to it
  if(TLHour < 7){
    TLHour += 12;
  }
  
  // Have the timeline date be a variable for later when creating the timeline pin (Pebble timeline only wants a certain string format)
  var date = new Date();
  
  // Set hours, minutes, and seconds
  date.setHours(TLHour);
  date.setMinutes(TLMinute);
  date.setSeconds(0);
  
  //console.log(date);
  
  // Create the pin
  var pin = {
    "id": TLID,
    // Date
    "time": date.toISOString(),
    "layout": {
      // Calendar pin
      "type": "genericPin",
      // Background color
      "backgroundColor": "#FFAA55",
      // Title on timeline (shows period number)
      "title": TLTitle,
      // Subtitle on timeline (shows when period ends)
      "subtitle": "Ends @ " + TLEndTime,
      // Extra body text
      "body": "Schedule: " + TLSchedDay + "\nHave a great day! :)" + "\n\nPowered by Ridgewood High School Schedule for Pebble",
      // Notification icon
      "tinyIcon": "system://images/GLUCOSE_MONITOR"
    }
    
  };
  
  //console.log(JSON.stringify(pin));

  //console.log('Inserting pin in the future: ' + JSON.stringify(pin));

  // Push the pin
  timelineJS.insertUserPin(pin, function(responseText) {
    console.log('Result: ' + responseText);
  });
} */

// Method for showing weather "more info" card and caching weather data
function showWeatherCard(){
  // Weather data --> "more info" card

  // Subtitle for easier access
  var moreInfoCardSubtitle = "";

  // Put most of the school weather data in one string
  var schoolWeatherData = "";

  // If there is no cached weather data, cache it now for later access and to prevent excessive API requests later on.
  if(cachedWeatherString === "") {
    try{
      ajax({
        url: apicfg.weatherURL, 
        type: 'json'
      },
      function(data) {
        
        // Get 'currently' API/JSON parameter (Real-time updating! Yay! :D)
        // Cache important/collected data, but not too much data as the phone may overheat and the app may crash.

        // Data points/adding data to the "more info" card

        // 1. Real-time weather conditions/forecast (clear, overcast, rain, etc.)
        cachedWeatherData[0] = data.currently.summary;
        //schoolWeatherData += "Forecast: " + cachedWeatherData[0] + "\n";

        // 2. Current temperature in degrees Fahrenheit
        // HTML/JS symbols: http://www.javascripter.net/faq/mathsymbols.htm
        cachedWeatherData[1] = data.currently.temperature;
        schoolWeatherData += "Temp: " + cachedWeatherData[1] + "\xB0F\n";

        // 3. "Feels like" temperature
        cachedWeatherData[2] = data.currently.apparentTemperature;
        schoolWeatherData += "Feels like " + cachedWeatherData[2] + "\xB0F\n";

        // 4. Chance of precipitation
        cachedWeatherData[3] = (data.currently.precipProbability * 100);
        schoolWeatherData += cachedWeatherData[3] + "% chance precip.\n";

        // 5. Wind speed!
        cachedWeatherData[4] = data.currently.windSpeed;
        schoolWeatherData += "Wind: " + cachedWeatherData[4] + "mph\n";

        // Aww yeah!
        // Add the weather data to a cached string for later use.
        cachedWeatherString = schoolWeatherData;

        // Set the forecast as the subtitle (it's a cached piece of weather data before... see #1)
        moreInfoCardSubtitle = cachedWeatherData[0];

      });
    
    }
    catch(error) {

      // Error message: API request limit hit or data was not properly gathered.
      // Set the subtitle to "Error!" to make it stand out
      moreInfoCardSubtitle = "Error!";
      schoolWeatherData += "There was an issue gathering weather data.\n";
      schoolWeatherData += "The server may be down, or something unexpected happened in the app.\n";
      schoolWeatherData += "Please try again later.";

      // Aww yeah!
      // Add it to a string for later use.
      cachedWeatherString = schoolWeatherData;
    }
    
  }
  else {
    // Set the forecast as the subtitle (it's a cached piece of weather data before... see #1 above [in the if statement])
    moreInfoCardSubtitle = cachedWeatherData[0];
  }

  // This takes priority so the weather is set correctly if a title is set for some reason... (maybe memory/priority issues?)
  moreInfoCard.title(" Weather");
  moreInfoCard.icon('images/rhs_weather.png');


  // Set timeout so data will show on screen and conflicts will not occur
  setTimeout(function(){

    // Set subtitle (to current weather condition) and text (with more weather information) after 1.5 seconds/1500ms
    moreInfoCard.subtitle(moreInfoCardSubtitle);
    moreInfoCard.body(cachedWeatherString);
    moreInfoCard.backgroundColor(moreInfoBGColor);

  }, 1500);

  moreInfoCard.backgroundColor(moreInfoBGColor);

  moreInfoCard.show();

}

// Method to show and dynamically update announcements menu based on website data
function showNewsMenu(){
  // Temporary string used for later when setting the body of the "Announcements"/more info card
  //var allAnnouncementsString = "";
  try {

    // Get announcements from data source (file name/URL is same as absence list URL)
    ajax({ url: apicfg.absenceURL, type: 'json', method: 'get' }, function(data) {

      // Add provided last updated announcement list date on first line of more info/News/Announcements card (LOCAL variable in this case)
      //allAnnouncementsString += data.announcements.date + "\n";
      newsMenu.item(0, 0, {subtitle: "Date: " + data.announcements.date});

      // Modified menu index for announcement/news item + extra information on 2 separate lines
      var newsItemIndex = 0;

      // For each announcement found, add it to a string and then set it as the body of the "announcements" card
      data.announcements.announcements.forEach(function(element, index) {

        // DEPRECATED v11.0

        // Example announcement text for card:
        // 5/12/2016
        // -> Code Club Meeting
        // [T] Today @ Lunch 
        // [L] Room 101
        // [+] Remember to come!
        // 
        // -> Other Announcement
        // etc...

        // HTML/JS entities for special character references: http://www.javascripter.net/faq/mathsymbols.htm
        //allAnnouncementsString += "\u2192 " + element.title + "\n[T] " + element.when + "\n[L] " + element.where + "\n[+] " + element.more + "\n\n";

        // Cache news string in local database for later use/less battery drain! :D
        //cachedNewsString += "\u2192 " + element.title + "\n[T] " + element.when + "\n[L] " + element.where + "\n[+] " + element.more + "\n\n";

        // NEW v11.0

        if(element.where !== ""){
          newsMenu.item(1, newsItemIndex, {title: element.title, subtitle: element.when + ", " + element.where});

          // Add all announcement data for more info card
          newsTitles[newsItemIndex] = element.title;
          newsSubtitles[newsItemIndex] = element.when + ", " + element.where;
        }
        else{
          newsMenu.item(1, newsItemIndex, {title: element.title, subtitle: element.when});

          // Add all announcement data for more info card
          newsTitles[newsItemIndex] = element.title;
          newsSubtitles[newsItemIndex] = element.when;
        }


        if(element.more !== ""){
          newsMenu.item(1, newsItemIndex + 1, {title: "More info", subtitle: element.more});

          // Add all announcement data for more info card
          newsTitles[newsItemIndex + 1] = element.title;
          newsSubtitles[newsItemIndex + 1] = element.more;

          // Add 2 to index for displaying extra announcements + information on card if needed
          newsItemIndex += 2;
        }
        else{
          // Add 1 to index for displaying extra announcements + information on card if needed (no more info case)
          newsItemIndex += 1;
        }

      });

    });
          
  }
  // If an error has occurred, set the error string and show the menu.
  catch(error) {
    newsMenu.items(0, 0).subtitle("Date: N/A");

    newsMenu.items(1, 0).title("No News");
    newsMenu.items(1, 0).subtitle("Have a great day!");
  }

  newsMenu.show();

}


// If the watch is legacy (Pebble or Pebble Steel) and doesn't have color, set all background colors to white.
if((platform.version() != 'basalt') && (platform.version() != 'chalk')){
  mainBGColor = '#FFFFFF';
  aboutBGColor = '#FFFFFF';
  moreInfoBGColor = '#FFFFFF';
  menuBGColor = '#FFFFFF';
}
// If the watch is a Pebble Time Round (chalk) which has a different way of displaying titles with action bars and icons,
// fix the positioning of the 'main' card title/remove the icon entirely.
if(platform.version() === 'chalk'){
  
  // Set title to not include a space for alignment
  mainTitle = 'RHS';
  
  // Set 'icon path' variable to not have an icon at all in the main card to fix positioning
  mainIconPath = '';
  
}

// MAIN CARD DECLARATION
var main = new UI.Card({
  
  // Temporary fix for now.
  // (Sometimes setting the background color can act up the first time, so you'll keep needing to set it again when data loads.)
  backgroundColor: mainBGColor,
  
  // Dynamically updated title depending on watch platform (see above: "different way of displaying titles")
  title: mainTitle,
  
  // How to insert an image - see https://developer.getpebble.com/docs/pebblejs/
  icon: mainIconPath,
  subtitle: 'Loading school days...',
  
  // Include a newline so text is easier to read
  body: 'Loading RHS schedule...',
  
  // Background banner for temporary color fix
  //banner: 'images/rhs_banner_bg_image.png',
  
  // Icons/arrows for action buttons
  action: {up: 'images/rhs_action_weather.png',
           select: 'images/rhs_action_right_icon.png',
           down: 'images/rhs_action_announcements.png'}
  
  // NOTE: if the 'scrollable' value set to true,
  // it blocks the up and down button actions from being executed since the main card will ONLY scroll up and down!
  
});

// MAIN CARD BUTTON ACTIONS
// When select is clicked, show the absence list.
main.on('click', 'select', function(e) {
  scheduleAbsentCard.show();
});

// When up is clicked, show the school weather card.
main.on('click', 'up', function(e) {
  showWeatherCard();
});

// When down is clicked, show the announcements list.
main.on('click', 'down', function(e) {
  showNewsMenu();
});

// Get the total number of school days and set it as the subtitle
// See http://stackoverflow.com/questions/6088086/null-key-in-from-map-reduce-result-in-couchdb to get correct data/to fix common errors
ajax({ url: apicfg.schoolDaysURL, type: 'json' },
  function(data){
    
    //console.log(data);
    
    try {
      
      data.rows.forEach(function(element, index) {
        
        // Add each "counter" value to the total (how the CouchDB server operates)
        totalSchoolDaysFormatted += element.value;
        
      });
      
      // Remove any newlines from the data to avoid any issues with setting the subtitle
      // Set the subtitle to the total number of school days with its full name without any newlines
      // (this does not use the unit of measure of the Nomie metric so it looks good on the Pebble)
      
      // Set BG color
      main.backgroundColor(mainBGColor);
      
      // ... and set the total number of school days (with variable values added from JSON file) to the subtitle of the menu.
      // If 1 day has passed, show "1 day", not "1 days" (fix 10.2)
      if(totalSchoolDaysFormatted !== 1){
        main.subtitle(totalSchoolDaysFormatted.toString() + " days");
      }
      else{
        main.subtitle(totalSchoolDaysFormatted.toString() + " day");
      }
      
      // Set BG color
      main.backgroundColor(mainBGColor);
      
    }
    // If an error has occurred while getting the data...
    catch(error){
      // Set BG color
      main.backgroundColor(mainBGColor);
      // Set subtitle to placeholder (can't get total school days)
      main.subtitle('N/A days');
      // Set BG color
      main.backgroundColor(mainBGColor);
    }
});

// Get basic info ("(Today is a) __ Day" text/today's date)
ajax({
  url: apicfg.scheduleURL, 
  type: 'json',
  async: 'false'
},
function(data) {
  
  // 'Main' card output/body text
  var mainCardOutput = '';

  // Today's date for 'main' card
  var mainTodaysDate = '';
    
  // RHS DATA BELOW:

  // 1. Rotating schedule (day) data:
  // Append rotating schedule (4 day, 3 day, 2 day, 1 day...) data:

  try {
    
    // Get data directly from the 1st JSON list so it will not have issues
    
    // Append the rotating schedule full day name (Today is a 4 Day) to the output
    // We're appending a newline to the beginning so the entire text can show
    
    // Fix "No School Today." or "No School Today" --> "No School" string issue
    if(data.today.message.toString() === "No School Today." || data.today.message.toString() === "No School Today") {
      
      mainCardOutput += 'No School\n';
      main.backgroundColor(mainBGColor);
      
    }
    else {
      
      // Replace "today is a ... day" text to just "... day" to make it more concise.
      mainCardOutput += data.today.message.replace('Today is a ', '') + '\n';
      
      // Set BG color
      main.backgroundColor(mainBGColor);
    }

    main.backgroundColor(mainBGColor);


  }
  catch(error) {
    
    mainCardOutput += 'Error loading schedule\n';
    
    main.backgroundColor(mainBGColor);
    
  }

  // Added date in the main menu, just for convenience. Useful for when writing on papers, long essays, and worksheets, too.

  var d = new Date();

  mainTodaysDate = ((d.getMonth()+1).toString()) + "/" + ((d.getDate()).toString()) + "/" + ((d.getFullYear()).toString());

  mainCardOutput += mainTodaysDate;
  
  main.body(mainCardOutput);
  
  main.backgroundColor(mainBGColor);
  
});

// Get the schedule and absentee/absent/teacher absence list and show it in the schedule/absence list card

// Sets the initial index for adding all absent teachers and for the schedule in a neat menu for adding data later on.
// https://developer.getpebble.com/docs/pebblejs/#menu-on-39-select-39-callback
// (See Menu.item(sectionIndex, itemIndex, item))
var scheduleIndex = 1;
var absenceIndex = 1;

// Full absence locations and times for schedule
var absenceInfoFull = [];

// Get today's schedule *only* (not tomorrow's)
ajax({ url: apicfg.scheduleURL, type: 'json', method: 'get' }, function(data){
  
  // 2. Schedule/period/time data:
    //output += '\nSchedule:\n';
    // [!!] This repeats each element for the entire index of elements.
    // You do NOT need any for loops or anything inside this method (it's redundant) - it repeats each element so they can all be added to the output.
    
    // Try/catch methods in JS from: http://www.w3schools.com/js/js_errors.asp
    
    // We're putting the try/catch methods outside of the foreach loop because the data relies on having the table/list there in the API.
    
    try{
      
      // Set rotating sched. day variable for use later on the timeline
      rotatingScheduleDay = data.today.message.replace('Today is a ', '');
      
      // Empty (with a length of 0) 'schedule' array fix... (if the schedule array in the API is empty/has no items)
      if(data.today.schedule.length === 0) {
        scheduleAbsentCard.item(0, scheduleIndex, { title: 'No Classes', subtitle: 'Weekend or Holiday' });
      }
      
      else {
        data.today.schedule.forEach(function(element, index){
        
          // RHS DATA BELOW:
          
          // Adding the schedule data... (newline is added so the text looks neater)
          //output += '\nSchedule:\n';
          
          // This adds each period and period start/end time to the list.
          
          // Example:
          // Period 4
          // 7:45 - 8:45
          
          // Convert hours and minutes of event start/end to 12-hour time format
          // ONLY convert the hour, the minute doesn't need to change at all.
          var eventStartHour = convertTo12HourTime(element.start.split(":")[0]);
          var eventStartMinute = element.start.split(":")[1];
          
          var eventEndHour = convertTo12HourTime(element.end.split(":")[0]);
          var eventEndMinute = element.end.split(":")[1];
          
          // If the period name's length is 2 characters or less (e.g. NOT "Lunch", but "4" or "8" or "11" for instance),
          // add "Period " and the period number to denote/indicate that it is a regular period
          if(element.period.toString().length <= 2){
            
            scheduleAbsentCard.item(0, scheduleIndex, { title: "Period " + element.period.toString(),
                                                       subtitle: eventStartHour + ':' + eventStartMinute +
                                                       ' - ' + eventEndHour + ':' + eventEndMinute });
            
            /*
            // Get period parameters (period starting hour, etc.) before pushing this information to timeline
            // This HAS to be in 24-hour time format for the timeline
            var periodStartHour_noEvent = parseInt(element.start.split(":")[0]);
            var periodStartMinute_noEvent = parseInt(element.start.split(":")[1]);
            
            // Get current date to make timeline pin unique, and so it won't remove the old pins the last day (bug fix in 10.3)
            var currentDate = new Date();
            
            // Push schedule/period information to timeline
            // (make ID unique for timeline with item index/current date to parse/get all pins to push correctly)
            createScheduleTimelinePin(periodStartHour_noEvent, periodStartMinute_noEvent, "Period " + element.period.toString(),
                                      eventEndHour + ':' + eventEndMinute, rotatingScheduleDay, "rhs-sched-item-" +
                                      (currentDate.getMonth().toString()+1) +
                                      currentDate.getDate().toString() + index.toString());
            */
            
          }
          // Otherwise, just add the period name ("Lunch", etc.) to the menu.
          else{
            
            // Full event end time string
            var eventFullEndTime = eventEndHour + ':' + eventEndMinute;
            
            // Event title
            var eventTitle = element.period.toString();
            
            // If the "event" is lunch, subtract 5 minutes from the period's end time so it's easier to know when lunch actually ends.
            // (11:40 --> 11:35)
            if(element.period.toString().indexOf("Lunch") !== -1 || element.period.toString().indexOf("lunch") !== -1){
              eventFullEndTime = convertLunchTime(eventEndHour, eventEndMinute);
              
              // Make the "l" in "lunch" uppercase since it may be written incorrectly
              eventTitle = "Lunch";
            }
            
            scheduleAbsentCard.item(0, scheduleIndex, { title: eventTitle,
                                                       subtitle: eventStartHour + ':' + eventStartMinute +
                                                       ' - ' + eventFullEndTime });
            
            /*
            // Get event parameters (period starting hour, etc.) before pushing this information to timeline
            var periodStartHour_event = parseInt(element.start.split(":")[0]);
            var periodStartMinute_event = parseInt(element.start.split(":")[1]);
            
            // Get current date to make timeline pin unique, and so it won't remove the old pins the last day (bug fix in 10.3)
            var currentDate_event = new Date();
            
            // Push school period/event information to timeline
            // (make ID unique for timeline with item index to parse/get all pins to push correctly)
            createScheduleTimelinePin(periodStartHour_event, periodStartMinute_event, eventTitle,
                                      eventFullEndTime, rotatingScheduleDay, "rhs-sched-item-" +
                                      (currentDate_event.getMonth()+1).toString() +
                                      currentDate_event.getDate().toString() + index.toString());
            
            */
            
          }
          
          
          // Increment the current schedule index by 1 so that the next item can display on a separate line in the menu
          scheduleIndex++;
          
        });
      }
      
    }
    // If there's an error with the schedule, just print the weekend/holiday message as per usual.
    catch(error){
      
      // Perhaps a better thing to say to the user would be (and so it's more clear to the user what is going on):
      scheduleAbsentCard.item(0, scheduleIndex, { title: 'No Classes', subtitle: 'Weekend or Holiday' });
      
    }
});
  
  
  // 3. Absentee data:
ajax({ url: apicfg.absenceURL, type: 'json', method: 'get' }, function(data){
  // Try/catch methods in JS from: http://www.w3schools.com/js/js_errors.asp

  // If there are no absences (the array is empty)
  if(data.absenceList.absences.length === 0){
    scheduleAbsentCard.item(1, absenceIndex, { title: 'No Absences', subtitle: 'Check back later!' });
  }
  // We're putting the try/catch methods outside of the foreach loop because the data relies on having the table/list there in the API.  
  else{
    try{
        data.absenceList.absences.forEach(function(element, index){  
          
          var absenteeName = element.name;
          var fullAbsenteeLocation = "";
          var fullAbsenteeTime = "";
  
          var completeAbsenteeLocation = "";
          var completeAbsenteeTime = "";
          
  
          element.info.forEach(function(element, index){  
  
            // Now adding the absence list data...
            
            var originalAbsenteeLocation = element.location;
            var originalAbsenteeTime = element.reason;
            
            // ================ ABSENTEE LOCATION/WORK STRING FIXES ================
            
            // Lengthy versions
            var lengthyAbsenteeLocations = ['Work posted online', 'Online Assignment', 'Worksheets on Counter in Main Office',
                                            'Assignment on counter in Main Office', 'Worksheet on Counter in Main Office',
                                            'Work on Counter in Main Office', 'Regular Classsroom', 'Regular Classroom',
                                            'Classsroom', 'Classroom', 'Report To Room', 'Go To Room', 'Report Room', 'Room'];
            
            // Shortened versions
            var shortenedAbsenteeLocations = ['Online', 'Online', 'W/S 106', 'W/S 106', 'W/S 106',
                                             'W/S Main (106)', 'Class', 'Class', 'Class', 'Class', 'Rm', 'Rm', 'Rm', 'Rm'];
            
            
            // Define the fixed location string (cleared on each run)
            var fixedAbsenteeLocation = "";
            // Set to initial/1st/given (not shortened) location
            fixedAbsenteeLocation = element.location;
            
            // Fix 'em with JavaScript's forEach loop
            // Where location is a name of a location (ex. "Online Assignment") and index is the current value in the array
            lengthyAbsenteeLocations.forEach(function(location, index){
              // Replace original location in string with fixed string
              // Use regex - gi flag: global (all matches), case insensitive (a / A work, it doesn't matter)
              var lenLoc = new RegExp(location, 'gi');
              
              fixedAbsenteeLocation = fixedAbsenteeLocation.replace(lenLoc, shortenedAbsenteeLocations[index]);
            });
            
            // ================ ABSENTEE TIME STRING FIXES ================
            
            // Lengthy versions
            var lengthyAbsenteeTimes = ['All Other Periods', 'All other Periods', 'Other Periods', 'All Periods',
                                        'Periods', 'Period', ' Only', ' ONLY', ' only'];
            
            // Shortened versions
            var shortenedAbsenteeTimes = ['Other', 'Other', 'Other', 'All',
                                          'Pds', 'Pd', '', '', ''];
            
            // Define the fixed time string (cleared on each run)
            var fixedAbsenteeTime = "";
            // Set to initial/1st/given (not shortened) time
            fixedAbsenteeTime = element.reason;
            
            // Fix 'em with JavaScript's forEach loop
            // Where time is an absence time (ex. "All Periods") and index is the current value in the array
            lengthyAbsenteeTimes.forEach(function(time, index){
              // Replace original time in string with fixed string
              // Use regex - gi flag: global (all matches), case insensitive (a / A work, it doesn't matter)
              var lenTime = new RegExp(time, 'gi');
              
              fixedAbsenteeTime = fixedAbsenteeTime.replace(lenTime, shortenedAbsenteeTimes[index]);
              
            });
            
            // ============================================================
            
            // Add multiple absence list locations & times to individual cards in the absence menu
  
            fullAbsenteeLocation += fixedAbsenteeLocation + "/";
            fullAbsenteeTime += fixedAbsenteeTime + "/";
            
            completeAbsenteeLocation += originalAbsenteeLocation + "/";
            completeAbsenteeTime += originalAbsenteeTime + "/";
            
            // Example:
            // Mr. Smith
            // Campus Center (All Periods)
            scheduleAbsentCard.item(1, absenceIndex, { title: absenteeName, subtitle: fullAbsenteeLocation.substring(0, fullAbsenteeLocation.length-1) + ' (' + fullAbsenteeTime.substring(0, fullAbsenteeTime.length-1) + ')' });
            
            // Add the full absence info to the absenceInfoFull array, used when the card is clicked on & the more info functions are called
            absenceInfoFull[absenceIndex] = "Details: " + completeAbsenteeLocation.substring(0, completeAbsenteeLocation.length-1) + "\nTime: " + completeAbsenteeTime.substring(0, completeAbsenteeTime.length-1);
          
          });
          
          // Increment the current index by 1 so that the next item can display on a separate line in the menu
          absenceIndex++;
          
        });
        
      }
      catch(error){
        //output += 'No Absence List Data\n';
        
        // Perhaps a better thing to say to the user would be (and so it's more clear to the user what is going on, that there are no absences):
        scheduleAbsentCard.item(1, absenceIndex, { title: 'No Absences', subtitle: 'Check back later!' });
      }
  }
    
});

// When exiting more info card, reset data to avoid conflicts with other data/weather data.
moreInfoCard.on('click', 'back', function(e) {
  // Reset data
  moreInfoCard.title(" More Info");
  moreInfoCard.icon("images/rhs_about.png");
  moreInfoCard.subtitle("");
  moreInfoCard.body("Loading...");
  
  // Hide card
  moreInfoCard.hide();
});

// On schedule item long press -- use longSelect instead of select (https://pebble.github.io/pebblejs/#menu-on-select-callback)
scheduleAbsentCard.on('select', function(e) {
  
  // Don't have a long-press menu for the about screen since it already has a separate screen.
  // Show the separate ('about' card) screen instead. (Section 3 / Item 0)
  
  // If an item from the schedule section (schedule items have an index of 0) is long-pressed and is not informational -- e.g.
  // invalid 'schedule not found' or title ('schedule') selection, show more information on another page.
  if(e.item.title === "About"){
    
    // Have a menu for the "about" section to reduce clutter & prevent crashes from happening.
    aboutMenu.show();
    
  }
  else if(e.item.title != "Schedule" && e.item.title != "About" && e.item.title != "Absence List"){
    
    // If the selection is an absence (section 1), include the full absence information.
    if(e.sectionIndex === 1){
      
      // If the "no absences" item is long-pressed (meaning the only item on the list is "No Absences"
      // and there are none), don't show more info on the "more info" card.
      if(e.item.title === "No Absences") {
        
      }
      // If there are no absences (the absences array is empty)
      // Fixed in v10.0
      else if(e.item.title === "Loading..."){
        
      }
      // Otherwise, show more info about the absence itself.
      else{
        moreInfoCard.subtitle(e.item.title);
        moreInfoCard.body(absenceInfoFull[e.itemIndex]);
        moreInfoCard.show();
      }
    }
    
    // If the selection is a period (section 0), include the time remaining in the period.
    else if(e.sectionIndex === 0){
      
      // Fix "no classes" issue
      if(e.item.title === "No Classes"){
        
      }
      // If there is a class listed, get the time remaining in the period.
      else{
        
        // Split the period string to get the end time
        var fullPeriodString = e.item.subtitle;
        var startEndArray = fullPeriodString.split(" - ");
        var endTimeArray = startEndArray[1].split(":");
        var hoursString = endTimeArray[0];
        
        var intHours = parseInt(hoursString);
        
        var minutesString = endTimeArray[1];
        
        //console.log(hoursString + minutesString);
        
        // If the hour is less than 7 (i.e. 1:00pm, 2:00pm) set it 12 hours ahead because the Date object will only parse 24-hour time for hours.
        if(intHours < 7) {
          intHours += 12;
        }
        
        // Date variables for calculating time to end of class
        var currentDate = new Date();
        //var periodEndDate = new Date();
        var periodFullEndDate = new Date(currentDate.getFullYear(), currentDate.getMonth(),
                                         currentDate.getDate(), parseInt(intHours),
                                         parseInt(minutesString), 0, 0);
        
        // Now the (slightly) tricky part... the milliseconds comparison.
        
        // These variables will determine whether to say "since" after the period has already ended (> 0 milliseconds in the time calculator's case) or "until" if it has not ended.
        
        // The integer may be used for later usage... leave it here for now.
        var periodHasEnded = 0;
        
        // The ending period strings that will show on the screen.
        var endingString = "until";
        var endingString2 = "period ends";
        
        // The positive number of milliseconds for display.
        var positiveMSRemaining = Math.abs(currentDate.getTime() - periodFullEndDate.getTime());
        
        // The regular number of milliseconds for determining values.
        var msRemaining = currentDate.getTime() - periodFullEndDate.getTime();
        
        // These variables are used to calculate minutes and seconds since the given period has passed.
        // (in this case, we will use the positive variable for display later using Math.abs() to convert it using absolute value rules)
        
        // Round the minutes and seconds (using the Math.floor function)
        var timeRemainingMinutes = Math.floor(positiveMSRemaining / 60000);
        
        // Subtract the remaining minutes...
        var timeRemainingSeconds = Math.floor(positiveMSRemaining / 1000) - (timeRemainingMinutes * 60);
        
        // Change the strings if the period has 0ms left (it has passed)... and...
        if(msRemaining > 0){
          endingString = "since";
          endingString2 = "period has ended";
          periodHasEnded = 1;
        }
        else{
          endingString = "until";
          endingString2 = "period ends";
          periodHasEnded = 0;
        }
        
        // We have liftoff! :D
        // Set the text and include it in the 'more info' page.
        moreInfoCard.subtitle(e.item.title);
        moreInfoCard.body(e.item.subtitle + "\n" + timeRemainingMinutes + "m " +
                          timeRemainingSeconds + "s " + endingString + " " + endingString2);
        moreInfoCard.show();
        
      }
      
    }
    
    // Show announcements (Section 2 / titled "News" because "Announcements" won't fit)
    else if(e.sectionIndex === 2 && e.item.title === "News") {
      showNewsMenu();
    }
    
    // Show weather information (Section 3 / *explicitly titled "Weather"*)
    else if(e.sectionIndex === 3 && e.item.title === "Weather") {
      showWeatherCard();
    }
    
    
    // Otherwise, just include the information given in the cell (in the table) on a separate information page as a fallback.
    else {
      moreInfoCard.subtitle(e.item.title);
      
      // New line for consistency and neatness (actually it's not needed anyway... more information needs to fit on the screen)
      moreInfoCard.body(e.item.subtitle);
      
      moreInfoCard.show();
    }
  }
  
  
  // IF all of these checks fail and there is no viable information to be displayed (see above...),
  // then just show instructional information about that specific card (absence list, schedule, etc.)
  else {
    
    moreInfoCard.subtitle(e.item.title);
    
    switch(e.sectionIndex){
      
        // Long press instructions
      /* case 0:
        moreInfoCard.subtitle("Instructions");
        moreInfoCard.body("Thank you for using the RHS Schedule watchapp!\nPress any table item at any time for more information.\nThe first page will contain an overview.\nThe second will contain periods and the absence list.\nThe third will bring up the app version and developer information.");
        break; */
        
        // Schedule
      case 0:
        moreInfoCard.body("View your schedule and periods on this list.\nPress for more information and the time until the period will end or has ended.");
        break;
      
        // Absence List
      case 1:
        moreInfoCard.body("View your absences, times and locations on this list.\nPress for expanded information on the location and the time.");
        break;
        
        // About section (will only show about section)
      /* case 2:
        moreInfoCard.subtitle("Instructions");
        moreInfoCard.body("Thank you for using the RHS Schedule watchapp!\nPress any table item at any time for more information.\nThe first page will contain an overview.\nThe second will contain periods and the absence list.\nThe third will bring up the app version and developer information.");
        break; */
        
        // Default (if no sections listed here are selected)
      default:
        moreInfoCard.subtitle("Instructions");
        moreInfoCard.body("Thank you for using the RHS Schedule watchapp!\nPress any table item at any time for more information.\nThe first page will contain an overview.\nThe second will contain periods and the absence list.\nThe third will bring up the app version and developer information.");
        break;
    }
    
    moreInfoCard.show();
    
  }
});

// If an announcement (section 1) is clicked in the announcements menu, show the announcements card w/ more info/full text about it
newsMenu.on('select', function(e) {
  
  if(e.title !== "Connecting..." && e.sectionIndex === 1) {
    
    moreInfoCard.icon("images/rhs_announcements.png");
    moreInfoCard.subtitle(newsTitles[e.itemIndex]);
    moreInfoCard.body(newsSubtitles[e.itemIndex]);
    
    moreInfoCard.show();
  }
  
});

// Show the main card.
main.show();
// Set main card's background color to specified variable (color hex code at top near initialization variables).
main.backgroundColor(mainBGColor);
