
TODO: Allow download of attachment
TODO: Allow listing of attachments by entity

## [3.3.14]

- Added typescript to user info return

## [3.3.13]

- Removed lodash library
- updated the single place it was used

## [3.3.12]

- Added download of file id
- Fixed getUserInfo endpoint to work with production
- Added get user info to example server

## [3.3.11]

- Changed /upload endpoint for attachments to use Buffer instead of stream
- Working upload of attachments
- Added typescript for upload return
- fixed typescript on attachmentRef

## [3.3.10]

- Added special header for CDC
- Added typing for CDC endpoint
- Updated server example with cdc
- Updated readme with cdc information

## [3.3.9]

- Added in special headers to most returns to allow for easier debugging

## [3.3.8]

- exported store interfaces

## [3.3.7]

- Added state as optional paramater to authorize url
- Updated readme with new authorize url paramater
- Updated example serveer

## [3.3.6]

- Updated processing to allow forced types
- Allow type meta and description changes
- Fixed TelephoneNumber to be combined type
- Fixed Customer PreferredDeliveryMethod to be literal type
- Fixed Vendor_OtherContactInfo_ContactInfo Telephone to be string and not TelephoneNumber type

## [3.3.5]

- Changed readme config setup to say function store instaed of class store for the example
- Updated readme internal method description
- Fixed refresh token using wrong variable

## [3.3.4]

- Updated readme overview paragraph

## [3.3.3]

- Converted Query information to table in readme
- Updated internal method description in readme

## [3.3.2]

- Removed console logs used for testing
- updated readme with AppConfig properties as a table
- added console log links in server example

## [3.3.1]

- Updated Readme with direct link to server example
- Updated server example with comment on webhook endpoint
- Fixed grammer in readme

## [3.3.0]

- Changed store function save method to have realmId as first parameter
- Updated readme with new store methods
- Updated readme with OAuth process

## [3.2.0]

- Added new store methods
- all simple usage with access token
- new store functiones instead of using a class

## [3.1.8]

- Added typescript code picture to readme

## [3.1.7]

- updated package description

## [3.1.6]

- Updated readme to include webhook information

## [3.1.5]

- Added operators usable to readme
- Removed string as a type for Date
- Added date as a type for Store expired time
- Added Webhook signature check
- Added Webhook signature check to server example
- updated scraper to remove html code

## [3.1.4]

- NPM version error fix with bumping version

## [3.1.3]

- Moved fixes into own file for easy changes
- Fixed invoice subtotal spelling attribute
- Added larger invoice create example on server
- Removed old js server example

## [3.1.2]

- Updated readme for more query information

## [3.1.1]

- Updated readme with better query informaiton
- Updated operator with specific types

## [3.1.0]

- Fixed query requesting
- Added optional to query response properties which is possible if offset is too high
- Updated sorted at to allow simplier method
- updated readme with how to use sorted at
- Export Doc comments to npm types

## [3.0.2]

- Fixed inoice item enum text correctly

## [3.0.1]

- Fixed custom field to be an array

## [3.0.0]

- Updated with typescript types on main item
- Scraper app to auto generate types

## [2.0.4]

- Fixed pointing to the correct types file in package.json

## [2.0.3]

- Added DefaultStore that can be used
- Updated readme documentation

## [2.0.2]

- Fixed pdf url
- Added more typings
- Added and cleaned up typescript server example
- Fixed query to allow undefined or null

## [2.0.0]

- Updated to typescript

## [1.1.6]

- Removed typescript because was not complete

## [1.1.3]

- Fixed PDF to return buffer correctly
- Updated server example
- Updated default minor version
- Updated README with new minor version
- Added a basic types file
- Added Readme log
