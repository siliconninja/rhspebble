# RHS Schedule for Pebble

## Obsolete Version History
How did this come from a simple app all the way to Version 10?

Look back to the glory days of version 1.0 and see how this app started out.

These changelogs are posted for the purpose of a statistical and observational way to view the app's long history.

#### v11.10 Release Notes (released on 11/7/16):
Fixed link for RHS Schedule API data source.

#### v11.0 Release Notes (released on 9/23/16):
Quick rundown of all the new cool features in v11.0:

- New shortcuts to get to the weather and announcements from the main menu!
- Snappier animations and menus!
- New announcements menu!
- New about menu!
- New app icon!
- Fixed schedule icon!
- Fixes for absence locations (Report to Room is now Room, fixed Main Office 108 to 106 -- hopefully that goes well)!
- Fixes for Lunch period displaying as "lunch", fixed on timeline as well!
- Cleaned up and refactored code, so it's easier for anyone to read!

What are you waiting for? Go download it and check it out!

#### v10.42 Release Notes (released on 9/21/16):
Fix a leading zero (e.g. in the 12:10 &rarr; 12:05 time blocks for lunch on an enrichment day).

#### v10.41 Release Notes (released on 9/20/16):
Breaking API changes for the new Dark Sky API. Please update to this version ASAP.

Changed text to better include attributions for icons in About menu.

Reflect Dark Sky API's new terms of service by changing attributions, removing Forecast.io, &amp; changing weather request API URL to darksky.net.

#### v10.4 Release Notes (released on 9/9/16):
Major improvements to how times are displayed, including:

No more leading zeros! Yay! (08:45 should be 8:45)

24-hour time issue fixed (13:45 should be 1:45)

Lunch "end time" shortened by 5 minutes (11:40 should be 11:35)

... as well as:

Fix for Main Office absence (108 should be 106)

Fixes for timeline ID handling

#### v10.3 Release Notes (released on 9/7/16):
Fix timeline pin issue where pins from previous day were removed

#### v10.2 Release Notes (released on 9/6/16):
Fixed timeline pin issue where only 1 pin shows up at a time

Added more information and a new icon to the timeline pin

Fixed another sneaky bug: "1 days" &rarr; "1 day"

Fixed absences not being shortened

#### v10.1 Release Notes (released on 8/30/16):
Fixed timeline issue (pins not showing)

#### v10.0 Release Notes (released on 8/30/16):
Just in time for the new school year! Hope you enjoy the new update :)

- Timeline support for periods (the API is slow, so it takes 10-15 minutes to process a small chunk of information)
- Rewrite of the absence system
- Fixes for Pebble Time Round users
- UI improvements
- New API system for Total School Days (introduced in v7.50)
- A lot of other bug fixes &amp; memory optimizations

#### v7.50 Release Notes (released on 8/23/16):
Groundbreaking API changes &mdash; school days are now updated manually through JSON.

Update to this version is a must.

(There will be a long delay in updates due to my schedule. I am planning to rewrite this app from the ground up using Rocky.js when it is finalized because it has native support for P2/PT2.)

#### v7.30 Release Notes (released on 6/3/16):
More string, memory, and color bug fixes.

#### v7.22 Release Notes (released on 6/1/16):
Color display bug fix on the main menu.

Memory & app optimization fixes.

Fixed bug where the 'about' screen crashes when going back.

#### v7.21 Release Notes (released on 5/28/16):
We're squashing some more bugs, fixing some strings and improving the general UI overall!

... such as "No school today." --> "No school", a schedule issue, an announcements display issue, and LOADS of others.

News/Announcements data is now saved locally so it will now load properly!

As always, have fun using the RHS School Schedule App!

Pebble 2/Time 2 support is TBD at this point... not sure if Pebble will use their resources to focus on it.

#### v7.11 Release Notes (released on 5/13/16):
Announcements/other string bug fixes.

Set timeout from 1000ms to 2500ms to load announcements.

Fixed flag icon.

#### v7.1 Release Notes (released on 5/13/16):
Schedule/absence data is now gathered in real-time

Added announcements menu

Fixed a few minor string issues and other naming/memory/collection issues

#### v7.0 Release Notes (released on 5/9/16):

Apparently, Pebble hates my version numbering. I just have to go to 7.0 to fix it. Ah well :)

Replaced "Today is a ... Day" text with just "... Day"

Fixed online assignment absence list text in absence menu to make app faster and text make more sense.

Lengthened app title from "RHS Schedule" to "RHS School Schedule" so it's easier to find in the app store.

Fixed "Period(s) ... only" --> "Period(s) ..." in absence list menu.

Fixed total school days API issue with Nomie (although it's still not real-time data, yet. Nomie, fix your stuff!)

#### v6.02 Release Notes (released on 5/5/16 -- 5 days of updates in a row!):

Bug fix for about screen crashing when going back.

Removed instructions from main menu. (They're not needed because of the action bar introduced in 5.0)

Removed a lot of unnecessary comments and unused functions from the code to decrease size and increase code readability. (Refactored the code.)

Optimized Pebble memory/CPU usage. The about screen is now just a "more info" card item as a result.

Reset "more info" information upon exit so other cards will not show previously loaded icons/info.

Absence duplicate removal is working great so far... except some absences aren't showing up.

**The absence _location_ requirements will be removed on May 9th, which gives a lot more headroom for freeing memory and loading all absences onto the list. An update to the API will come if needed, however I may take a break from Pebble development for a while since I've done so much this week already.**

#### v6.01 Release Notes (released on 5/5/16):

Bug fixes for weather data not showing the first time and other duplicate information such as absence list data on weather card.

The delay for showing weather data has been extended to 1.5 seconds as a result.

#### v6.0 Release Notes (released on 5/4/16, has been revised in the process):
May the fourth be with you and your schoolwork!

Pebble Time Round support is now fully available and works very smoothly! (Thanks Pebble for updating Pebble.js again!)

Fixed grainy color issue on Pebble/Pebble Steel watches, thank you again Pebble!

The scrolling issue is finally fixed, thank you so much Pebble!!! :D

The weather issue should be fixed now. It is in a separate menu and credits are added to Forecast.io in the about page.

As a result, weather is now gathered in real-time and includes way more information, including chance of precipitation and "feels like" temperature!

(There is a limit of 1,000 calls per day, which is VERY generous. **Please be considerate when using the weather feature!**)

Absence duplicates should be fixed as well (however, it still may not be perfect).

#### v5.01 Release Notes \[CRUCIAL bug fix update\] (5/3/16):

Main menu/data gathering/memory bug fixes.

#### v5.0 Release Notes (5/1/16):
Just in time for the big day (closing of Numerous)! Now the Nomie app syncs to a CouchDB database, for real-time school day counts, every SECOND!

Reconstructed the UI from the ground up with new background colors and icons (no more light red/salmon color on schedule/absence list screen).

Added temperature/weather conditions in the school's city on the main screen!

Removed unnecessary/unused images to decrease app's size for download.

Action bar is now displayed on the main screen as a visual aid!

Long press to view more info is now just a simple press. No need for stress just to know when the period ends :)

Removed "Long press..." item from absence/schedule screen, and made the entire menu a lot less cluttered.

Fixed "Cafeteria" item being too long. Shortened it to "Caf".

FINALLY fixed the "undefined" issue. Now it's "No School" again!

Optimized "About" and "Main" screens with shortened information.

Obliterated some recurring and annoying bugs (including "No Absences" fix)!

**Slow scrolling issue [will be fixed in Pebble firmware version 3.12 or through a local Pebble.js build](https://forums.pebble.com/t/pebble-js-scrolling-problem/19971/6#Comment_173405).**

**See [Watch Status](http://watchstat.us) for current firmware versions.**

**If enough demand is created for the app and a new, fixed firmware is not released before May 20th, I will locally run the latest Pebble.js build in Linux and publish an updated PBW version created through that (which will be v5.1).**

#### v4.1 Release Notes (2/29/16):
Lots of releases today! Hope you enjoy the optimizations!

Fixed lunch period not appearing.

Added "until"/"since" text depending on whether the period has ended.

Fixed some other console logging issues.

Unfortunately, Pebble Time Round support is STILL not introduced in Pebble.js yet. You can still try the manual fix by downloading the file on this repository (RHSv41.pbw). It may not work though.

#### v4.0 Release Notes (2/29/16):
THE BIG ONE!

Created a more info page for list items.

Added period time until/since period ends/has ended.

Fixed many issues. Enjoy!

#### v3.02 (v3.0b2) Release Notes (2/29/16):
Fixed "undefined" error on weekends when there is no school

#### v3.01 (v3.0b1) Release Notes (2/28/16):

Sorry, I was in a rush and just had to post a beta version. Kimonolabs will be down tomorrow.

I had to find a suitable API generator that would fit my needs. Apifier didn't work very well. Let's hear it for Parsehub!

The only issue with Parsehub is that it duplicates absences on my app over and over, 3 times!

It makes the app parse data slower but just for that kind of functionality, it's awesome.

Some memory should be freed though. Removed lots of unnecessary code.

The new feature is one everyone's been waiting for... multiple absences!! Let's rack up some more downloads and runs just for this!

3.01 will be considered 3.0, beta 1 (3.0b1).

We'll keep you posted with some updates along the way.


The names are placeholders for now because the API creator hates the other URL for some reason (maybe it's caching the results?) Tomorrow I will change the URL back for regular school results. 

#### v2.0 Release Notes (2/7/16):

- Add (partial) color support (in the Absence List/Schedule menu) for the Pebble Time -- thank you Pebble.js for updating that!
  - Add a greyscale absence list/schedule menu for the Original Pebble/Pebble Steel for consistency and to make it look cool!
- Many groundbreaking UI fixes (Pebble.js is still in beta, so it's still not the smoothest...)
- Shortened absence list names even further to make room for data (CC: Campus Center, Class: Classroom, Pd: Period, All: All Periods, Pds: Periods)
- Added a catch statement (fail-safe/fallback) in case the school days API goes down (Numerous is shutting down on 5/1/16, which I depend on to run this API)
- Added an "about" section in a separate place so it's more intuitive for users to navigate to it
- Remade some of the icons! Graphic design for the win!
- Optimized ALL APIs for production in v2.0! (Still no fix for multiple absences for 1 teacher... yet)
- Added today's date to the main screen -- useful for writing papers or filling in on worksheets! You'll never need to ask your teacher what today's date is again!
- Many other stability improvements and bug fixes.

#### v1.11 Release Notes (11/9/15):
- Fixed absence list data not fitting.

#### v1.1 Release Notes (11/8/15):
- Fixed stability issues pertaining to menus not responding
- Minor UI and speed improvements
- Added Pebble Time Round support (beta): see repository to download the files.

#### v1.0 Release Notes (11/7/15):
Initial release of the RHS Schedule app.

Some stability and data issues may occur. Thank you for using the RHS Pebble app!
