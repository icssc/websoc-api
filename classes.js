'use strict'

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
        this._classCode = sectionData.classCode;
        this._classType = sectionData.classType;
        this._sectionCode = sectionData.sectionCode;
        this._units = sectionData.units;
        this._instructors = sectionData.instructors;
        this._times = sectionData.times;
        this._places = sectionData.places;
        this._finalExamDate = sectionData.finalExamDate;
        this._maxCapacity = sectionData.maxCapacity;
        this._numCurrentlyEnrolled = sectionData.numCurrentlyEnrolled;
        this._numOnWaitlist = sectionData.numOnWaitlist;
        this._numRequested = sectionData.numRequested;
        this._numNewOnlyReserved = sectionData.numNewOnlyReserved;
        this._restrictions = sectionData.restrictions;
        this._status = sectionData.status;
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
