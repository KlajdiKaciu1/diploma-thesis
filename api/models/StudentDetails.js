const mongoose = require('mongoose');

const studentDetailsSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    bachelorDegree: { type: String, required: true },
    englishLevel: { type: String, required: true },
    avgGrade: { type: Number, required: true },
    pointsCompEng: { type: Number, default: 0 },
    pointsElecEng: { type: Number, default: 0 },
    appliedDegrees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Degree' }]
});

const StudentDetails = mongoose.model('StudentDetails', studentDetailsSchema);
module.exports = StudentDetails;

