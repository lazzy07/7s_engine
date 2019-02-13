var mongoose = require('mongoose');

matchSchema = mongoose.Schema({
    team1: String,
    team2: String,
    point1: Number,
    point2: Number,
    name: String,
    index: Number,
    male: Boolean,
    type: String,
    isPlayed: Boolean
});

var matchDB = mongoose.model('matchesProd', matchSchema);
module.exports = matchDB;