'use strict';

const classes = require("./classes.js");
const request = require("request");
const cheerio = require("cheerio");

function callWebSocAPI({
                          term, GE = 'ANY', department = 'ALL', courseNum = '', division = 'ANY', courseCodes = '',
                          instructorName = '', courseTitle = '', classType = 'ALL', units = '', days = '',
                          startTime = '', endTime = '', maxCap = '', fullCourses = 'ANY', cancelledCourses = 'EXCLUDE',
                          building = '', room = ''
                      }, callback) {

    if (term === undefined || term === '') {
        throw new Error("Define the term");
    } else if (department === "ALL" && GE === "ANY" && courseCodes === '' && instructorName === '') {
        throw new Error("Define at least one of department, GE, courseCodes, or instructorName");
    } else if (building === '' && room !== '') {
        throw new Error("You must specify a building code if you specify a room number")
    }

    const lowerCaseTerm = term.toLowerCase();
    if (lowerCaseTerm.includes('fall')) {
        term = lowerCaseTerm.slice(0, 4) + '-92';
    } else if (lowerCaseTerm.includes('winter')) {
        term = lowerCaseTerm.slice(0, 4) + '-03';
    } else if (lowerCaseTerm.includes('spring')) {
        term = lowerCaseTerm.slice(0, 4) + '-14';
    } else if (lowerCaseTerm.includes('summer1')) {
        term = lowerCaseTerm.slice(0, 4) + '-25';
    } else if (lowerCaseTerm.includes('summer2')) {
        term = lowerCaseTerm.slice(0, 4) + '-76';
    } else if (lowerCaseTerm.includes('summer10wk')) {
        term = lowerCaseTerm.slice(0, 4) + '-39';
    }

    const lowerCaseDiv = division.toLowerCase();
    if (lowerCaseDiv === 'all') {
        division = 'all'
    } else if (lowerCaseDiv === 'lowerdiv') {
        division = '0xx';
    } else if (lowerCaseDiv === 'upperdiv') {
        division = '1xx';
    } else if (lowerCaseDiv === 'graduate') {
        division = '2xx';
    }

    let postData = {
        url: "https://www.reg.uci.edu/perl/WebSoc",
        form: {
            Submit: 'Display Web Results',
            YearTerm: term,
            ShowComments: 'on',
            ShowFinals: 'on',
            Breadth: GE,
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

    console.time('total');
    request.post(postData, (err, res, body) => {
        if (!err && res.statusCode === 200) {
            callback(parseForClasses(body));
            console.timeEnd('total');
        } else {
            console.err(err);
        }
    });
}

function parseForClasses(htmlBody) {
    const $ = cheerio.load(htmlBody);
    const root = $('.course-list > table:nth-child(1) > tbody:nth-child(1)');

    const schools = [];

    let lastSchool;
    let row;
    let lastDept;
    let lastCourse;

    root.find('tr').each(
        function () {
            row = $(this);
            if (row.hasClass("college-title")) {
                let newSchool = new classes.School(row.children().text());
                newSchool.addComment(row.next().hasClass("college-comment") ? sanitize(row.next().text()) : '');
                lastSchool = newSchool;
                schools.push(newSchool);
            } else if (row.hasClass("dept-title")) {
                let newDept = new classes.Department(row.text());
                newDept.addComment(row.next().hasClass("dept-comment") ? sanitize(row.next().text()) : '');
                lastSchool.addDepartment(newDept);
                lastDept = newDept;
            } else if (row.hasClass("num-range-comment") || row.hasClass("ccode-range-comment")) {
                if (lastDept.comments === '') {
                    lastDept.addComment(sanitize(row.text()));
                } else {
                    lastDept.addComment('\n\n' + sanitize(row.text()));
                }
            } else if (row.is("tr[valign='top'][bgcolor='#fff0ff']")) {
                let courseName = [row.text(), row.find('b').text()];
                courseName[0] = sanitize(courseName);
                let newCourse = new classes.Course(courseName);
                lastDept.addCourse(newCourse);
                newCourse.addComment(sanitize(row.next().find('.Comments').text()));
                lastCourse = newCourse;
            } else if (row.is("tr[valign='top'][bgcolor='#FFFFCC']") || row.is("tr[valign='top']")) {
                let sectionData = {};

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
                            if (sectionData.instructors.slice(-1)[0] === '') {
                                sectionData.instructors.pop();
                            }
                            break;
                        case 5:
                            sectionData.times = cell.html().split("<br>");
                            sectionData.times.forEach(function (currentValue, index, array) {
                                if (currentValue.includes('TBA')) {
                                    array[index] = 'TBA';
                                } else {
                                    array[index] = sanitize(currentValue);
                                }
                            });
                            break;
                        case 6:
                            cell.find('a').each(function () {
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
                            sectionData.restrictions.forEach(function (currentValue, index, array) {
                                array[index] = sanitize(currentValue);
                            });
                            //TODO: Find out what 'or' means with restrictions
                            break;
                        case 16:
                            sectionData.status = cellText;
                            break;
                        default:
                            break;
                    }
                });

                let newSection = new classes.Section(sectionData);
                lastCourse.sections.push(newSection);
                let attrs = Object.keys(row.next().attr());
                if (attrs.length === 0 || (attrs.length === 1 && row.next().attr('bgcolor') === '#FFFFCC')) {
                    newSection.addComment(sanitize(row.next().text()));
                }
            }
        });

    return schools;
}

function sanitize(input) {
    let sanitizedString = input;
    if (typeof input === 'object') {
        sanitizedString = input[0].replace(new RegExp(input[1] + '|\\(Co-courses\\)|\\(Prerequisites\\)', 'g'), '');
    }
    sanitizedString = sanitizedString.replace(/\t+|&#xA0|;/g, '');
    sanitizedString = sanitizedString.replace(/[^\S\r\n]+/g, ' ');
    sanitizedString = sanitizedString.replace(/- /, '-');
    sanitizedString = sanitizedString.trim();
    sanitizedString = sanitizedString.replace(/\n \n /g, '\n');
    return sanitizedString;
}

//TODO: fix regex bug
callWebSocAPI({term: "2017 Fall", department: "BIO SCI"}, (result) => {
    result.forEach(function callback(school) {
        // console.log(school.toString());
        school.departments.forEach(function callback(dept) {
            console.log(dept.toString());
            dept.courses.forEach(function callback(course) {
                // console.log(course.toString())
            })
        });
    });
});

module.exports.callWebSocAPI = callWebSocAPI;