# RHS Schedule for Pebble
The unofficial RHS app for Pebble smartwatches that displays the schedule, absence list, current weather conditions, and [total number of school days passed](https://github.com/siliconninja/TotalSchoolDays).

**To install, download a .pbw file from the VERSIONS folder and install it locally from the Gadgetbridge or Pebble mobile app.**

In light of recent news that the [Pebble company is being bought out by Fitbit](https://www.reddit.com/r/pebble/comments/5fuhdh/fitbit_reportedly_purchasing_and_phasing_out/), this app is no longer on the appstore.

All current binary versions with API keys will continue to be available for download in the [repository's VERSIONS folder](https://github.com/siliconninja/RHSPebble). All source code, including most API URLs, have been released to the public.

Timeline functionality will no longer be supported, regardless of where it's published, because Fitbit is planning to phase out the Pebble App Store.

## [Install on your Pebble, Pebble Time, or Pebble Time Round now!](https://github.com/siliconninja/RHSPebble/tree/master/VERSIONS)
https://github.com/siliconninja/RHSPebble/tree/master/VERSIONS

## API Status
The RHS Schedule API is currently gathering real-time data. Main data source: https://bit.ly/rhsdata

The RHS Weather API is no longer available.
~~The RHS Weather API has breaking changes. Please update to v10.42 ASAP. ([Powered by Dark Sky](https://darksky.net/poweredby/))~~

The RHS Total School Days API is no longer available.
~~The RHS Total School Days API is currently gathering real-time data.~~

## Screenshots

|Pebble Classic|Pebble Time|Pebble Time Round|
|:---:|:---:|:---:|
|<img src="../../raw/master/images/timeline1.png" alt="Timeline with Scheduled Periods Displaying on Pebble/Pebble Steel" width="60%" height="60%">|<img src="../../raw/master/images/canvas14.png" alt="Absence List Displaying on Pebble Time" width="60%" height="60%">|<img src="../../raw/master/images/canvas5.png" alt="Period Details Displaying on Pebble Time Round" width="60%" height="60%">|

## License
Until 8/22/18, this project was licensed under CC-BY-NC-SA 4.0. To make this project more accessible to the open source community and to encourage sharing, I've decided to relicense it under the MIT license. You may relicense your existing work and use it under CC-BY 4.0 (or another license, as long as your work complies with the terms of the MIT license license) if you want to. Please see the LICENSE file for the full terms of the license first.

[MIT License](LICENSE) in this repo's files **with exceptions to some files** (see the [LICENSE](LICENSE) for details.)

### Icon Credits
Miu "Clock" icon by Linh Pham Thi Dieu (rhs_schedule.png) @ http://linhpham.me/miu/ - This repository's version is MODIFIED from the original

    > These icons are free and you can use them in any project you want, but please do not redistribute the icons themselves.

Hawcons "Documents" icon by Yannick Lung (rhs_absent.png) @ http://hawcons.com/faq/ - This repository's version is MODIFIED from the original

    > You are free to use Hawcons for commercial and personal purposes without attribution, however a credit for the work would be appreciated. You may not sell or redistribute the icons themselves as icons. Do not claim creative credit.
    > If you would like to support the work you can do this with the donate button on the website.
    > If you have any additional questions please contact Hawcons via email or social networks.

Google Material Design "info outline" icon (rhs_about.png) @ https://github.com/google/material-design-icons - This repository's version is MODIFIED from the original - License: [Apache2](https://github.com/google/material-design-icons/blob/master/LICENSE)
  
## App Changelogs

## Current Versions
#### v12.0 (Last Release) (12/2/16)

Well, it's been a great ride.

So long, and thanks for all the fish.

I have decided to abandon this project because of (1) the news about the merge, and (2) since it has been through a lot of progress/development, I have decided that it's time to work on others.

Therefore, I am making 99.9% (almost everything) of the binary source code public, including the RHS Schedule API URL so other developers will be able to use the API more easily in their RHS apps, and promote the use of open source!

The only thing still closed-source is the Dark Sky API URL in this binary. This is only included for the convenience of the end-user, nothing else.

Unfortunately, this app won't work with Gadgetbridge on Android because it requires internet access, although the developers are starting to think about implementing this feature. I would like to port it to C and write a companion app, but I would rather not have my work be put into a breaking platform due to the merge.

##### The last changelog:

- Removed Timeline Support (due to Pebble merge with Fitbit)
- Open-sourced 99.9% of source-code (see above for details)
- Uploaded most appstore assets to this repository under the open-source license (some do not comply)
- Put this long-term project aside for others

### [Obsolete Version History (check it out!)](VERSION_HISTORY.md#obsolete-version-history)
