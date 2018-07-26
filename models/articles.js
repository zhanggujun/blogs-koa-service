const mongoose = require('mongoose');
const article = require('../schemas/articles');
module.exports = mongoose.model('articles', article);