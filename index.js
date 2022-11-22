import { XMLParser } from "fast-xml-parser";
import fetch from "node-fetch";

export async function callWebSocAPI({
  term,
  ge = "ANY",
  department = "ALL",
  courseNumber = "",
  division = "ANY",
  sectionCodes = "",
  instructorName = "",
  courseTitle = "",
  sectionType = "ALL",
  units = "",
  days = "",
  startTime = "",
  endTime = "",
  maxCapacity = "",
  fullCourses = "ANY",
  cancelledCourses = "EXCLUDE",
  building = "",
  room = "",
}) {
  if (term === undefined || term === "") {
    throw new Error("Define the term");
  } else if (
    department === "ALL" &&
    ge === "ANY" &&
    sectionCodes === "" &&
    instructorName === ""
  ) {
    throw new Error(
      "Define at least one of department, GE, courseCodes, or instructorName"
    );
  } else if (building === "" && room !== "") {
    throw new Error(
      "You must specify a building code if you specify a room number"
    );
  }

  const postData = {
    Submit: "Display XML Results",
    YearTerm: getCodedTerm(term.toLowerCase()),
    ShowComments: "on",
    ShowFinals: "on",
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

    const parser = new XMLParser({
      attributeNamePrefix: "__",
      ignoreAttributes: false,
      parseAttributeValue: false,
      parseTagValue: false,
      textNodeName: "__text",
      trimValues: false,
    });
    const res = parser.parse(await response.text());

    const json = {};
    json.schools =
      res.websoc_results && res.websoc_results.course_list
        ? (Array.isArray(res.websoc_results.course_list.school)
            ? res.websoc_results.course_list.school
            : [res.websoc_results.course_list.school]
          ).map((x) => ({
            schoolName: x.__school_name,
            schoolComment: x.school_comment,
            departments: (Array.isArray(x.department)
              ? x.department
              : [x.department]
            ).map((y) => ({
              deptComment: y.department_comment ? y.department_comment : "",
              sectionCodeRangeComments: y.course_code_range_comment
                ? Array.isArray(y.course_code_range_comment)
                  ? y.course_code_range_comment.map((z) => z.__text)
                  : [y.course_code_range_comment.__text]
                : [],
              courseNumberRangeComments: y.course_number_range_comment
                ? Array.isArray(y.course_number_range_comment)
                  ? y.course_number_range_comment.map((z) => z.__text)
                  : [y.course_number_range_comment.__text]
                : [],
              deptCode: y.__dept_code,
              deptName: y.__dept_name,
              courses: (Array.isArray(y.course) ? y.course : [y.course]).map(
                (z) => ({
                  deptCode: y.__dept_code,
                  courseComment: z.course_comment ? z.course_comment : "",
                  prerequisiteLink: z.course_prereq_link
                    ? z.course_prereq_link
                    : "",
                  courseNumber: z.__course_number,
                  courseTitle: z.__course_title,
                  sections: (Array.isArray(z.section)
                    ? z.section
                    : [z.section]
                  ).map((w) => ({
                    sectionCode: w.course_code,
                    sectionType: w.sec_type,
                    sectionNum: w.sec_num,
                    units: w.sec_units,
                    instructors: (Array.isArray(w.sec_instructors?.instructor)
                      ? w.sec_instructors?.instructor
                      : [w.sec_instructors?.instructor]
                    ).filter((x) => x),
                    meetings: (Array.isArray(w.sec_meetings.sec_meet)
                      ? w.sec_meetings.sec_meet
                      : [w.sec_meetings.sec_meet]
                    ).map((v) => ({
                      days: v.sec_days,
                      time: v.sec_time,
                      bldg: `${v.sec_bldg} ${v.sec_room}`,
                    })),
                    finalExam: w.sec_final
                      ? w.sec_final.sec_final_date === "TBA"
                        ? "TBA"
                        : `${w.sec_final.sec_final_day} ${w.sec_final.sec_final_date} ${w.sec_final.sec_final_time}`
                      : "",
                    maxCapacity: w.sec_enrollment.sec_max_enroll,
                    numCurrentlyEnrolled: {
                      totalEnrolled: w.sec_enrollment.sec_enrolled,
                      sectionEnrolled: w.sec_enrollment.sec_xlist_subenrolled
                        ? w.sec_enrollment.sec_xlist_subenrolled
                        : "",
                    },
                    numOnWaitlist:
                      w.sec_enrollment.sec_waitlist !== w.course_code
                        ? w.sec_enrollment.sec_waitlist
                        : "",
                    numRequested: w.sec_enrollment.sec_enroll_requests,
                    numNewOnlyReserved:
                      w.sec_enrollment.sec_new_only_reserved !== w.course_code
                        ? w.sec_enrollment.sec_new_only_reserved
                        : "",
                    restrictions: w.sec_restrictions ? w.sec_restrictions : "",
                    status: w.sec_status,
                    sectionComment: w.sec_comment ? w.sec_comment : "",
                  })),
                })
              ),
            })),
          }))
        : [];

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
  let actualTerm = "";

  if (term.includes("fall")) {
    actualTerm = term.slice(0, 4) + "-92";
  } else if (term.includes("winter")) {
    actualTerm = term.slice(0, 4) + "-03";
  } else if (term.includes("spring")) {
    actualTerm = term.slice(0, 4) + "-14";
  } else if (term.includes("summer10wk")) {
    actualTerm = term.slice(0, 4) + "-39";
  } else if (term.includes("summer1")) {
    actualTerm = term.slice(0, 4) + "-25";
  } else if (term.includes("summer2")) {
    actualTerm = term.slice(0, 4) + "-76";
  }

  return actualTerm;
}

function getCodedDiv(div) {
  let codedDiv = div.toLowerCase();

  if (codedDiv === "all") {
    codedDiv = "all";
  } else if (codedDiv === "lowerdiv") {
    codedDiv = "0xx";
  } else if (codedDiv === "upperdiv") {
    codedDiv = "1xx";
  } else if (codedDiv === "graduate") {
    codedDiv = "2xx";
  }

  return codedDiv;
}
