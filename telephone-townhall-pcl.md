Telephone Townhall Program Check List
-------------------------------------

The purpose of this document is to describe the things that have been tested
within the Telephone Townhall Setup project.


### Login - [SP-685](https://shoutpoint.atlassian.net/browse/SP-685):

1.  Setup button should take me to conference calendar page (or login if not logged in)
    * links to login always
2.  Password with # character should be permitted
    * OK
3.  Attempting to login with bad credentials should provide a helpful message
    * OK
4.  Attempting to login with invalid permissions should provide a helpful message
    * OK

### Advanced Settings - [SP-683](https://shoutpoint.atlassian.net/browse/SP-683)

1.  Advanced settings in the sidebar should be labeled "Advanced Settings"
    * OK

### Donations Setup - [SP-682](https://shoutpoint.atlassian.net/browse/SP-682)

1.  Donations Setup tab should be removed as we will not support it in this version
    * OK

### Calendar Page - [SP-673](https://shoutpoint.atlassian.net/browse/SP-673)

1.  Filter feature
    * Add
2.  Refresh
    * OK
3.  Export Calendar
    * Need to add this
4.  Day View
    * OK
5.  Day view time range
    * OK
6.  Conference names with schedule id:
    * This is by design, but added event number
7.  Date link
    * OK

### Conference Editing Page - General - [SP-674](https://shoutpoint.atlassian.net/browse/SP-674)

1.  Export Calendar
    * NG
2.  Copy Conference Data
    * OK
3.  Logout
    * OK
4.  Revert
    * Appears OK
5.  Delete Missing
    * NG
6.  Duplicate non-clickable
    * Clicks, doesn't appear to actually do anything
7.  Save / save typo
    * OK
8.  Sidebar cut off
    * OK
9.  Save with broken icon
    * OK
10. Save improperly redirects to calendar
    * OK
11. Message change
    * OK, although I would prefer this to be a toast message (e.g. appear for 5 seconds and dismiss)
12. Validation messages
    * these need work.

### Conference Edit PCL:
1.  Conference Name:
    * Deleting conference name should disable save, and display a notice that name is required.
    * Changing the name should mark the conference as dirty and enable 
       * this should happen as soon as the modification occurs, not only at focus change.      

2.  Time settings:
    * Hours selector should allow _only_ numbers between 0 and 23
       * Entering a number outside that range should reset to 0 or 23, whichever is closer.
    * Minutes selector should allow _only_ numbers between 0 and 59
       * Entering a number outside that range should reset to 0 or 59, whichever is closer.
    * Entering a conference time before 8:00 or after 21:59 should display a warning that it 
      is either very late or very early in the morning.
    * Conferences can only last a minimum of 30 minutes and a maximum of 240 minutes.  
      The setup method will return a validation message on save if these are out of 
      range.  This message should be shown.

3.  Manage Phone Lists:

4.  Call-ID Management:

5.  Role Management:

6.  Audio Management:

7.  Poll Setup:

8.  Donations Setup:
    * Donations setup is removed in the HTML version

9.  Advanced Settings:

10. Other Schedules:
    * If there are other schedules available for this conference this should show a list
      of them and allow the user to click one to go to that particular schedule.  The link
      should show the count: "x other schedules"
    * If there are no other schedules available for this the text should be  "No other schedules" 
