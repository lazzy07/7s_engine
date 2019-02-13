var mongoose = require('mongoose');

teamSchema = mongoose.Schema({
    teamName: {type: String, unique: true},
    index : Number,
    played: {type: Number, default:0},
    won: {type: Number, default:0},
    lost: {type: Number, default:0},
    draw: {type: Number, default:0},
    points: {type: Number, default:0},
    totalTries: {type: Number, default:0},
    triesAgainst: {type: Number, default:0},
    tryDifference: {type: Number, default:0},
    faculty: String,
    batch: Number,
    players: [],
    matches: [],
    group: String,
    isFemale: Boolean
});

var teamDB = mongoose.model('teamProd', teamSchema);
module.exports = teamDB;