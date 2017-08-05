const classes = require("./classes.js");
const now = require("performance-now");
const request = require("request");
const cheerio = require("cheerio");


function postToWebSoc({   term, breadth = 'ANY', department = 'ALL', courseNum = '', division = 'ANY', courseCodes = '',
                          instructorName = '', courseTitle = '', classType = 'ALL', units = '', days = '',
                          startTime = '', endTime = '', maxCap = '', fullCourses = 'ANY', cancelledCourses = 'EXCLUDE',
                          building = '', room = ''
                      }, callback) {

    if (term === undefined) {
        throw "Define the term"
    } else if (department === "ALL" && breadth === "ANY" && courseCodes === '' && instructorName === '') {
        throw "Define at least one of department, breadth, courseCodes, or instructorName";
    }

    let postData = {
        url: "https://www.reg.uci.edu/perl/WebSoc",
        form: {
            Submit: 'Display Web Results',
            YearTerm: term,
            ShowComments: 'on',
            ShowFinals: 'on',
            Breadth: breadth,
            Dept: department,
            CourseNum: courseNum,
            Division: division,
            CourseCodes: courseCodes,
            InstrName: instructorName,
            CourseTitle: courseTitle,
            ClassType: classType,
            Units: units,
            Days: days,
            StartTime: startTime,
            EndTime: endTime,
            MaxCap: maxCap,
            FullCourses: fullCourses,
            CancelledCourses: cancelledCourses,
            Bldg: building,
            Room: room,
        }
    };

    request.post(postData, (err, res, body) => {
        callback(parseForClasses(body));
    });
}

function parseForClasses(htmlBody) {
    let $ = cheerio.load(htmlBody);
    let root = $('.course-list > table:nth-child(1) > tbody:nth-child(1)');

    let schools = [];

    root.find('tr').each(
        function () {
            let lastSchool;
            let lastDept;
            let lastCourse;

            if ($(this).hasClass("college-title")) {
                schools.push(new classes.School($(this).children('td').text()));
                lastSchool = getLast(schools);
                lastSchool.addComment($(this).next().hasClass("college-comment") ? $(this).next().text() : '');
            } else if ($(this).hasClass("dept-title")) {
                lastSchool = getLast(schools);
                lastSchool.addDepartment(new classes.Department($(this).children('td').text()));
                lastDept = getLast(lastSchool.departments);
                lastDept.addComment($(this).next().hasClass("dept-comment") ? $(this).next().text() : '');
            } else if ($(this).hasClass("num-range-comment")) {
                lastSchool = getLast(schools);
                lastDept = getLast(lastSchool.departments);
                lastDept.addComment($(this).text());
            } else if ($(this).children("td").hasClass("CourseTitle")) {
                lastSchool = getLast(schools);
                lastDept = getLast(lastSchool.departments);
                lastDept.addCourse(new classes.Course($(this).children(".CourseTitle").text())); //Too many spaces, additional (Prerequisites) text
                lastCourse = getLast(lastDept.courses);
                lastCourse.addComment($(this).next().children().find(".Comments").text());
            } else if ($(this).is("tr[valign='top'][bgcolor='#FFFFCC']") || $(this).is("tr[valign='top']")) {
                let sectionData = {};
                let str = '';

                $(this).find('td').each(function (i) {
                    switch (i) {
                        case 0:
                            sectionData.classCode = $(this).text();
                            str += sectionData.classCode + "  ";
                            break;
                        case 1:
                            sectionData.classType = $(this).text();
                            str += sectionData.classType + "  ";
                            break;
                        case 2:
                            sectionData.sectionCode = $(this).text();
                            str += sectionData.sectionCode + "  ";
                            break;
                        case 3:
                            sectionData.units = $(this).text();
                            str += sectionData.units + "  ";
                            break;
                        case 4:
                            sectionData.instructors = $(this).html().split("<br>");
                            str += sectionData.instructors + "  ";
                            // TODO: Remove blank instructors from array
                            break;
                        case 5:
                            sectionData.times = $(this).html().split("<br>");
                            str += sectionData.times + "  ";
                            break;
                        //TODO: https://stackoverflow.com/questions/12482961/is-it-possible-to-change-values-of-the-array-when-doing-foreach-in-javascript
                        case 6:
                            $(this).find('a').each(function (j, elem) {
                                $(this).replaceWith($(this).text());
                            });
                            sectionData.places = $(this).html().split("<br>");
                            str += sectionData.places + "  ";
                            break;
                        case 7:
                            sectionData.finalExamDate = $(this).text();
                            str += sectionData.finalExamDate + "  ";
                            //TODO: Replace blank final dates with NONE
                            break;
                        case 8:
                            sectionData.maxCapacity = $(this).text();
                            str += sectionData.maxCapacity + "  ";
                            break;
                        case 9:
                            sectionData.numCurrentlyEnrolled = $(this).text();
                            str += sectionData.numCurrentlyEnrolled + "  ";
                            break;
                        case 10:
                            sectionData.numOnWaitlist = $(this).text();
                            str += sectionData.numOnWaitlist + "  ";
                            break;
                        case 11:
                            sectionData.numRequested = $(this).text();
                            str += sectionData.numRequested + "  ";
                            break;
                        case 12:
                            sectionData.numNewOnlyReserved = $(this).text();
                            str += sectionData.numNewOnlyReserved + "  ";
                            break;
                        case 13:
                            sectionData.restrictions = $(this).text();
                            str += sectionData.restrictions + "  ";
                            //TODO: Turn this to array.
                            break;
                        case 16:
                            sectionData.status = $(this).text();
                            str += sectionData.status + "  ";
                            break;
                        default:
                            break;
                    }
                });

                lastSchool = getLast(schools);
                lastDept = getLast(lastSchool.departments);
                lastCourse = getLast(lastDept.courses);
                lastCourse.sections.push(new classes.Section(sectionData));

                if ($(this).next().is("tr") && $(this).next().prop("valign") === undefined && !$(this).next().hasClass("blue-bar")) {
                    getLast(lastCourse.sections).addComment($(this).next().text());
                }
            }
        });

    return schools;
}

function getLast(array) {
    return array[array.length - 1];
}

let t0 = now();
postToWebSoc({term: "2017-92", department: "BIO SCI"}, (result) => {//console.log(result)
let t1 = now();
console.log((t1 - t0).toFixed(3));
});