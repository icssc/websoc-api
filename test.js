const mocha = require('mocha');
const cheerio = require('cheerio');
const classes = require('./classes');
const chai = require('chai');
const should = chai.should();
const request = require('request');
const WebSocAPI = require('./websocapi');


describe('Find correct amount of classes', () => {
    const depts = ['AC ENG', 'AFAM', 'ANATOMY', 'ANESTH', 'ANTHRO', 'ARABIC', 'ART', 'ART HIS', 'ARTS', 'ARTSHUM', 'ASIANAM', 'BANA', 'BATS', 'BIO SCI', 'BIOCHEM', 'BME', 'BSEMD', 'CAMPREC', 'CBEMS', 'CEM', 'CHC/LAT', 'CHEM', 'CHINESE', 'CLASSIC', 'CLT&THY', 'COGS', 'COM LIT', 'COMPSCI', 'CRITISM', 'CRM/LAW', 'CSE', 'DANCE', 'DERM', 'DEV BIO', 'DRAMA', 'E ASIAN', 'EARTHSS', 'ECO EVO', 'ECON', 'ECPS', 'ED AFF', 'EDUC', 'EECS', 'EHS', 'ENGLISH', 'ENGR', 'ENGRCEE', 'ENGRMAE', 'ENGRMSE', 'EPIDEM', 'ER MED', 'EURO ST', 'FAM MED', 'FIN', 'FLM&MDA', 'FRENCH', 'GEN&SEX', 'GERMAN', 'GLBL ME', 'GLBLCLT', 'GREEK', 'HEBREW', 'HINDI', 'HISTORY', 'HUMAN', 'HUMARTS', 'I&C SCI', 'IN4MATX', 'INT MED', 'INTL ST', 'ITALIAN', 'JAPANSE', 'KOREAN', 'LATIN', 'LAW', 'LINGUIS', 'LIT JRN', 'LPS', 'M&MG', 'MATH', 'MED', 'MED ED', 'MED HUM', 'MGMT', 'MGMT EP', 'MGMT FE', 'MGMT HC', 'MGMTMBA', 'MGMTPHD', 'MIC BIO', 'MOL BIO', 'MPAC', 'MUSIC', 'NET SYS', 'NEURBIO', 'NEUROL', 'NUR SCI', 'OB/GYN', 'OPHTHAL', 'PATH', 'PED GEN', 'PEDS', 'PERSIAN', 'PHARM', 'PHILOS', 'PHRMSCI', 'PHY SCI', 'PHYSICS', 'PHYSIO', 'PLASTIC', 'PM&R', 'POL SCI', 'PORTUG', 'PP&D', 'PSY BEH', 'PSYCH', 'PUB POL', 'PUBHLTH', 'RADIO', 'REL STD', 'ROTC', 'RUSSIAN', 'SOC SCI', 'SOCECOL', 'SOCIOL', 'SPANISH', 'SPPS', 'STATS', 'SURGERY', 'TAGALOG', 'TOX', 'UCDC', 'UNI AFF', 'UNI STU', 'VIETMSE', 'VIS STD', 'WRITING']

    function getNumClasses(html) {
        const $ = cheerio.load(html);
        let numClassesString = $('.course-summary > dt:nth-child(1)').text();
        let numClasses = numClassesString !== '' ? numClassesString.substring(numClassesString.indexOf(':') + 2) : 0;
        console.log(numClasses);

        return parseInt(numClasses);
    }

    function getParsedNumClasses(html) {
        let numCourses = 0;

        WebSocAPI.parseForClasses(html).forEach((school) => {
            school.departments.forEach((dept) => {
                dept.courses.forEach((course) => {
                    course.sections.forEach(() => {
                        numCourses += 1;
                    })
                })
            });
        });

        return numCourses;
    }

    depts.forEach((dept, index) => {
            it(`correctly gets all classes in ${dept}`, (done) => {
                    const postData = {
                        url: 'https://www.reg.uci.edu/perl/WebSoc',
                        form: {
                            Dept: dept,
                            YearTerm: '2017-92'
                        }
                    };

                    request.post(postData, (err, res, body) => {
                        if (!err && res.statusCode === 200) {
                            getNumClasses(body).should.equal(getParsedNumClasses(body));
                            done();
                        } else {
                            console.error(err);
                        }
                    });
                }
            ).timeout(10000);
        }
    )
});