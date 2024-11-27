const User = require('../models/User');
const Degree = require('../models/Degree');
const StudentDetails = require('../models/StudentDetails');
const DegreeApplications = require('../models/DegreeApplications');
const bcrypt = require('bcryptjs');
const bcryptSalt = bcrypt.genSaltSync(10);

// Fetch student details by ID
async function getStudentDetails(req, res) {
    try {
        const { id } = req.params;
        const details = await StudentDetails.findOne({ studentId: id });

        if (!details) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json(details);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching student details', error: error.message });
    }
}

// Get all degrees
async function getAllDegrees(req, res) {
    try {
        const degrees = await Degree.find();
        res.status(200).json(degrees);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching degrees', error: error.message });
    }
}

// Get degree by ID
async function getDegreeById(req, res) {
    const { id } = req.params;
    try {
        const degree = await Degree.findById(id);
        res.status(200).json(degree);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching degrees', error: error.message });
    }
}

// Apply for a degree
async function applyForDegree(req, res) {
    const { degreeId, studentId } = req.body;
    try {
        let application = await DegreeApplications.findOne({ degreeId });
        if (!application) {
            application = new DegreeApplications({ degreeId });
        }

        if (!application.appliedStudents.includes(studentId)) {
            application.appliedStudents.push(studentId);
            await application.save();
        }

        const student = await StudentDetails.findOne({ studentId });
        if (student && !student.appliedDegrees.includes(degreeId)) {
            student.appliedDegrees.push(degreeId);
            await student.save();
        }

        res.status(200).json({ message: 'Application successful' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to apply for degree' });
    }
}

// Get applied degrees for a student
async function getAppliedDegrees(req, res) {
    try {
        const { id } = req.params;
        const studentDetails = await StudentDetails.findOne({ studentId: id }).populate('appliedDegrees');

        if (!studentDetails) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.json(studentDetails.appliedDegrees);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

// Get registered students for a degree
async function getRegisteredStudents(req, res) {
    const { degreeId } = req.params;

    try {
        const degreeApplication = await DegreeApplications.findOne({ degreeId }).populate('appliedStudents');
        if (!degreeApplication) {
            return res.status(404).json({ error: 'Degree not found' });
        }

        const degree = await Degree.findById(degreeId, 'emptySlots field title');
        if (!degree) {
            return res.status(404).json({ error: 'Degree slots not found' });
        }

        const sortBy = degree.field === 'Computer Engineering' ? 'pointsCompEng' : 'pointsElecEng';
        const appliedStudentsDetails = await StudentDetails.find({ studentId: { $in: degreeApplication.appliedStudents } }).populate('studentId');
        const sortedStudents = appliedStudentsDetails.sort((a, b) => b[sortBy] - a[sortBy]);

        const acceptedStudents = sortedStudents.slice(0, degree.emptySlots);
        const acceptedStudentIds = acceptedStudents.map(student => student.studentId._id);

        degreeApplication.acceptedStudents = acceptedStudentIds;
        await degreeApplication.save();

        res.json({ degree, appliedStudents: sortedStudents, degreeSlots: degree.emptySlots, acceptedStudents });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve registered students' });
    }
}

// Register student for a degree
async function registerStudent(req, res) {
    try {
        const { degreeId } = req.params;
        const { studentId } = req.body;

        const degreeApplication = await DegreeApplications.findOne({ degreeId });
        const degree = await Degree.findById(degreeId);

        if (!degreeApplication) {
            return res.status(404).json({ message: 'Degree application not found' });
        }

        degreeApplication.appliedStudents.pull(studentId);
        degreeApplication.registeredStudents.push(studentId);
        degree.emptySlots -= 1;

        await degreeApplication.save();
        await degree.save();

        await DegreeApplications.updateMany(
            { degreeId: { $ne: degreeId } },
            { $pull: { appliedStudents: studentId } }
        );

        await StudentDetails.updateOne(
            { studentId },
            { $pull: { appliedDegrees: degreeId } }
        );

        res.status(200).json({ message: 'Student registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to register student' });
    }
}

// Logout student
async function logoutStudent(req, res) {
    res.cookie('token', '').json(true);
}

module.exports = {
    getStudentDetails,
    getAllDegrees,
    getDegreeById,
    applyForDegree,
    getAppliedDegrees,
    getRegisteredStudents,
    registerStudent,
    logoutStudent,
};
