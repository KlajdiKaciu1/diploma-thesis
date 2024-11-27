const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const jwtSecret = 'jabdkcqwdsvhjbqwklq';
const { 
    logoutAdmin, 
    createProfessor, 
    getProfessors, 
    deleteProfessor, 
    getDegrees, 
    getDegreeById, 
    deleteDegree, 
    updateDegree, 
    createDegree 
} = require('./adminController');

async function verifyAdmin(req, res, next) {
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
        if (user.role === 'admin') {
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
router.post('/logout', verifyAdmin, logoutAdmin);
router.post('/professor', verifyAdmin, createProfessor);
router.get('/professors', verifyAdmin, getProfessors);
router.delete('/professors/:id', verifyAdmin, deleteProfessor);
router.get('/degrees', verifyAdmin, getDegrees);
router.get('/degrees/:id', verifyAdmin, getDegreeById);
router.delete('/degrees/:id', verifyAdmin, deleteDegree);
router.put('/degree/:id', verifyAdmin, updateDegree);
router.post('/degree', verifyAdmin, createDegree);

module.exports = router;