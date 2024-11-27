const mongoose = require('mongoose');

const degreeApplicationsSchema = new mongoose.Schema({
    degreeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Degree', required: true },
    appliedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    acceptedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    registeredStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const DegreeApplications = mongoose.model('DegreeApplications', degreeApplicationsSchema);
module.exports = DegreeApplications;
