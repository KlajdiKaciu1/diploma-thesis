const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
const jwtSecret = 'jabdkcqwdsvhjbqwklq';
const bcrypt = require('bcryptjs');
const bcryptSalt=bcrypt.genSaltSync(10);

const { 
    createStudent,
    getStudents,
    getStudentDetails,
    createStudentDetails,
    updateStudentDetails,
    getDegrees,
    getRegisteredStudents,
    logoutProfessor 
} = require('./professorController');

async function verifyProfessor(req, res, next) {
    const { token } = req.cookies;
    if (!token) {
        return res.status(403).json('Unauthorized');
    }
    try {
        const userData = jwt.verify(token, jwtSecret);
        const user = await User.findById(userData.id);

        if (!user) {
            return res.status(403).json('Unauthorized');
        }
        if (user.role === 'professor') {
            req.user = user;
            next();
        } else {
            res.status(403).json('Unauthorized');
        }
    } catch (err) {
        console.error('Error verifying token:', err);
        res.status(403).json('Unauthorized');
    }
}

router.post('/student', verifyProfessor, createStudent);
router.get('/students', verifyProfessor, getStudents);
router.get('/student-details/:id', verifyProfessor, getStudentDetails);
router.post('/student-details/:id', verifyProfessor, createStudentDetails);
router.put('/student-details/:id', verifyProfessor, updateStudentDetails);
router.get('/degrees', verifyProfessor, getDegrees);
router.get('/registered-students/:degreeId', verifyProfessor, getRegisteredStudents);
router.post('/logout', verifyProfessor, logoutProfessor);

module.exports = router;