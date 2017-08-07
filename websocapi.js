'use strict';

const classes = require("./classes.js");
const request = require("request");
const cheerio = require("cheerio");

function postToWebSoc({
                          term, breadth = 'ANY', department = 'ALL', courseNum = '', division = 'ANY', courseCodes = '',
                          instructorName = '', courseTitle = '', classType = 'ALL', units = '', days = '',
                          startTime = '', endTime = '', maxCap = '', fullCourses = 'ANY', cancelledCourses = 'EXCLUDE',
                          building = '', room = ''
                      },  callback) {

    if (term === undefined || term === '') {
        throw new Error("Define the term");
    } else if (department === "ALL" && breadth === "ANY" && courseCodes === '' && instructorName === '') {
        throw new Error("Define at least one of department, breadth, courseCodes, or instructorName");
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
        },
    };

    request.post(postData, (err, res, body) => {
        if (!err && res.statusCode === 200) {
            callback(parseForClasses(body));
        } else {
            console.err(err);
        }
    });
}

function parseForClasses(htmlBody) {
    let $ = cheerio.load(htmlBody);
    let root = $('.course-list > table:nth-child(1) > tbody:nth-child(1)');

    let schools = [];

    root.find('tr').each(
        function () {
            let row = $(this);
            let lastSchool;
            let lastDept;
            let lastCourse;

            if (row.hasClass("college-title")) {
                schools.push(new classes.School(row.children('td').text()));
                lastSchool = getLast(schools);
                lastSchool.addComment(row.next().hasClass("college-comment") ? row.next().text() : '');
            } else if (row.hasClass("dept-title")) {
                lastSchool = getLast(schools);
                lastSchool.addDepartment(new classes.Department(row.children('td').text()));
                lastDept = getLast(lastSchool.departments);
                lastDept.addComment(row.next().hasClass("dept-comment") ? row.next().text() : '');
            } else if (row.hasClass("num-range-comment")) {
                lastSchool = getLast(schools);
                lastDept = getLast(lastSchool.departments);
                lastDept.addComment(row.text());
            } else if (row.is("tr[valign='top'][bgcolor='#fff0ff']")) {
                lastSchool = getLast(schools);
                lastDept = getLast(lastSchool.departments);
                let courseName = row.children().text();
                courseName = courseName.replace(/\s+/g, ' ').replace('(Prerequisites)', '').trim();
                lastDept.addCourse(new classes.Course(courseName));
                lastCourse = getLast(lastDept.courses);
                lastCourse.addComment(row.next().children().find(".Comments").text());
            } else if (row.is("tr[valign='top'][bgcolor='#FFFFCC']") || row.is("tr[valign='top']")) {
                let sectionData = {};
                let str = '';
                row.find('td').each(function (i) {
                    let cell = $(this);
                    let cellText = cell.text();
                    switch (i) {
                        case 0:
                            sectionData.classCode = cellText;
                            break;
                        case 1:
                            sectionData.classType = cellText;
                            break;
                        case 2:
                            sectionData.sectionCode = cellText;
                            break;
                        case 3:
                            sectionData.units = cellText;
                            break;
                        case 4:
                            sectionData.instructors = cell.html().split("<br>");
                            if (getLast(sectionData.instructors) === '') {
                                sectionData.instructors.pop();
                            }
                            break;
                        case 5:
                            sectionData.times = cell.html().split("<br>");
                            if (sectionData.times) {
                            }
                            sectionData.times.forEach(function (currentValue, index, array) {
                                array[index] = array[index].replace('&#xA0;', '');
                                array[index] = array[index].replace('- ', '-');
                                if (array[index].includes('TBA')) {
                                    array[index] = 'TBA'
                                }
                            });
                            break;
                        case 6:
                            cell.find('a').each(function (j, elem) {
                                $(this).replaceWith($(this).text());
                            });
                            sectionData.places = cell.html().split("<br>");
                            break;
                        case 7:
                            sectionData.finalExamDate = cellText.trim();
                            if (sectionData.finalExamDate.length === 0) {
                                sectionData.finalExamDate = 'NONE';
                            }
                            break;
                        case 8:
                            sectionData.maxCapacity = cellText;
                            break;
                        case 9:
                            sectionData.numCurrentlyEnrolled = cellText;
                            break;
                        case 10:
                            sectionData.numOnWaitlist = cellText;
                            break;
                        case 11:
                            sectionData.numRequested = cellText;
                            break;
                        case 12:
                            sectionData.numNewOnlyReserved = cellText;
                            break;
                        case 13:
                            sectionData.restrictions = cellText.split('and');
                            //TODO: Find out what 'or' means with restrictions
                            break;
                        case 16:
                            sectionData.status = cellText;
                            break;
                        default:
                            break;
                    }
                });
                lastSchool = getLast(schools);
                lastDept = getLast(lastSchool.departments);
                lastCourse = getLast(lastDept.courses);
                lastCourse.sections.push(new classes.Section(sectionData));
                if (!row.next().hasClass("blue-bar") && row.next().prop("valign") === undefined) {
                    getLast(lastCourse.sections).addComment(row.next().text());
                }
            }

        });
    return schools;
}

function getLast(array) {
    return array[array.length - 1];
}

postToWebSoc({term: "2017-92", department: "BIO SCI"}, (result) => {
    //console.log(result)
});