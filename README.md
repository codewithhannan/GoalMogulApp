# GoalMogul-iOS
React native iOS app

## Commit process
1. Create a PR with
   * Description on what tasks this pr addresses
   * Link the asana task associated
   * Put screenshot / screen recording for UI change
2. Ask for at least 1 reviewer
   * Approach them / notify in #ios-development
3. Merge once PR is approved
   * Update the [release document](https://docs.google.com/document/d/1_GZMjx_2E5XcT2l8PsncFPmtc-oZu2ctcJ8wEI_pD8s/edit?usp=sharing) for the **Current** section. Indicate if it's a major feature, UI polish or functionality fix.

## Android version code convention
The largest version code Android supports is 2100000000. Our break down is 
{ 04 }                     {0}                                          {00}           {08}              {01}
minimum API level 4 APK    either screen sizes or GL texture formats    Major version   minor version    patch version

Hence, the integer 040000801 refers to app version 0.8.1 that runs on minimum Android API level 4 with default screen size. We need to truncate the first 0 to make it a number. The eventual representation in app.json is "versionCode": "40000801".
