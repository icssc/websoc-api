## Introduction
A nodejs module to access listings from UCI's schedule of classes, [WebSoc](https://www.reg.uci.edu/perl/WebSoc).
This API allows access to school, department, course, and section data in a hierarchical JSON format.
## Installation
`$ npm install websoc-api`

## Documentation
### Retrieving class listings
#### callWebSocAPI(options, callback(result)) {
To retrieve class listings, you just call this function `callWebSocAPI` and pass in two parameters. The first parameter, options, is an object-literal
that configures what you're looking for, such as department, term, division etc. The second parameter is a callback function
that is called when the function is done retrieving classes.
##### options
| Name             | Description                                                                                                                                | Formatting                                                                                                                                                                                                                                                                                                                                   | Note                                                                                          | Default   |
|------------------|--------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------|-----------|
| term             | The term being searched                                                                                                                    | \[Year\] \['Fall'&#124;'Winter'&#124;'Spring'&#124;'Summer1'&#124;'Summer2'&#124;'Summer10wk'\]<br />Example: '2017 Fall'                                                                                                                                                                                                                    | Required. Schedule for your selected term must be available on WebSoc.                        | None      |
| GE               | Restricts the search to a certain GE category                                                                                              | \['ANY'&#124;'GE-1A'&#124;'GE-1B'&#124;'GE-2'&#124;'GE-3'&#124;'GE-4'&#124;'GE-5A'&#124;'GE-5B'&#124;'GE-6'&#124;'GE-7'&#124;'GE-8'\]<br />Example: 'GE-1B'                                                                                                                                                                                  | Must specify at least one of department, GE, courseCodes, or instructorName                   | None      |
| department       | Restricts the search to a certain department                                                                                               | List of available departments to search available in file depts.txt<br />Example: 'I&C SCI'                                                                                                                                                                                                                                                  | Must specify at least one of department, GE, courseCodes, or instructorName                   | None      |
| courseNum        | Restricts the search to a certain course number or courses in that range                                                                   | Any valid course number or range<br />Example: '32A' OR '31-33'                                                                                                                                                                                                                                                                              |                                                                                               | None      |
| division         | Restrict the search to show lower division, upper division, or graduate courses                                                            | \['ALL'&#124;'LowerDiv'&#124;'UpperDiv'&#124;'Graduate'\]<br />Example: 'LowerDiv'                                                                                                                                                                                                                                                           |                                                                                               | 'ALL'     |
| courseCodes      | Restrict the search to a unique 5-digit section code, or sections in that range of codes                                                   | Any valid 5-digit course code or range<br />Example: "36531" OR "36520-36536"                                                                                                                                                                                                                                                                | Must specify at least one of department, GE, courseCodes, or instructorName                   | None      |
| instructorName   | Restrict the search to courses taught by a certain instructor                                                                              | Any valid instructor last name or part of last name<br />Example: 'Thornton'                                                                                                                                                                                                                                                                 | Enter last name only                                                                          | None      |
| courseTitle      | Search for keywords in the name of the course                                                                                              | Any text<br />Example: 'Intro'                                                                                                                                                                                                                                                                                                               |                                                                                               | None      |
| classType        | Restrict the search to one type of class                                                                                                   | \['ALL'&#124;'ACT'&#124;'COL'&#124;'DIS'&#124;'FLD'&#124;'LAB'&#124;'LEC'&#124;'QIZ'&#124;'RES'&#124;'SEM'&#124;'STU'&#124;'TAP'&#124;'TUT'\]<br />Example: 'LAB'                                                                                                                                                                            |                                                                                               | 'ALL'     |
| units            | Restricts the search to courses that are worth the specified amount of units.                                                              | Any integer or decimal with only tenths place precision, or 'VAR' to look for variable unit classes only.<br />Example: '5' OR '1.3'                                                                                                                                                                                                         |                                                                                               | None      |
| days             | Restricts the search to courses held on the days specified                                                                                 | \['M'&#124;'T'&#124;'W'&#124;'Th'&#124;'F'\] or a combination of these days<br />Example: 'T' OR 'MWF'                                                                                                                                                                                                                                       |                                                                                               | None      |
| startTime        | Restrict the search to courses that start on or after the time specified                                                                   | Any time in 12 hour format<br />Example: '10:00AM' OR '5:00PM'                                                                                                                                                                                                                                                                               | Only enter sharp hours                                                                        | None      |
| endTime          | Restrict the search to courses that end by the time specified                                                                              | Any time in 12 hour format<br />Example: '12:00AM' OR '6:00PM'                                                                                                                                                                                                                                                                               | Only enter sharp hours                                                                        | None      |
| maxCap           | Restricts search to courses that have this enrollment capacity.                                                                            | Exact number like '300' or modified with '<' or '>' to indicate less than specified or greater than specified.<br />Example: '>256' OR '19' OR '<19'                                                                                                                                                                                         |                                                                                               | None      |
| fullCourses      | Specify whether to exclude full courses, show full courses if they have  space on the wait-list, or show only full or wait-listed courses. | \['ANY'&#124;'SkipFullWaitlist'&#124;'FullOnly'&#124;'OverEnrolled'\] <br />'SkipFullWaitlist' means that full courses will be included if there's space on the wait-list <br />'FullOnly' means only full courses will be retrieved <br />'OverEnrolled' means only over-enrolled courses will be retrieved<br />Example:'SkipFullWaitlist' |                                                                                               | 'ANY'     |
| cancelledCourses | Specify whether to exclude full courses, include cancelled courses, or  only show cancelled courses                                        | \['Exclude'&#124;'Include'&#124;'Only'\]<br />Example: 'Include'                                                                                                                                                                                                                                                                             |                                                                                               | 'EXCLUDE' |
| building         | Restrict the search to courses held in a certain building.                                                                                 | Any valid building code<br />Example: 'DBH'                                                                                                                                                                                                                                                                                                  | The value is a building code. Building codes found here: https://www.reg.uci.edu/addl/campus/ | None      |
| room             | Restrict the search to courses held in a certain room.                                                                                     | Any valid room number<br />Example: '223'                                                                                                                                                                                                                                                                                                    | You must specify a building code if you specify a room number                                 | None      |
##### callback(result)
Callback is a callback function that is called when the class data retrieval is finished. It passes in result, which is an array of `School` objects.

#### Usage
```javascript
// Import the module
const WebSocAPI = require('websoc-api');

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
| Field       | Type                        | Notes                                                                                                    |
|-------------|-----------------------------|----------------------------------------------------------------------------------------------------------|
| name        | string                      | The name of the school like 'Donald Bren School of Information and Computer Science'                     |
| comments    | string                      | Comments that the school put on WebSoc. For instance, comments talk about add, drop and change policies. |
| departments | array of department objects |                                                                                                          |
| toString    | function                    | A string representation of the school, listing its name, comments, and departments.                      |

#### Department
| Field    | Type                    | Notes                                                                                               |
|----------|-------------------------|-----------------------------------------------------------------------------------------------------|
| name     | string                  | The name of the department like 'Informatics'                                                       |
| comments | string                  | Comments that the department put on WebSoc. Includes department comments and course range comments. |
| courses  | array of course objects |                                                                                                     |
| toString | function                | A string representation of the school, listing its name, comments, and courses.                     |

#### Course
| Field    | Type                     | Notes                                                                                                                                                 |
|----------|--------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| name     | array                    | The array has two indices. The first one is its dept and number, the second one is its actual name. Example: \['I&C SCI 33', 'INTERMEDIATE PRGRMG'\] |
| comments | string                   |                                                                                                                                                       |
| sections | array of section objects |                                                                                                                                                       |
| toString | function                 | A string representation of the course, listing its name, comments, and sections.                                                                      |

#### Section
| Field                | Type   | Notes                                                                                                                                                       |
|----------------------|--------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| classCode            | string |                                                                                                                                                             |
| classType            | string |                                                                                                                                                             |
| sectionCode          | string |                                                                                                                                                             |
| units                | string |                                                                                                                                                             |
| instructors          | array  | Each instructor listed will have their own index.                                                                                                           |
| times                | array  | Each class time listed will have its own index. Will be ['TBA'] if unknown.                                                                                 |
| places               | array  | Each place listed will have its own index. Will be ['TBA'] if unknown.                                                                                      |
| finalExamDate        | string | Will be 'NONE' if the class has no final exam.                                                                                                              |
| maxCapacity          | string |                                                                                                                                                             |
| numCurrentlyEnrolled | string | Value like '272 / 347' means 'section / joint' enrollment totals for cross-listed courses.                                                                  |
| numOnWaitlist        | string |                                                                                                                                                             |
| numRequested         | string |                                                                                                                                                             |
| numNewOnlyReserved   | string |                                                                                                                                                             |
| restrictions         | array  | Each restriction code has its own index. <br />The restriction code definitions can be found [here](https://www.reg.uci.edu/enrollment/restrict_codes.html) |
| status               | string |                                                                                                                                                             |
| comments             | string |                                                                                                                                                             |