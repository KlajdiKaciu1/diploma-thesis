const User = require('../models/User');
const StudentDetails = require('../models/StudentDetails');
const DegreeApplications = require('../models/DegreeApplications');
const Degree = require('../models/Degree');
const bcrypt = require('bcryptjs');
const bcryptSalt=bcrypt.genSaltSync(10);


async function createStudent(req, res) {
    try {
        const { name, email, password, role } = req.body;

        const existingStudent = await User.findOne({ email, role: 'student' });
        if (existingStudent) {
            return res.status(400).json({ message: 'A student with this email already exists.' });
        }

        const userDoc = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcryptSalt),
            role
        });
        res.status(201).json(userDoc);
    } catch (error) {
        console.error('Error registering student:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


async function getStudents(req, res) {
    try {
        const students = await User.find({ role: 'student' });
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: 'Server error, please try again later.' });
    }
}


async function getStudentDetails(req, res) {
    try {
        const { id } = req.params;
        const details = await StudentDetails.findOne({ studentId: id }).exec();

        if (!details) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json(details);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching student details', error: error.message });
    }
}


async function createStudentDetails(req, res) {
    try {
        const { id } = req.params;
        const { bachelorDegree, englishLevel, avgGrade } = req.body;

        let pointsCompEng = 0;
        let pointsElecEng = 0;

     
        if (bachelorDegree === 'Bachelor Computer Engineering') {
            pointsCompEng += 50;
            pointsElecEng += 20;
        } else if (['Bachelor Electronic Engineering', 'Bachelor Telecommunication Engineering'].includes(bachelorDegree)) {
            pointsCompEng += 20;
            pointsElecEng += 50;
        }
        pointsCompEng += avgGrade * 4;
        pointsElecEng += avgGrade * 4;

        if (englishLevel === 'C2') {
            pointsCompEng += 10;
            pointsElecEng += 10;
        } else if (englishLevel === 'C1') {
            pointsCompEng += 7;
            pointsElecEng += 7;
        } else if (englishLevel === 'B2') {
            pointsCompEng += 5;
            pointsElecEng += 5;
        } else {
            pointsCompEng += 2;
            pointsElecEng += 2;
        }

        const existingStudent = await StudentDetails.findOne({ studentId: id });
        if (existingStudent) {
            return res.status(400).json({ message: 'Student already has details, consider updating instead.' });
        }

        const studentDoc = await StudentDetails.create({
            studentId: id,
            bachelorDegree,
            englishLevel,
            avgGrade,
            pointsCompEng,
            pointsElecEng,
        });

        res.status(201).json(studentDoc);
    } catch (error) {
        res.status(500).json({ message: 'Error creating student details', error });
    }
}


async function updateStudentDetails(req, res) {
    try {
        const { id } = req.params;
        const { bachelorDegree, englishLevel, avgGrade } = req.body;

        const studentDoc = await StudentDetails.findOne({ studentId: id });
        if (!studentDoc) {
            return res.status(404).json({ message: 'Student not found' });
        }

        let pointsCompEng = 0;
        let pointsElecEng = 0;

        if (bachelorDegree === 'Bachelor Computer Engineering') {
            pointsCompEng += 50;
            pointsElecEng += 20;
        } else if (['Bachelor Electronic Engineering', 'Bachelor Telecommunication Engineering'].includes(bachelorDegree)) {
            pointsCompEng += 20;
            pointsElecEng += 50;
        }
        pointsCompEng += avgGrade * 4;
        pointsElecEng += avgGrade * 4;

        if (englishLevel === 'C2') {
            pointsCompEng += 10;
            pointsElecEng += 10;
        } else if (englishLevel === 'C1') {
            pointsCompEng += 7;
            pointsElecEng += 7;
        } else if (englishLevel === 'B2') {
            pointsCompEng += 5;
            pointsElecEng += 5;
        } else {
            pointsCompEng += 2;
            pointsElecEng += 2;
        }

        studentDoc.set({
            bachelorDegree,
            englishLevel,
            avgGrade,
            pointsCompEng,
            pointsElecEng
        });

        await studentDoc.save();

        res.json({ message: 'Student details updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating student details', error });
    }
}


async function getDegrees(req, res) {
    try {
        const degrees = await Degree.find();
        res.status(200).json(degrees);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching degrees', error: error.message });
    }
}


async function getRegisteredStudents(req, res) {
    try {
        const { degreeId } = req.params;
        const degreeApplication = await DegreeApplications.findOne({ degreeId })
            .populate('registeredStudents', 'name');

        if (!degreeApplication) {
            return res.status(404).json({ message: 'Degree application not found' });
        }

        res.status(200).json(degreeApplication.registeredStudents);
    } catch (error) {
        console.error('Failed to fetch registered students:', error);
        res.status(500).json({ message: 'Failed to fetch registered students' });
    }
}


async function logoutProfessor(req, res) {
    res.cookie('token', '').json(true);
}

module.exports = {
    createStudent,
    getStudents,
    getStudentDetails,
    createStudentDetails,
    updateStudentDetails,
    getDegrees,
    getRegisteredStudents,
    logoutProfessor
};
