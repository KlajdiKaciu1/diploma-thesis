const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { getStudentDetails, getAllDegrees, getDegreeById, applyForDegree, getAppliedDegrees, getRegisteredStudents, registerStudent, logoutStudent } = require('../student/studentController');

const StudentDetails = require('../models/StudentDetails');
const Degree = require('../models/Degree');
const DegreeApplications = require('../models/DegreeApplications');

jest.mock('../models/StudentDetails');
jest.mock('../models/Degree');
jest.mock('../models/DegreeApplications');

const app = express();
app.use(express.json());

// Mock routes for testing
app.get('/student/:id', getStudentDetails);
app.get('/degrees', getAllDegrees);
app.get('/degrees/:id', getDegreeById);
app.post('/degrees/apply', applyForDegree);
app.get('/student/degrees/:id/applied', getAppliedDegrees);
app.get('/degrees/:degreeId/registered', getRegisteredStudents);
app.post('/degrees/:degreeId/register', registerStudent);
app.post('/student/logout', logoutStudent);

describe('Student Controller', () => {

    describe('getStudentDetails', () => {
        it('should return student details by ID', async () => {
            const mockDetails = { name: 'Test Student', studentId: '123' };
            StudentDetails.findOne.mockResolvedValue(mockDetails);

            const res = await request(app).get('/student/123');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockDetails);
        });

        it('should return 404 if student is not found', async () => {
            StudentDetails.findOne.mockResolvedValue(null);

            const res = await request(app).get('/student/123');

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ message: 'Student not found' });
        });
    });

    describe('getAllDegrees', () => {
        it('should return all degrees', async () => {
            const mockDegrees = [{ title: 'Degree 1' }, { title: 'Degree 2' }];
            Degree.find.mockResolvedValue(mockDegrees);

            const res = await request(app).get('/degrees');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockDegrees);
        });
    });

    describe('getDegreeById', () => {
        it('should return degree by ID', async () => {
            const mockDegree = { title: 'Degree 1' };
            Degree.findById.mockResolvedValue(mockDegree);

            const res = await request(app).get('/degrees/123');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockDegree);
        });
    });


    describe('logoutStudent', () => {
        it('should clear token and return true', async () => {
            const res = await request(app).post('/student/logout');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(true);
        });
    });
});
