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

    toString() {
        let string = '';
        string += "Name: " + this._name + '\n';
        string += "Departments: ";
        this._departments.forEach(function (currentValue, index, array) {
            if (index < array.length - 1) {
                string += currentValue._name + ', ';
            } else {
                string += currentValue._name + '\n';
            }
        });
        string += "Comments: \n" + this._comments + (this._comments ? '\n' : '');
        return string;
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

    toString() {
        let string = '';
        string += "Name: " + this._name + '\n';
        string += "Courses: ";
        this._courses.forEach(function (currentValue, index, array) {
            if (index < array.length - 1) {
                string += currentValue._name[0] + ' ' + currentValue._name[1] + ', ';
            } else {
                string += currentValue._name + '\n';
            }
        });
        string += "Comments: \n" + this._comments + (this._comments ? '\n' : '');
        return string;
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

    toString() {
        let string = '';
        string += "Name: " + this._name[0] + ' ' + this.name[1] + '\n';
        string += "Sections: \n";
        this._sections.forEach(function (currentValue, index, array) {
            if (index < array.length - 1) {
                string += currentValue.toString() + '\n';
            } else {
                string += currentValue.toString() + '\n';
            }
        });
        return string;
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

    toString() {
        return `${this._classCode} ${this._classType} ${this._sectionCode} ${this._units} [${this._instructors}] [${this._times}] [${this._places}] ${this._finalExamDate} ${this._maxCapacity} ${this._numCurrentlyEnrolled} ${this._numOnWaitlist} ${this._numRequested} ${this._numNewOnlyReserved} [${this._restrictions}] ${this._status}`
        +'\n' + this._comments + (this._comments ? '' : '\n');
    }
}

module.exports.School = School;
module.exports.Department = Department;
module.exports.Course = Course;
module.exports.Section = Section;
