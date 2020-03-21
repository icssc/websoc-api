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
| ge               |\['ANY'&#124;'GE-1A'&#124;'GE-1B'&#124;'GE-2'&#124;'GE-3'&#124;'GE-4'&#124;'GE-5A'&#124;'GE-5B'&#124;'GE-6'&#124;'GE-7'&#124;'GE-8'\]<br />Example: 'GE-1B' <br/> Default: ' '                                                                                                                                                                                   | Must specify at least one of department, GE, courseCodes, or instructorName                   |
| department       |List of available departments to search available in file depts.txt<br />Example: 'I&C SCI' <br/> Default: ' '                                                                                                                                                                                                                                                   | Must specify at least one of department, GE, courseCodes, or instructorName                   |
| courseNumber        |Any valid course number or range<br />Example: '32A' OR '31-33'  <br/> Default: ' '                                                                                                                                                                                                                                                                              |                                                                                               |
| division         |\['ALL'&#124;'LowerDiv'&#124;'UpperDiv'&#124;'Graduate'\]<br />Example: 'LowerDiv' <br/> Default: 'ALL'                                                                                                                                                                                                                                                          |                                                                                               |
| sectionCodes      |Any valid 5-digit course code or range<br />Example: "36531" OR "36520-36536" <br/> Default: ' '                                                                                                                                                                                                                                                                 | Must specify at least one of department, GE, courseCodes, or instructorName                   |
| instructorName   |Any valid instructor last name or part of last name<br />Example: 'Thornton' <br/> Default: ' '                                                                                                                                                                                                                                                                  | Enter last name only                                                                          |
| courseTitle      |Any text<br />Example: 'Intro' <br/> Default: ' '                                                                                                                                                                                                                                                                                                                |                                                                                               |
| sectionType        |\['ALL'&#124;'ACT'&#124;'COL'&#124;'DIS'&#124;'FLD'&#124;'LAB'&#124;'LEC'&#124;'QIZ'&#124;'RES'&#124;'SEM'&#124;'STU'&#124;'TAP'&#124;'TUT'\]<br />Example: 'LAB'  <br/> Default: 'ALL'                                                                                                                                                                          |                                                                                               |
| units            |Any integer or decimal with only tenths place precision, or 'VAR' to look for variable unit classes only.<br />Example: '5' OR '1.3' <br/> Default: ' '                                                                                                                                                                                                          |                                                                                               |
| days             |\['M'&#124;'T'&#124;'W'&#124;'Th'&#124;'F'\] or a combination of these days<br />Example: 'T' OR 'MWF' <br/> Default: ' '                                                                                                                                                                                                                                        |                                                                                               |
| startTime        |Any time in 12 hour format<br />Example: '10:00AM' OR '5:00PM' <br/> Default: ' '                                                                                                                                                                                                                                                                                | Only enter sharp hours                                                                        |
| endTime          |Any time in 12 hour format<br />Example: '12:00AM' OR '6:00PM' <br/> Default: ' '                                                                                                                                                                                                                                                                                | Only enter sharp hours                                                                        |
| maxCapacity           |Exact number like '300' or modified with '<' or '>' to indicate less than specified or greater than specified.<br />Example: '>256' OR '19' OR '<19' <br/> Default: ' '                                                                                                                                                                                          |                                                                                               |
| fullCourses      |\['ANY'&#124;'SkipFullWaitlist'&#124;'FullOnly'&#124;'OverEnrolled'\] <br />'SkipFullWaitlist' means that full courses will be included if there's space on the wait-list <br />'FullOnly' means only full courses will be retrieved <br />'OverEnrolled' means only over-enrolled courses will be retrieved<br />Example:'SkipFullWaitlist' <br/> Default: 'ANY'|                                                                                               |
| cancelledCourses |\['Exclude'&#124;'Include'&#124;'Only'\]<br />Example: 'Include' <br/> Default: 'EXCLUDE'                                                                                                                                                                                                                                                                        |                                                                                               |
| building         |Any valid building code<br />Example: 'DBH' <br/> Default: ' '                                                                                                                                                                                                                                                                                                   | The value is a building code. Building codes found here: https://www.reg.uci.edu/addl/campus/ |
| room             |Any valid room number<br />Example: '223' <br/> Default: ' '                                                                                                                                                                                                                                                                                                     | You must specify a building code if you specify a room number                                 |

#### Usage
```javascript
// Import the module
const WebSocAPI = require('./websoc-api');

//Specify our search parameters
const opts = {
    term: '2019 Fall',
    GE: 'GE-2',
    instructorName: 'Pattis'
}

// Call the module, and when the promise resolves, print out the JSON returned
const result = WebSocAPI.callWebSocAPI(opts);
result.then((json) => console.log(JSON.stringify(json)));

```

### Using retrieved data
The API serves its data in a hierarchical manner. The top level object is `schools`.
Each `school` in the array contains `departments`, which contains `courses`, which contain `sections`.

#### School
| Field       | Type                        | Notes                                                                                                       |
|-------------|-----------------------------|-------------------------------------------------------------------------------------------------------------|
| schoolName        | string                      | The name of the school like 'Donald Bren School of Information and Computer Science'                        |
| schoolComment     | string                      |                                                 |
| departments | array of Department objects |                                                                |

#### Department
| Field    | Type                    | Notes                                                                                                                                                        |
|----------|-------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| deptName     | string                   | The name of the department like 'Informatics'.                       |
| deptCode     | string                   | The code of the department like 'IN4MATX'.                       |
| deptComment | string                   | Comments that the department put on WebSoc. |
| courses  | array of Course objects |                                  |
| sectionCodeRangeComments | array                | Comments associated with a range of sections.                               |
| courseNumberRangeComments | array                | Comments associated with a range of courses.                               |

#### Course
| Field            | Type                     | Notes                                                                                                                                                |
|------------------|--------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| courseNumber            | string       | Course number, like '33'.|
| courseTitle             | string       | Course title, like 'INTERMEDIATE PRGRMG'.|
| courseComment           | string       |                                        |
| prerequisiteLink | string              | Link to the registrar's page where prerequistes are listed |
| sections         | array of Section objects |                                    |

#### Section
| Field                | Type                  | Notes                                                                                                                                                              |
|----------------------|-----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| sectionCode            | string                |                                                                                                                                                                    |
| sectionType            | string                |                                                                                                                                                                    |
| sectionNum          | string                |                                                                                                                                                                    |
| units                | string                |                                                                                                                                                                    |
| instructors          | array                 |                                                                                |
| meetings             | array of objects with fields "days", "time" and "bldg" | If the meeting is "TBA", the field "days" will be "TBA" and the others will be empty strings.                         |
| finalExam        | string                |                                                                                                                                                                    |
| maxCapacity          | string                |                                                                                                                                                                    |
| numCurrentlyEnrolled | object with fields "totalEnrolled" and "sectionEnrolled"                 | When a course is crosslisted, it will have both fields filled, otherwise, "sectionEnrolled" will be an empty string. |
| numOnWaitlist        | string                |                                                                                                                                                                    |
| numRequested         | string                |                                                                                                                                                                    |
| numNewOnlyReserved   | string                |                                                                                                                                                                    |
| restrictions         | string                | The restriction code definitions can be found [here](https://www.reg.uci.edu/enrollment/restrict_codes.html)                                                       |
| status               | string                |                                                                                                                                                                    |
| sectionComment              | string                |                                                                                                                                                                    |