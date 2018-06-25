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

    let codedTerm = getCodedTerm(term.toLowerCase());
    let codedDiv = getCodedDiv(division.toLowerCase());

    const postData = {
        url: "https://www.reg.uci.edu/perl/WebSoc",
        form: {
            Submit: 'Display Web Results',
            YearTerm: codedTerm,
            ShowComments: 'on',
            ShowFinals: 'on',
            Breadth: GE,
            Dept: department,
            CourseNum: courseNum,
            Division: codedDiv,
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
            callback(parse(body));
        } else {
            console.error(err);
        }
    });
}

function getCodedTerm(term) {
    let actualTerm = '';

    if (term.includes('fall')) {
        actualTerm = term.slice(0, 4) + '-92';
    } else if (term.includes('winter')) {
        actualTerm = term.slice(0, 4) + '-03';
    } else if (term.includes('spring')) {
        actualTerm = term.slice(0, 4) + '-14';
    } else if (term.includes('summer1')) {
        actualTerm = term.slice(0, 4) + '-25';
    } else if (term.includes('summer2')) {
        actualTerm = term.slice(0, 4) + '-76';
    } else if (term.includes('summer10wk')) {
        actualTerm = term.slice(0, 4) + '-39';
    }

    return actualTerm
}

function getCodedDiv(div) {
    let codedDiv = div.toLowerCase();

    if (codedDiv === 'all') {
        codedDiv = 'all';
    } else if (codedDiv === 'lowerdiv') {
        codedDiv = '0xx';
    } else if (codedDiv === 'upperdiv') {
        codedDiv = '1xx';
    } else if (codedDiv === 'graduate') {
        codedDiv = '2xx';
    }

    return codedDiv
}

function parse(htmlBody) {
    const $ = cheerio.load(htmlBody);
    const root = $('.course-list');

    const schools = [];

    let lastSchool;
    let row;
    let lastDept;
    let lastCourse;
    let numCols;

    root.find('table').find('tbody').find('tr').each(
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
                let courseName = [sanitize(row.text()), row.find('b').text()];
                let newCourse = new classes.Course(courseName);
                lastDept.addCourse(newCourse);
                newCourse.addComment(sanitize(row.next().find('.Comments').text()));
                lastCourse = newCourse;
            } else if (row.is("tr[bgcolor='#E7E7E7'][align='left']")) {
                numCols = row.children().length;
            } else if (row.is("tr[valign='top'][bgcolor='#FFFFCC']") || row.is("tr[valign='top']")) {
                let newSection = new classes.Section(buildSectionData($, row, numCols));
                lastCourse.sections.push(newSection);

                if (row.next().attr() !== undefined) {
                    let attrs = Object.keys(row.next().attr());
                    if (attrs.length === 0 || (attrs.length === 1 && row.next().attr('bgcolor') === '#FFFFCC')) {
                        newSection.addComment(sanitize(row.next().text()));
                    }
                }
            }
        });

    return schools;
}

function buildSectionData(jquery, row, columnCount) {
    let sectionData = {};

    row.find('td').each(function (i) {
        let cell = jquery(this);
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
                    jquery(this).replaceWith(jquery(this).text());
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
            default:
                break;
        }

        if (columnCount === 17) {
            switch (i) {
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
                    sectionData.restrictions = cellText;
                    break;
                case 16:
                    sectionData.status = cellText;
                    break;
                default:
                    break;
            }
        } else if (columnCount === 16) {
            sectionData.numNewOnlyReserved = 0;
            switch (i) {
                case 10:
                    sectionData.numOnWaitlist = cellText;
                    break;
                case 11:
                    sectionData.numRequested = cellText;
                    break;
                case 12:
                    sectionData.restrictions = cellText;
                    break;
                case 15:
                    sectionData.status = cellText;
                    break;
                default:
                    break;
            }
        } else if (columnCount === 15) {
            sectionData.numOnWaitlist = 0;
            sectionData.numNewOnlyReserved = 0;
            switch (i) {
                case 10:
                    sectionData.numRequested = cellText;
                    break;
                case 11:
                    sectionData.restrictions = cellText;
                    break;
                case 14:
                    sectionData.status = cellText;
                    break;
                default:
                    break;
            }
        }
    });
    return sectionData;
}

function sanitize(input) {
    let sanitizedString = input;
    if (typeof input === 'object') {
        sanitizedString = input[0].replace(new RegExp(escapeRegExp(input[1]) + '|\\(Co-courses\\)|\\(Prerequisites\\)', 'g'), '');
    } //TODO: Find a better solution for this
    sanitizedString = sanitizedString.replace(/\t+|&#xA0|;/g, '');
    sanitizedString = sanitizedString.replace(/[^\S\r\n]+/g, ' ');
    sanitizedString = sanitizedString.replace(/- /, '-');
    sanitizedString = sanitizedString.trim();
    sanitizedString = sanitizedString.replace(/\n \n /g, '\n');
    return sanitizedString;
}

function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

module.exports.callWebSocAPI = callWebSocAPI;
module.exports.parseForClasses = parse;