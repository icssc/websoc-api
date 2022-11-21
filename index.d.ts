export type Term = `${string}${
  | "Fall"
  | "Winter"
  | "Spring"
  | "Summer1"
  | "Summer10wk"
  | "Summer2"}`;
export type GE =
  | "ANY"
  | "GE-1A"
  | "GE-1B"
  | "GE-2"
  | "GE-3"
  | "GE-4"
  | "GE-5A"
  | "GE-5B"
  | "GE-6"
  | "GE-7"
  | "GE-8";
export type Division = "ALL" | "LowerDiv" | "UpperDiv" | "Graduate";
export type SectionType =
  | "ALL"
  | "Act"
  | "Col"
  | "Dis"
  | "Fld"
  | "Lab"
  | "Lec"
  | "Qiz"
  | "Res"
  | "Sem"
  | "Stu"
  | "Tap"
  | "Tut";
export type FullCourses =
  | "ANY"
  | "SkipFullWaitlist"
  | "FullOnly"
  | "OverEnrolled";
export type CancelledCourses = "Exclude" | "Include" | "Only";

export interface WebsocAPIOptions {
  term: Term;
  ge?: GE;
  department?: string;
  courseNumber?: string;
  division?: Division;
  sectionCodes?: string;
  instructorName?: string;
  courseTitle?: string;
  sectionType?: SectionType;
  units?: string;
  days?: string;
  startTime?: string;
  endTime?: string;
  maxCapacity?: string;
  fullCourses?: FullCourses;
  cancelledCourses?: CancelledCourses;
  building?: string;
  room?: string;
}

export interface WebsocSectionMeeting {
  days: string;
  time: string;
  bldg: string;
}

export interface WebsocSectionEnrollment {
  totalEnrolled: string;
  sectionEnrolled: string;
}

export interface WebsocSection {
  sectionCode: string;
  sectionType: string;
  sectionNum: string;
  units: string;
  instructors: string[];
  meetings: WebsocSectionMeeting[];
  finalExam: string;
  maxCapacity: string;
  numCurrentlyEnrolled: WebsocSectionEnrollment;
  numOnWaitlist: string;
  numRequested: string;
  numNewOnlyReserved: string;
  restrictions: string;
  status: string;
  sectionComment: string;
}

export interface WebsocCourse {
  deptCode: string;
  courseNumber: string;
  courseTitle: string;
  courseComment: string;
  prerequisiteLink: string;
  sections: WebsocSection[];
}

export interface WebsocDepartment {
  deptName: string;
  deptCode: string;
  deptComment: string;
  courses: WebsocCourse[];
  sectionCodeRangeComments: string[];
  courseNumberRangeComments: string[];
}

export interface WebsocSchool {
  schoolName: string;
  schoolComment: string;
  departments: WebsocDepartment[];
}

export interface WebsocAPIResponse {
  schools: WebsocSchool[];
}

export function callWebSocAPI(options: WebsocAPIOptions): Promise<WebsocAPIResponse>;
