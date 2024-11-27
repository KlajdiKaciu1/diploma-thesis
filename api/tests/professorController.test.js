// tests/studentController.test.js

const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {
  createStudent,
  getStudents,
  getStudentDetails,
  createStudentDetails,
  updateStudentDetails,
  getDegrees,
  getRegisteredStudents,
  logoutProfessor,
} = require('../professor/professorController');
const User = require('../models/User');
const StudentDetails = require('../models/StudentDetails');
const DegreeApplications = require('../models/DegreeApplications');
const Degree = require('../models/Degree');

jest.mock('../models/User');
jest.mock('../models/StudentDetails');
jest.mock('../models/DegreeApplications');
jest.mock('../models/Degree');
jest.mock('bcryptjs');

const app = express();
app.use(express.json());

// Mock routes for testing
app.post('/students', createStudent);
app.get('/students', getStudents);
app.get('/students/:id/details', getStudentDetails);
app.post('/students/:id/details', createStudentDetails);
app.put('/students/:id/details', updateStudentDetails);
app.get('/degrees', getDegrees);
app.get('/degrees/:degreeId/registered-students', getRegisteredStudents);
app.post('/professor/logout', logoutProfessor);

describe('Student Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createStudent', () => {
    let reqBody;

    beforeEach(() => {
      reqBody = {
        name: 'Test Student',
        email: 'student@example.com',
        password: 'password123',
        role: 'student',
      };

      bcrypt.hashSync.mockReturnValue('hashedpassword');
      User.findOne.mockResolvedValue(null); // No existing student
      User.create.mockResolvedValue({ ...reqBody, _id: 'student123' });
    });

    it('should create a new student and return 201', async () => {
      const res = await request(app).post('/students').send(reqBody);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id', 'student123');
      expect(User.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test Student',
          email: 'student@example.com',
          password: 'hashedpassword',
          role: 'student',
        })
      );
    });

    it('should return 400 if student with email already exists', async () => {
      User.findOne.mockResolvedValue(reqBody); // Student exists

      const res = await request(app).post('/students').send(reqBody);

      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        message: 'A student with this email already exists.',
      });
    });

    it('should return 500 on server error', async () => {
      User.create.mockRejectedValue(new Error('Database error'));

      const res = await request(app).post('/students').send(reqBody);

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('error', 'Internal server error');
    });
  });

  describe('getStudents', () => {
    it('should return list of all students', async () => {
      const mockStudents = [
        { name: 'Student A', email: 'a@example.com', role: 'student' },
        { name: 'Student B', email: 'b@example.com', role: 'student' },
      ];
      User.find.mockResolvedValue(mockStudents);

      const res = await request(app).get('/students');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockStudents);
    });

    it('should handle server errors', async () => {
      User.find.mockRejectedValue(new Error('Database error'));

      const res = await request(app).get('/students');

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty(
        'error',
        'Server error, please try again later.'
      );
    });
  });

  describe('getStudentDetails', () => {
    it('should return student details', async () => {
      const mockDetails = {
        studentId: 'student123',
        bachelorDegree: 'Bachelor Computer Engineering',
        englishLevel: 'C2',
        avgGrade: 85,
        pointsCompEng: 360,
        pointsElecEng: 280,
      };
      StudentDetails.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockDetails),
      });

      const res = await request(app).get('/students/student123/details');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockDetails);
    });

    it('should return 404 if student details are not found', async () => {
      StudentDetails.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const res = await request(app).get('/students/student123/details');

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'Student not found');
    });

    it('should return 500 on server error', async () => {
      StudentDetails.findOne.mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('Database error')),
      });

      const res = await request(app).get('/students/student123/details');

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('message', 'Error fetching student details');
    });
  });

  describe('createStudentDetails', () => {
    let reqBody;

    beforeEach(() => {
      reqBody = {
        bachelorDegree: 'Bachelor Computer Engineering',
        englishLevel: 'C2',
        avgGrade: 85,
      };

      StudentDetails.findOne.mockResolvedValue(null); // No existing details
      StudentDetails.create.mockResolvedValue({
        studentId: 'student123',
        ...reqBody,
        pointsCompEng: 360,
        pointsElecEng: 280,
      });
    });

    it('should create student details', async () => {
      const res = await request(app)
        .post('/students/student123/details')
        .send(reqBody);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty(
        'bachelorDegree',
        'Bachelor Computer Engineering'
      );
      expect(StudentDetails.create).toHaveBeenCalledWith(
        expect.objectContaining({
          studentId: 'student123',
          bachelorDegree: 'Bachelor Computer Engineering',
          englishLevel: 'C2',
          avgGrade: 85,
          pointsCompEng: expect.any(Number),
          pointsElecEng: expect.any(Number),
        })
      );
    });

    it('should return 400 if student already has details', async () => {
      StudentDetails.findOne.mockResolvedValue({ studentId: 'student123' });

      const res = await request(app)
        .post('/students/student123/details')
        .send(reqBody);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        'message',
        'Student already has details, consider updating instead.'
      );
    });

    it('should return 500 on server error', async () => {
      StudentDetails.create.mockRejectedValue(new Error('Database error'));

      const res = await request(app)
        .post('/students/student123/details')
        .send(reqBody);

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('message', 'Error creating student details');
    });
  });

  describe('updateStudentDetails', () => {
    let reqBody;
    let mockStudentDoc;

    beforeEach(() => {
      reqBody = {
        bachelorDegree: 'Bachelor Electronic Engineering',
        englishLevel: 'C1',
        avgGrade: 90,
      };

      mockStudentDoc = {
        studentId: 'student123',
        set: jest.fn(),
        save: jest.fn().mockResolvedValue(true),
      };

      StudentDetails.findOne.mockResolvedValue(mockStudentDoc);
    });

    it('should update student details', async () => {
      const res = await request(app)
        .put('/students/student123/details')
        .send(reqBody);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        'message',
        'Student details updated successfully'
      );
      expect(mockStudentDoc.set).toHaveBeenCalledWith(
        expect.objectContaining({
          bachelorDegree: 'Bachelor Electronic Engineering',
          englishLevel: 'C1',
          avgGrade: 90,
          pointsCompEng: expect.any(Number),
          pointsElecEng: expect.any(Number),
        })
      );
      expect(mockStudentDoc.save).toHaveBeenCalled();
    });

    it('should return 404 if student not found', async () => {
      StudentDetails.findOne.mockResolvedValue(null);

      const res = await request(app)
        .put('/students/student123/details')
        .send(reqBody);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'Student not found');
    });

    it('should return 500 on server error', async () => {
      mockStudentDoc.save.mockRejectedValue(new Error('Database error'));

      const res = await request(app)
        .put('/students/student123/details')
        .send(reqBody);

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('message', 'Error updating student details');
    });
  });

  describe('getDegrees', () => {
    it('should return all degrees', async () => {
      const mockDegrees = [{ title: 'Degree 1' }, { title: 'Degree 2' }];
      Degree.find.mockResolvedValue(mockDegrees);

      const res = await request(app).get('/degrees');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockDegrees);
    });

    it('should handle server errors', async () => {
      Degree.find.mockRejectedValue(new Error('Database error'));

      const res = await request(app).get('/degrees');

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('message', 'Error fetching degrees');
    });
  });


  describe('logoutProfessor', () => {
    it('should clear token and return true', async () => {
      const res = await request(app).post('/professor/logout');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(true);
    });
  });
});
