const transform = require('camaro')
const fetch = require("node-fetch");
const URLSearchParams = require('url').URLSearchParams

const template = {
    schools: ["//school",
        {
            schoolName: "@school_name",
            schoolComment: "//school_comment",
            departments: ["department",
                {
                    deptComment: "department_comment",
                    sectionCodeRangeComments: ["course_code_range_comment", "text()"],
                    courseNumberRangeComments: ["course_number_range_comment", "text()"],
                    deptCode: "@dept_code",
                    deptName: "@dept_name",
                    courses: ["course",
                        {
                            deptCode: "../@dept_code",
                            courseComment: "course_comment",
                            prerequisiteLink: "course_prereq_link",
                            courseNumber: "@course_number",
                            courseTitle: "@course_title",
                            sections: ["section",
                                {
                                    sectionCode: "course_code",
                                    sectionType: "sec_type",
                                    sectionNum: "sec_num",
                                    units: "sec_units",
                                    instructors: ["sec_instructors/instructor", "."],
                                    meetings: ["sec_meetings/sec_meet", {
                                        days: "sec_days",
                                        time: "sec_time",
                                        bldg: "concat(sec_bldg, ' ', sec_room)"
                                    }],
                                    finalExam: "normalize-space(concat(sec_final/sec_final_day, ' ', sec_final/sec_final_date, ' ', sec_final/sec_final_time))",
                                    maxCapacity: "sec_enrollment/sec_max_enroll",
                                    numCurrentlyEnrolled: {totalEnrolled: "sec_enrollment/sec_enrolled", sectionEnrolled: "sec_enrollment/sec_xlist_subenrolled"},
                                    numOnWaitlist: "sec_enrollment/sec_waitlist",
                                    numRequested: "sec_enrollment/sec_enroll_requests",
                                    numNewOnlyReserved: "sec_enrollment/sec_new_only_reserved[text() != ../../course_code]",
                                    restrictions: "sec_restrictions",
                                    status: "sec_status",
                                    sectionComment: "sec_comment"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}

async function callWebSocAPI({
    term, ge = 'ANY', department = 'ALL', courseNumber = '', division = 'ANY', sectionCodes = '',
    instructorName = '', courseTitle = '', sectionType = 'ALL', units = '', days = '',
    startTime = '', endTime = '', maxCapacity = '', fullCourses = 'ANY', cancelledCourses = 'EXCLUDE',
    building = '', room = ''
}) {

    if (term === undefined || term === '') {
        throw new Error("Define the term");
    } else if (department === "ALL" && ge === "ANY" && sectionCodes === '' && instructorName === '') {
        throw new Error("Define at least one of department, GE, courseCodes, or instructorName");
    } else if (building === '' && room !== '') {
        throw new Error("You must specify a building code if you specify a room number")
    }

    const postData = {
        Submit: 'Display XML Results',
        YearTerm: getCodedTerm(term.toLowerCase()),
        ShowComments: 'on',
        ShowFinals: 'on',
        Breadth: ge,
        Dept: department,
        CourseNum: courseNumber,
        Division: getCodedDiv(division.toLowerCase()),
        CourseCodes: sectionCodes,
        InstrName: instructorName,
        CourseTitle: courseTitle,
        ClassType: sectionType,
        Units: units,
        Days: days,
        StartTime: startTime,
        EndTime: endTime,
        MaxCap: maxCapacity,
        FullCourses: fullCourses,
        CancelledCourses: cancelledCourses,
        Bldg: building,
        Room: room,
    };

    let data = new URLSearchParams(postData);

    try {
        const response = await fetch("https://www.reg.uci.edu/perl/WebSoc", {
            method: "POST",
            body: data,
        });

        const json = await transform(await response.text(), template);

        if (json.schools === undefined) {
            throw new Error("Error: Could not retrieve any data from WebSoc.");
        } else {
            return json;
        }
    } catch (error) {
        throw error;
    }
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

module.exports.callWebSocAPI = callWebSocAPI;