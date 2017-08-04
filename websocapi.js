const request = require("request");
const cheerio = require("cheerio");


function postToWebSoc({term, breadth = 'ANY', department = 'ALL', courseNum = '', division = 'ANY', courseCodes = '',
                      instructorName = '', courseTitle = '', classType = 'ALL', units = '', days = '',
                      startTime = '', endTime = '', maxCap = '', fullCourses = 'ANY', cancelledCourses = 'EXCLUDE',
                      building = '', room = ''}) {

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

    request.post(postData, function (err, res, body) {
        parseForClasses(body);
    });
}

function parseForClasses(htmlBody) {
    // get college title from class="college-title"
    // get college comment from class="college-comment" (May not exist)
    //
    // get dept title from class="dept-title"
    // get dept comment from class="dept-comment" (May not exist)
    //
    // get course num range comment from class="num-range-comment" (May not exist)
    // get course title from <tr valign="top" bgcolor="#fff0ff"></tr>
    // get course comment from <tr bgcolor="#fff0ff"> (May not exist)
    // get section from <tr valign="top"></tr> OR <tr valign="top" bgcolor="#FFFFCC"></tr>
    // get section comment from <tr></tr> OR <tr bgcolor="#FFFFCC"></tr> (May not exist)
}

postToWebSoc({term: "2017-92", department: "I&C SCI"});