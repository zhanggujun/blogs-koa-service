const mongoose = require('mongoose');
const labels = require('../schemas/labels');
module.exports = mongoose.model('labels', labels);