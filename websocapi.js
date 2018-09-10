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

    const postData = {
        url: "https://www.reg.uci.edu/perl/WebSoc",
        form: {
            Submit: 'Display XML Results',
            YearTerm: getCodedTerm(term.toLowerCase()),
            ShowComments: 'on',
            ShowFinals: 'on',
            Breadth: GE,
            Dept: department,
            CourseNum: courseNum,
            Division: getCodedDiv(division.toLowerCase()),
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

function parse(XMLBody) {
    const $ = cheerio.load(XMLBody, {xmlMode: true, normalizeWhitespace: true});
    const root = $('websoc_results > course_list');

    const schools = [];

    root.find('school').each(function () {
        const school = $(this);
        const schoolObj = new classes.School(school.attr("school_name"), $('school_comment', school).text());
        schools.push(schoolObj);

        school.find('department').each(function () {
            const dept = $(this);
            const deptObj = new classes.Department([dept.attr('dept_code'), dept.attr('dept_name')]);
            schoolObj.addDepartment(deptObj);
            dept.find('department_comment').each(function () {
                deptObj.addComment($(this).text());
            });
            dept.find('course_number_range_comment').each(function () {
                deptObj.addComment($(this).text());
            });
            dept.find('course_code_range_comment').each(function () {
                deptObj.addComment($(this).text());
            });

            dept.find('course').each(function () {
                const course = $(this);
                const courseObj = new classes.Course([dept.attr('dept_code'), course.attr('course_number'), course.attr('course_title')], $('course_prereq_link', course).text(), $('course_comment', course).text());
                deptObj.addCourse(courseObj);

                course.find('section').each(function () {
                    const section = $(this);
                    const meetings = [];
                    const sectionData = {
                        classCode: $('course_code', section).text(),
                        classType: $('sec_type', section).text(),
                        sectionCode: $('sec_num', section).text(),
                        units: $('sec_units', section).text(),
                        instructors: $('sec_instructors > instructor', section).map(function () {
                            return $(this).text()
                        }).get(),
                        finalExam: $('sec_final', section).text().trim(),
                        maxCapacity: $('sec_enrollment > sec_max_enroll', section).text(),
                        numCurrentlyEnrolled: [$('sec_enrollment > sec_enrolled', section).text(), $('sec_enrollment > sec_xlist_subenrolled', section).text() === '' ? $('sec_enrollment > sec_enrolled', section).text() : $('sec_enrollment > sec_xlist_subenrolled', section).text()],
                        numOnWaitlist: $('sec_enrollment > sec_waitlist', section).text() === '' ? '0' : $('sec_enrollment > sec_waitlist', section).text(),
                        numRequested: $('sec_enrollment > sec_enroll_requests', section).text(),
                        numNewOnlyReserved: $('sec_enrollment > sec_new_only_reserved', section).text() === $('course_code', section).text() ? '0' : $('sec_enrollment > sec_new_only_reserved', section).text(),
                        restrictions: $('sec_restrictions', section).text(),
                        status: $('sec_status', section).text(),
                        comment: $('sec_comment', section).text()
                    };

                    $('sec_meetings > sec_meet', section).each(function () {
                        meetings.push([$('sec_days', this).text() + $('sec_time', this).text(), $('sec_bldg', this).text() + ' ' + $('sec_room', this).text()]);
                    });
                    sectionData.meetings = meetings;

                    courseObj.addSection(new classes.Section(sectionData));
                });
            });
        });
    });

    return schools;
}

module.exports.callWebSocAPI = callWebSocAPI;
module.exports.parseForClasses = parse;