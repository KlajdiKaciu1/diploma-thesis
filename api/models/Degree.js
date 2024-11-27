const mongoose = require('mongoose');

const degreeSchema = new mongoose.Schema({
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    field: { type: String, required: true },
    description: { type: String, required: true },
    photos: [String],
    emptySlots: { type: Number, required: true },
});

const Degree = mongoose.model('Degree', degreeSchema);
module.exports = Degree;