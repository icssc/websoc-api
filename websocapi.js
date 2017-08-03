const request = require("request");

function postToWebSoc({term, breadth = 'ANY', department = 'ALL', courseNum = '', division = 'ANY', courseCodes = '',
                      instructorName = '', courseTitle = '', classType = 'ALL', units = '', days = '',
                      startTime = '', endTime = '', maxCap = '', fullCourses = 'ANY', cancelledCourses = 'EXCLUDE',
                      building = '', room = ''}) {
    let opts = {
        url: "https://www.reg.uci.edu/perl/WebSoc",
        form: {
            Submit: 'Display Text Results',
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

    request.post(opts, function (err, res, body) {
        console.log(body);
    });
}

postToWebSoc({term: "2017-92", department: "I&C SCI"});