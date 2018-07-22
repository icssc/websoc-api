'use strict'

class School {
    constructor(name, comment) {
        this._comment = comment;
        this._departments = [];
        this._name = name;
    }

    addDepartment(department) {
        this._departments.push(department);
    }

    get name() {
        return this._name;
    }

    get comment() {
        return this._comment;
    }

    get departments() {
        return this._departments;
    }

    toJSON() {
        return {
            comment: this._comment,
            departments: this._departments,
            name: this._name
        };
    }

    toString() {
        return JSON.stringify(this);
    }
}

class Department {
    constructor(name) {
        this._comments = [];
        this._courses = [];
        this._name = name;
    }

    addComment(comment) {
        this._comments.push(comment);
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

    toJSON() {
        return {
            comments: this._comments,
            courses: this._courses,
            name: this._name
        };
    }

    toString() {
        return JSON.stringify(this);
    }
}

class Course {
    constructor(name, prerequisiteLink, comment) {
        this._comment = comment;
        this._sections = [];
        this._name = name;
        this._prerequisiteLink = prerequisiteLink;
    }

    addSection(section) {
        this._sections.push(section);
    }

    get name() {
        return this._name;
    }

    get comments() {
        return this._comment;
    }

    get sections() {
        return this._sections;
    }

    get prerequisiteLink() {
        return this._prerequisiteLink;
    }

    toJSON() {
        return {
            comment: this._comment,
            sections: this._sections,
            name: this._name,
            prerequisiteLink: this._prerequisiteLink
        };
    }

    toString() {
        return JSON.stringify(this);
    }
}

class Section {
    constructor(sectionData) {
        this._classCode = sectionData.classCode;
        this._classType = sectionData.classType;
        this._sectionCode = sectionData.sectionCode;
        this._units = sectionData.units;
        this._instructors = sectionData.instructors;
        this._meetings = sectionData.meetings;
        this._finalExam = sectionData.finalExam;
        this._maxCapacity = sectionData.maxCapacity;
        this._numCurrentlyEnrolled = sectionData.numCurrentlyEnrolled;
        this._numOnWaitlist = sectionData.numOnWaitlist;
        this._numRequested = sectionData.numRequested;
        this._numNewOnlyReserved = sectionData.numNewOnlyReserved;
        this._restrictions = sectionData.restrictions;
        this._status = sectionData.status;
        this._comment = sectionData.comment;
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

    get meetings() {
        return this._meetings;
    }

    get finalExam() {
        return this._finalExam;
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

    get comment() {
        return this._comment;
    }

    toJSON() {
        return {
            classCode: this._classCode,
            classType: this._classType,
            sectionCode: this._sectionCode,
            units: this._units,
            instructors: this._instructors,
            meetings: this._meetings,
            finalExam: this._finalExam,
            maxCapacity: this._maxCapacity,
            numCurrentlyEnrolled: this._numCurrentlyEnrolled,
            numOnWaitlist: this._numOnWaitlist,
            numRequested: this._numRequested,
            numNewOnlyReserved: this._numNewOnlyReserved,
            restrictions: this._restrictions,
            status: this._status,
            comment: this._comment
        };
    }

    toString() {
        return JSON.stringify(this);
    }
}

module.exports.School = School;
module.exports.Department = Department;
module.exports.Course = Course;
module.exports.Section = Section;
