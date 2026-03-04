const mongoose = require('mongoose');

const dogsSheema = new mongoose.Schema({
    name: {type: String, required: true},
    breed: {type: String, required: true},
    age: {type: Number, required: true},
    isVaccinated: {type: Boolean, required: true},
    image: {type: String, required: true},
});

const Dogs = mongoose.model('Dogs', dogsSheema);

module.exports = Dogs;
