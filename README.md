## Introduction
A nodejs module to access listings from UCI's schedule of classes, [WebSoc](https://www.reg.uci.edu/perl/WebSoc).
This API allows access to school, department, course, and section data in a hierarchical JSON format.
## Installation
Drop in websocapi.js and classes.js into your project then import:

```javascript
const WebSocAPI = require('./websocapi.js');
```

## Documentation
### Retrieving class listings
#### callWebSocAPI(options, callback(result)) {
To retrieve class listings, you just call this function `callWebSocAPI` and pass in two parameters. The first parameter, options, is an object-literal
that configures what you're looking for, such as department, term, division etc. The second parameter is a callback function
that is called when the function is done retrieving classes.
##### options
Descriptions found [here](https://www.reg.uci.edu/help/WebSoc-Glossary.shtml)

| Name             | Formatting                                                                                                                                                                                                                                                                                                                                                      | Notes                                                                                         |
|------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------|
| term             | [Year\] \['Fall'&#124;'Winter'&#124;'Spring'&#124;'Summer1'&#124;'Summer2'&#124;'Summer10wk'\]<br />Example: '2017 Fall' <br/> Default: ' '                                                                                                                                                                                                                     | Required. Schedule for your selected term must be available on WebSoc.                        |
| GE               |\['ANY'&#124;'GE-1A'&#124;'GE-1B'&#124;'GE-2'&#124;'GE-3'&#124;'GE-4'&#124;'GE-5A'&#124;'GE-5B'&#124;'GE-6'&#124;'GE-7'&#124;'GE-8'\]<br />Example: 'GE-1B' <br/> Default: ' '                                                                                                                                                                                   | Must specify at least one of department, GE, courseCodes, or instructorName                   |
| department       |List of available departments to search available in file depts.txt<br />Example: 'I&C SCI' <br/> Default: ' '                                                                                                                                                                                                                                                   | Must specify at least one of department, GE, courseCodes, or instructorName                   |
| courseNum        |Any valid course number or range<br />Example: '32A' OR '31-33'  <br/> Default: ' '                                                                                                                                                                                                                                                                              |                                                                                               |
| division         |\['ALL'&#124;'LowerDiv'&#124;'UpperDiv'&#124;'Graduate'\]<br />Example: 'LowerDiv' <br/> Default: 'ALL'                                                                                                                                                                                                                                                          |                                                                                               |
| courseCodes      |Any valid 5-digit course code or range<br />Example: "36531" OR "36520-36536" <br/> Default: ' '                                                                                                                                                                                                                                                                 | Must specify at least one of department, GE, courseCodes, or instructorName                   |
| instructorName   |Any valid instructor last name or part of last name<br />Example: 'Thornton' <br/> Default: ' '                                                                                                                                                                                                                                                                  | Enter last name only                                                                          |
| courseTitle      |Any text<br />Example: 'Intro' <br/> Default: ' '                                                                                                                                                                                                                                                                                                                |                                                                                               |
| classType        |\['ALL'&#124;'ACT'&#124;'COL'&#124;'DIS'&#124;'FLD'&#124;'LAB'&#124;'LEC'&#124;'QIZ'&#124;'RES'&#124;'SEM'&#124;'STU'&#124;'TAP'&#124;'TUT'\]<br />Example: 'LAB'  <br/> Default: 'ALL'                                                                                                                                                                          |                                                                                               |
| units            |Any integer or decimal with only tenths place precision, or 'VAR' to look for variable unit classes only.<br />Example: '5' OR '1.3' <br/> Default: ' '                                                                                                                                                                                                          |                                                                                               |
| days             |\['M'&#124;'T'&#124;'W'&#124;'Th'&#124;'F'\] or a combination of these days<br />Example: 'T' OR 'MWF' <br/> Default: ' '                                                                                                                                                                                                                                        |                                                                                               |
| startTime        |Any time in 12 hour format<br />Example: '10:00AM' OR '5:00PM' <br/> Default: ' '                                                                                                                                                                                                                                                                                | Only enter sharp hours                                                                        |
| endTime          |Any time in 12 hour format<br />Example: '12:00AM' OR '6:00PM' <br/> Default: ' '                                                                                                                                                                                                                                                                                | Only enter sharp hours                                                                        |
| maxCap           |Exact number like '300' or modified with '<' or '>' to indicate less than specified or greater than specified.<br />Example: '>256' OR '19' OR '<19' <br/> Default: ' '                                                                                                                                                                                          |                                                                                               |
| fullCourses      |\['ANY'&#124;'SkipFullWaitlist'&#124;'FullOnly'&#124;'OverEnrolled'\] <br />'SkipFullWaitlist' means that full courses will be included if there's space on the wait-list <br />'FullOnly' means only full courses will be retrieved <br />'OverEnrolled' means only over-enrolled courses will be retrieved<br />Example:'SkipFullWaitlist' <br/> Default: 'ANY'|                                                                                               |
| cancelledCourses |\['Exclude'&#124;'Include'&#124;'Only'\]<br />Example: 'Include' <br/> Default: 'EXCLUDE'                                                                                                                                                                                                                                                                        |                                                                                               |
| building         |Any valid building code<br />Example: 'DBH' <br/> Default: ' '                                                                                                                                                                                                                                                                                                   | The value is a building code. Building codes found here: https://www.reg.uci.edu/addl/campus/ |
| room             |Any valid room number<br />Example: '223' <br/> Default: ' '                                                                                                                                                                                                                                                                                                     | You must specify a building code if you specify a room number                                 |
##### callback(result)
Callback is a callback function that is called when the class data retrieval is finished. It passes in result, which is an array of `School` objects.

#### Usage
```javascript
// Import the module
const WebSocAPI = require('./websocapi.js');

//Specify our search parameters
const opts = {
    term: '2017 Fall',
    GE: 'GE-2',
    instructorName: 'Pattis'
}

// Call the module, and when it is done, print out every school's name
WebSocAPI.callWebSocAPI(opts, function(result) {
    for (let i = 0; i < result.length; i++) {
        console.log(result[i].name);
    }
})
```

### Using retrieved data
The API serves its data in a hierarchical manner.
As shown above, the results are served to the callback in an array of schools. Each `school` in the array contains `department`s, which contains `course`s, which contain `section`s.

#### School
| Field       | Type                        | Notes                                                                                                       |
|-------------|-----------------------------|-------------------------------------------------------------------------------------------------------------|
| name        | string                      | The name of the school like 'Donald Bren School of Information and Computer Science'                        |
| comment     | string                      |                                                                                                             |
| departments | array of Department objects |                                                                                                             |
| toString    | function                    | Returns a JSON string representation of the object                                                          |

#### Department
| Field    | Type                    | Notes                                                                                                                                                        |
|----------|-------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| name     | array                   | The array has two indices. Index 0: The code of the department like 'IN4MATX'. Index 1: The name of the department like 'Informatics'.                       |
| comments | array                   | Comments that the department put on WebSoc. Index 0: The department comment. Rest of indices are course number range comments and course code range comments.|
| courses  | array of Course objects |                                                                                                                                                              |
| toString | function                | Returns a JSON string representation of the object                                                                                                           |

#### Course
| Field            | Type                     | Notes                                                                                                                                                |
|------------------|--------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| name             | array                    | The array has three indices. Index 0: Dept code, like 'I&C SCI'. Index 1: Course number, like '33'. Index 2: Course name, like 'INTERMEDIATE PRGRMG'.|
| comment          | string                   |                                                                                                                                                      |
| prerequisiteLink | string                   | Link to the registrar's page where prerequistes are listed                                                                                           |
| sections         | array of Section objects |                                                                                                                                                      |
| toString         | function                 | Returns a JSON string representation of the object                                                                                                   |

#### Section
| Field                | Type                  | Notes                                                                                                                                                              |
|----------------------|-----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| classCode            | string                |                                                                                                                                                                    |
| classType            | string                |                                                                                                                                                                    |
| sectionCode          | string                |                                                                                                                                                                    |
| units                | string                |                                                                                                                                                                    |
| instructors          | array                 | Each instructor listed will have their own index.                                                                                                                  |
| meetings             | two-dimensional array | The array contains arrays which have two indices. Index 0: Meeting time, like 'MWF 9:00- 9:50'. Index 1: Meeting building, like 'ICS 174'.                         |
| finalExamDate        | string                |                                                                                                                                                                    |
| maxCapacity          | string                |                                                                                                                                                                    |
| numCurrentlyEnrolled | array                 | The array has two indices. Index 0: Joint (total) enrollment. Index 1: This section's enrollment. If the class is not cross-listed, the two values will be the same|
| numOnWaitlist        | string                |                                                                                                                                                                    |
| numRequested         | string                |                                                                                                                                                                    |
| numNewOnlyReserved   | string                |                                                                                                                                                                    |
| restrictions         | string                | The restriction code definitions can be found [here](https://www.reg.uci.edu/enrollment/restrict_codes.html)                                                       |
| status               | string                |                                                                                                                                                                    |
| comment              | string                |                                                                                                                                                                    |
| toString             | function              | Returns a JSON string representation of the object                                                                                                                 |