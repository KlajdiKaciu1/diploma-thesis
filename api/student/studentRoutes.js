const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
const jwtSecret = 'jabdkcqwdsvhjbqwklq';

const{
        getStudentDetails,
        getAllDegrees,
        getDegreeById,
        applyForDegree,
        getAppliedDegrees,
        getRegisteredStudents,
        registerStudent,
        logoutStudent,
} = require('./studentController');

async function verifyStudent(req, res, next) {
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
        if (user.role === 'student') {
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
router.get('/student-details/:id', verifyStudent,getStudentDetails);
router.get('/degrees', verifyStudent, getAllDegrees);
router.get('/degrees/:id', verifyStudent, getDegreeById);
router.post('/degrees/apply', verifyStudent, applyForDegree);
router.get('/applied-degrees/:id', verifyStudent, getAppliedDegrees);
router.get('/registered-students/:degreeId', verifyStudent, getRegisteredStudents);
router.post('/register/:degreeId', verifyStudent,registerStudent);
router.post('/logout', verifyStudent, logoutStudent);

module.exports = router;