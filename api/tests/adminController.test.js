const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { logoutAdmin, createProfessor, getProfessors, deleteProfessor, getDegrees, getDegreeById, deleteDegree, updateDegree, createDegree } = require('../admin/adminController');
const User = require('../models/User');
const Degree = require('../models/Degree');

jest.mock('../models/User');
jest.mock('../models/Degree');
jest.mock('jsonwebtoken');
jest.mock('bcryptjs');

const app = express();
app.use(express.json());

// Mock routes for testing
app.post('/admin/logout', logoutAdmin);
app.post('/admin/professors', createProfessor);
app.get('/admin/professors', getProfessors);
app.delete('/admin/professors/:id', deleteProfessor);
app.get('/admin/degrees', getDegrees);
app.get('/admin/degrees/:id', getDegreeById);
app.delete('/admin/degrees/:id', deleteDegree);
app.put('/admin/degrees/:id', updateDegree);
app.post('/admin/degrees', createDegree);

describe('Admin Controller', () => {

    describe('logoutAdmin', () => {
        it('should clear token and return true', async () => {
            const res = await request(app).post('/admin/logout');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(true);
        });
    });

    describe('createProfessors', () => {
        let reqBody;
      
        beforeEach(() => {
          reqBody = { 
            name: 'Test Professor', 
            email: 'prof@example.com', 
            role: 'professor' 
          };
      
          User.findOne.mockResolvedValue(null);  // No existing professor
          User.create.mockResolvedValue({ ...reqBody, _id: 'professor123' });
        });
      
        afterEach(() => {
          jest.clearAllMocks();
        });
      
        it('should create a new professor and return 201', async () => {
          const response = await request(app)
            .post('/admin/professors')
            .send(reqBody);
      
          expect(response.status).toBe(201);
          expect(response.body).toHaveProperty('_id', 'professor123');
          expect(User.create).toHaveBeenCalledWith(expect.objectContaining({
            name: 'Test Professor',
            email: 'prof@example.com',
            role: 'professor',
          }));
        });
      
        it('should return 400 if professor with email already exists', async () => {
          User.findOne.mockResolvedValue(reqBody);  // Professor exists
      
          const response = await request(app)
            .post('/admin/professors')
            .send(reqBody);
      
          expect(response.status).toBe(400);
          expect(response.body).toEqual({ message: 'A professor with this email already exists.' });
        });
      });
      

    describe('getProfessors', () => {
        it('should return list of all professors', async () => {
            const mockProfessors = [{ name: 'Prof A' }, { name: 'Prof B' }];
            User.find.mockResolvedValue(mockProfessors);

            const res = await request(app).get('/admin/professors');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockProfessors);
        });
    });

    describe('deleteProfessor', () => {
        it('should delete professor by id', async () => {
            User.findByIdAndDelete.mockResolvedValue(true);

            const res = await request(app).delete('/admin/professors/123');

            expect(res.status).toBe(200);
            expect(res.body).toBe('User deleted');
        });
    });

    describe('getDegrees', () => {
        it('should return all degrees', async () => {
            const mockDegrees = [{ title: 'Degree 1' }, { title: 'Degree 2' }];
            Degree.find.mockResolvedValue(mockDegrees);

            const res = await request(app).get('/admin/degrees');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockDegrees);
        });
    });

    describe('getDegreeById', () => {
        it('should return degree by id', async () => {
            const mockDegree = { title: 'Degree 1' };
            Degree.findById.mockResolvedValue(mockDegree);

            const res = await request(app).get('/admin/degrees/123');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockDegree);
        });
    });

    describe('deleteDegree', () => {
        it('should delete degree by id', async () => {
            Degree.findByIdAndDelete.mockResolvedValue(true);

            const res = await request(app).delete('/admin/degrees/123');

            expect(res.status).toBe(200);
            expect(res.body).toBe('Degree deleted');
        });
    });

    describe('updateDegree', () => {
        it('should update a degree by id', async () => {
            const reqBody = { title: 'Updated Title', field: 'Updated Field' };
            const mockDegree = { set: jest.fn(), save: jest.fn() };

            Degree.findById.mockResolvedValue(mockDegree);

            const res = await request(app).put('/admin/degrees/123').send(reqBody);

            expect(res.status).toBe(200);
            expect(mockDegree.set).toHaveBeenCalledWith(reqBody);
            expect(mockDegree.save).toHaveBeenCalled();
        });
    });
});

