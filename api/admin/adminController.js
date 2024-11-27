const User = require('../models/User');
const Degree = require('../models/Degree');
const bcrypt = require('bcryptjs');
const bcryptSalt = bcrypt.genSaltSync(10);
const jwt = require('jsonwebtoken');
const jwtSecret = 'jabdkcqwdsvhjbqwklq';

async function logoutAdmin(req, res) {
    res.cookie('token', '').json(true);
}

async function createProfessor(req, res) {
    try {
        const { name, email, password, role } = req.body;

        const existingProfessor = await User.findOne({ email, role: 'professor' });
        if (existingProfessor) {
            return res.status(400).json({ message: 'A professor with this email already exists.' });
        }

        const userDoc = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcryptSalt),
            role
        });
        res.status(201).json(userDoc);
    } catch (error) {
        console.error('Error registering professor:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getProfessors(req, res) {
    const users = await User.find();
    res.json(users);
}

async function deleteProfessor(req, res) {
    await User.findByIdAndDelete(req.params.id);
    res.json('User deleted');
}

async function getDegrees(req, res) {
    try {
        const degrees = await Degree.find();
        res.status(200).json(degrees);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching degrees', error: error.message });
    }
}

async function getDegreeById(req, res) {
    const { id } = req.params;
    try {
        const degree = await Degree.findById(id);
        res.status(200).json(degree);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching degree', error: error.message });
    }
}

async function deleteDegree(req, res) {
    await Degree.findByIdAndDelete(req.params.id);
    res.json('Degree deleted');
}

async function updateDegree(req, res) {
    const { id } = req.params;
    const { title, field, description, photos, emptySlots } = req.body;
    try {
        const degreeDoc = await Degree.findById(id);
        if (!degreeDoc) {
            return res.status(404).json({ message: 'Degree not found' });
        }
        degreeDoc.set({ title, field, description, photos, emptySlots });
        await degreeDoc.save();
        res.json('ok');
    } catch (error) {
        res.status(500).json({ message: 'Error updating degree', error: error.message });
    }
}

async function createDegree(req, res) {
    const { token } = req.cookies;
    const { title, field, description, photos, emptySlots } = req.body;
    try {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;
            const degreeDoc = await Degree.create({
                ownerId: userData.id,
                title,
                field,
                description,
                photos,
                emptySlots
            });
            res.json(degreeDoc);
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating degree', error: error.message });
    }
}

module.exports = {
    logoutAdmin,
    createProfessor,
    getProfessors,
    deleteProfessor,
    getDegrees,
    getDegreeById,
    deleteDegree,
    updateDegree,
    createDegree
};
