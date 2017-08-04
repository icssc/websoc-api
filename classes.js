class School {
    constructor(name) {
        this._comments = "";
        this._departments = [];
        this._name = name;
    }

    addComment(comment) {
        this._comments += comment;
    }

    addDepartment(department) {
        this._departments.push(department);
    }

    get name() {
        return this._name;
    }

    get comments() {
        return this._comments;
    }

    get departments() {
        return this._departments;
    }
}

class Department {
    constructor(name) {
        this._comments = "";
        this._courses = [];
        this._name = name;
    }

    addComment(comment) {
        this._comments += comment;
    }

    addCourse(course) {
        this._courses.push(course);
    }

    get name() {
        return this._name;
    }

    get comments() {
        return this._comments;
    }

    get courses() {
        return this._courses;
    }
}

class Course {
    constructor(name) {
        this._comments = "";
        this._sections = [];
        this._name = name;
    }

    addComment(comment) {
        this._comments += comment;
    }

    addSection(section) {
        this._sections.push(section);
    }

    get name() {
        return this._name;
    }

    get comments() {
        return this._comments;
    }

    get sections() {
        return this._sections;
    }
}

class Section {
    constructor(sectionData) {
        this._classCode = sectionData[0];
        this._classType = sectionData[1];
        this._sectionCode = sectionData[2];
        this._units = sectionData[3];
        this._instructors = sectionData[4];
        this._times = sectionData[5];
        this._places = sectionData[6];
        this._finalExamDate = sectionData[7];
        this._maxCapacity = sectionData[8];
        this._numCurrentlyEnrolled = sectionData[9];
        this._numOnWaitlist = sectionData[10];
        this._numRequested = sectionData[11];
        this._numNewOnlyReserved = sectionData[12];
        this._restrictions = sectionData[13];
        this._status = sectionData[14];
        this._comments = '';
    }

    addComment(comment) {
        this._comments += comment;
    }

    get classCode() {
        return this._classCode;
    }

    get classType() {
        return this._classType;
    }

    get sectionCode() {
        return this._sectionCode;
    }

    get units() {
        return this._units;
    }

    get instructors() {
        return this._instructors;
    }

    get times() {
        return this._times;
    }

    get places() {
        return this._places;
    }

    get finalExamDate() {
        return this._finalExamDate;
    }

    get maxCapacity() {
        return this._maxCapacity;
    }

    get numCurrentlyEnrolled() {
        return this._numCurrentlyEnrolled;
    }

    get numOnWaitlist() {
        return this._numOnWaitlist;
    }

    get numRequested() {
        return this._numRequested;
    }

    get numNewOnlyReserved() {
        return this._numNewOnlyReserved;
    }

    get restrictions() {
        return this._restrictions;
    }

    get status() {
        return this._status;
    }

    get comments() {
        return this._comments;
    }
}

module.exports.School = School;
module.exports.Department = Department;
module.exports.Course = Course;
module.exports.Section = Section;
