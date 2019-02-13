/**
 * Created by Lasantha Madushan on 8/19/2017.
 * Server of Tagby 7's 2K17
 */

var ip = process.argv[2];
var port = process.argv[3];
var express = require("express");
var app = express();
http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var mongoose = require("mongoose");

mongoose.Promise = require('bluebird');

var databaseConnection = "127.0.0.1:27017";

var  teamDB = require("./models/team.js");
var  matchDB = require("./models/match.js");

//Connecting to the Database
mongoose.connect(databaseConnection);

//Socket arrays
monitors = [];
connections = [];
controllers = [];

//For controller usage
var monitor_list = [];


app.use(express.static(__dirname +'/web'));

//Connecting sockets with socket.io
io.sockets.on("connection",function(socket){
    connections.push(socket);
    console.log("Connected ::: %s sockets connected", connections.length);

    //Registering a controller
    socket.on("Register_controller",function(){
       controllers.push(socket);
       socket.emit("registered");
       console.log("\x1b[36m","Controller added ::: \n\t# of Monitors connected ::: ",controllers.length,"\x1b[37m");
    });

    //Disconnect Sequence
    socket.on('disconnect', function (data) {
        connections.splice(connections.indexOf(socket),1);
        if(monitors.indexOf(socket) !== -1){

            monitors.splice(monitors.indexOf(socket),1);

            for(var j=0;j<monitor_list.length;j++){
                if(monitor_list[j].name === socket.name){
                    monitor_list.splice(j,1);
                    console.log(monitor_list);
                }
            }


            console.log("\x1b[36m","Monitor disconnected ::: " + data + "\n\t# of Monitor connected ::: ",monitors.length,"\x1b[37m");
            console.log(controllers.length);

            for(var i = 0; i< controllers.length; i++){
                controllers[i].emit("Monitor_disconnected",socket.name);
                controllers[i].emit("MC_monitor_list",monitor_list);
            }
        }

        if(controllers.indexOf(socket) !== -1){
            controllers.splice(connections.indexOf(socket),1);
            console.log("\x1b[36m","Controller disconnected ::: " + data + "\n\t# of Controller connected ::: ",controllers.length,"\x1b[37m");
        }
        console.log("Disconnected ::: %s sockets connected", connections.length);
    });

    //Register Monitor Sequence
    socket.on('registerMonitor', function(data){

        socket.type = 'monitor';
        socket.name = data;
        socket.state = "Start Screen";

        monitor_list.push({name: socket.name, state: socket.state});
        monitors.push(socket);

        console.log("\x1b[36m","Monitor added ::: " + data + "\n\t# of Monitors connected ::: ",monitors.length,"\x1b[37m");
        socket.emit("registered",{data: "ok"});
        if(controllers.length !== 0){
            for(var i = 0; i<controllers.length; i++){
                controllers[i].emit("MC_monitor_list",monitor_list);
            }
        }
    });


    //Monitor list request
    socket.on('MC_load', function(){
        if(monitor_list.length === 0){
            socket.emit("Error", {err : "Error ::: No monitors found"});
            socket.emit("MC_monitor_list",monitor_list);
        }else{
            socket.emit("MC_monitor_list",monitor_list);
        }
    });

    //Changing Monitor state Controller > Server
    socket.on('MC_change_state',function(data){
        for(var i = 0;i< monitor_list.length;i++){
            if(monitor_list[i].name === data.name){
                monitor_list[i].state = data.state;
                console.log("Object found to change state");
            }
        }
        socket.emit("MC_monitor_list",monitor_list);
    });

    //Registering a new team
    socket.on("RT_register_team", function(team){
        teamDB.findOne({name: team.teamName},function(err, teamFound){
            if(err){
                console.log("ERROR :: Server error : When tryin' to find teamIsExist");
                socket.emit("Error", {err : "Error ::: Internal server error : when finding teamIsExists"});
            }else{
                if(teamFound){
                    socket.emit("Error", {err : "Error ::: Team already exists"});
                }else{
                    var newTeam = new teamDB();

                    newTeam.teamName = team.teamName;
                    newTeam.group = team.teamGroup;
                    newTeam.faculty = team.teamFaculty;
                    newTeam.batch = team.teamBatch;
                    newTeam.isFemale = team.isFemale;

                    newTeam.players.push(team.teamPlayer1);
                    newTeam.players.push(team.teamPlayer2);
                    newTeam.players.push(team.teamPlayer3);
                    newTeam.players.push(team.teamPlayer4);
                    newTeam.players.push(team.teamPlayer5);
                    newTeam.players.push(team.teamPlayer6);
                    newTeam.players.push(team.teamPlayer7);
                    newTeam.players.push(team.teamPlayer8);

                    //Use this
                    //newTeam.markModified('data');

                    newTeam.save(function(err, savedObject){
                        if(err){
                            console.log("ERROR :: Server error : Error While saving newTeam object");
                            socket.emit("Error", {err : "Error ::: Error While saving newTeam object"});
                        }else{
                            console.log("Done :: Saving team : "+ JSON.stringify(savedObject));
                            socket.emit("ET_new_team_success");
                        }
                    });
                }
            }
        });
    });

    //Requesting full team list
    socket.on("team_list_request",function(){
        teamDB.find({},function(err,foundData){
            if(err){
                console.log("Error ::: Error while finding team data to send");
                socket.emit("Error", {err : "Error ::: Error while finding team data to send"});
            }else{
                if(!foundData){
                    console.log("NO DATA!!!!");
                    socket.emit("Error", {err : "Error ::: No data found!"});
                }else{
                    socket.emit("team_list_send",foundData);
                }
            }
        });
    });

    //Updating edited team
    socket.on("RT_update_team",function(team, oldTeam){
        //if(team.teamName === oldTeam.teamName){
            teamDB.findOne({teamName: team.teamName},function(err,teamFound){
                if(err){
                    console.log("Error ::: Error while finding team data");
                    socket.emit("Error", {err : "Error ::: Error while finding team data"});
                }else{
                    if(teamFound){
                        teamFound.teamName = team.teamName;
                        teamFound.group = team.teamGroup;
                        teamFound.faculty = team.teamFaculty;
                        teamFound.batch = team.teamBatch;
                        teamFound.isFemale = team.isFemale;

                        teamFound.players = [];

                        teamFound.players.push(team.teamPlayer1);
                        teamFound.players.push(team.teamPlayer2);
                        teamFound.players.push(team.teamPlayer3);
                        teamFound.players.push(team.teamPlayer4);
                        teamFound.players.push(team.teamPlayer5);
                        teamFound.players.push(team.teamPlayer6);
                        teamFound.players.push(team.teamPlayer7);
                        teamFound.players.push(team.teamPlayer8);

                        teamFound.markModified("players");

                        teamFound.save(function(err){
                            if(err){
                                console.log("Error ::: Error while saving team data not changed name");
                                socket.emit("Error", {err : "Error ::: Error while saving team data not changed name"});
                            }else{
                                console.log("Not changed name : editTeam data saved");
                                socket.emit("ET_edit_team_success");
                            }
                        })
                    }else{
                        console.log("Error ::: Error no team data found to edit");
                        socket.emit("Error", {err : "Error ::: Error no team data found to edit"});
                    }
                }
            });
        //}
        /*else{
            teamDB.findOne({teamName: team.teamName},function(err,teamFound){
                if(err){
                    console.log("Error ::: Error while finding team when name changed");
                    socket.emit("Error", {err : "Error ::: Error while finding team when name changed"});
                }else{
                    if(teamFound){
                        console.log("Error ::: Team already exists");
                        socket.emit("Error", {err : "Error ::: Team already exists"});
                    }else{
                        teamDB.findOne({teamName: oldTeam.teamName},function(err, teamFoundOld){
                            if(err){
                                console.log("Error ::: error while finding OldTeam");
                                socket.emit("Error", {err : "Error ::: error while finding OldTeam"});
                            }else{
                                if(teamFoundOld){
                                    var newTeam = new teamDB();

                                    newTeam.teamName = team.teamName;
                                    newTeam.group = team.teamGroup;
                                    newTeam.faculty = team.teamFaculty;
                                    newTeam.batch = team.teamBatch;
                                    newTeam.isFemale = team.isFemale;

                                    newTeam.players.push(team.teamPlayer1);
                                    newTeam.players.push(team.teamPlayer2);
                                    newTeam.players.push(team.teamPlayer3);
                                    newTeam.players.push(team.teamPlayer4);
                                    newTeam.players.push(team.teamPlayer5);
                                    newTeam.players.push(team.teamPlayer6);
                                    newTeam.players.push(team.teamPlayer7);
                                    newTeam.players.push(team.teamPlayer8);

                                    for(var i=0;i<teamFoundOld.matches.length;i++){
                                        if(teamFoundOld.matches[i].team1 === teamFoundOld.teamName){
                                            matchDB.findOne({name: teamFoundOld.matches[i].name}, function(err, foundMatch){
                                                if(err){

                                                }else{
                                                    if(foundMatch){
                                                        foundMatch.team1 = team.teamName;
                                                        foundMatch.save(function(err, savedObject){
                                                            if(err){
                                                                console.log("Error ::: Error while saving match changed name");
                                                                socket.emit("Error", {err : "Error ::: Error while saving match changed name"});
                                                            }else{
                                                                console.log("Save complete !!!! Team name changed matches saved");
                                                                newTeam.matches.push(savedObject);
                                                                newTeam.markModified("matches");
                                                            }
                                                        });
                                                    }
                                                }
                                            });
                                        }
                                        if(teamFoundOld.matches[i].team2 === teamFoundOld.teamName){
                                            matchDB.findOne({name: teamFoundOld.matches[i].name}, function(err, foundMatch){
                                                if(err){

                                                }else{
                                                    if(foundMatch){
                                                        foundMatch.team2 = team.teamName;
                                                        foundMatch.save(function(err, savedObject){
                                                            if(err){
                                                                console.log("Error ::: Error while saving match changed name");
                                                                socket.emit("Error", {err : "Error ::: Error while saving match changed name"});
                                                            }else{
                                                                console.log("Save complete !!!! Team name changed matches saved");
                                                                newTeam.matches.push(savedObject);
                                                            }
                                                        });
                                                    }
                                                }
                                            });
                                        }
                                    }

                                    newTeam.save(function(err){
                                        if(err){
                                            console.log("Error ::: while saving newteam");
                                            socket.emit("Error", {err : "Error ::: while saving newteam"});
                                        }else{
                                            teamDB.findOneAndRemove({teamName : oldTeam.teamName},function(err){
                                                if(err){
                                                    console.log("Error ::: while deleting oldTeam");
                                                    socket.emit("Error", {err : "Error ::: while deleting oldTeam"});
                                                }else{
                                                    console.log("Changed name : editTeam data saved");
                                                    socket.emit("ET_edit_team_success");
                                                }
                                            });
                                        }
                                    })
                                }else{
                                    console.log("Error ::: OldTeam cant be found");
                                    socket.emit("Error", {err : "Error ::: OldTeam cant be found"});
                                }
                            }
                        });
                    }
                }
            });
        }*/
    });

    //Deleting requested team
    socket.on("RT_delete_team",function(team){
        teamDB.findOne({teamName: team.teamName},function(err, foundObject){
            if(err){
                console.log("Error ::: "+ err.toString());
                socket.emit("Error", {err : "Error ::: No data found!"});
            }else{
                if(foundObject){
                    for(var i=0;i<foundObject.matches.length;i++){
                        matchDB.findOneAndRemove({index : foundObject.matches[i].index},function(err){
                            if(err){
                                console.log("Error ::: "+ err.toString());
                                socket.emit("Error", {err : "Error ::: Error while deleting match Data"});
                            }else{
                                console.log("Match removed");
                            }
                        })
                    }
                    foundObject.remove(function(err, object){
                        if(err){
                            console.log("Error ::: "+ err.toString());
                            socket.emit("Error", {err : "Error ::: Error while deleting team Data"});
                        }else{
                            console.log("Team deletion complete");
                            socket.emit("team_delete_done", object);
                        }
                    })
                }else{
                    console.log("Error ::: team not found");
                    socket.emit("Error", {err : "Error ::: team not found"});
                }
            }
        });
    });

    //Adding new match data
    socket.on("add_new_match",function(match){
        console.log(match);
        matchDB.findOne({index: match.index},function(err, matchFound){
            if(err){
                console.log("ERROR :: Server error : Error While saving newMatch object");
                socket.emit("Error", {err : "Error ::: Error While saving newMatch object"});
            }else{
                if(matchFound){
                    socket.emit("Error", {err : "Error ::: Match already exists"});
                }else{
                    teamDB.findOne({teamName: match.team01},function(err, teamFound1){
                        if(err){
                            console.log("ERROR :: Server error : Error While finding team01 object");
                            socket.emit("Error", {err : "ERROR :: Server error : Error While finding team01 object"});
                        }else{
                            if(teamFound1){
                                var matchObject = new matchDB();

                                matchObject.team1 = match.team01;
                                matchObject.team2 = match.team02;
                                matchObject.index = match.index;
                                matchObject.point1 = match.points01;
                                matchObject.point2 = match.points02;
                                matchObject.name = match.name;
                                matchObject.type = match.type;
                                matchObject.isPlayed = match.isPlayed;

                                teamFound1.matches.push(matchObject);

                                teamFound1.markModified('matches');

                                teamDB.findOne({teamName: match.team02},function(err, teamFound2){
                                    if(err){
                                        console.log("ERROR :: Server error : Error While finding team02 object");
                                        socket.emit("Error", {err : "ERROR :: Server error : Error While finding team02 object"});
                                    }else{
                                        if(teamFound2){
                                            teamFound2.matches.push(matchObject);
                                            teamFound2.markModified('matches');


                                            matchObject.save(function(err){
                                                if(err){
                                                    socket.emit("Error", {err : "Error ::: Error while saving match data"});
                                                }else{
                                                    teamFound1.save(function(err){
                                                        if(err){
                                                            console.log("ERROR :: Server error : Error While saving team01 object");
                                                            socket.emit("Error", {err : "ERROR :: Server error : Error While finding team01 object"});
                                                        }else{
                                                            teamFound1.save(function(err){
                                                                if(err){
                                                                    console.log("ERROR :: Server error : Error While saving team01 object");
                                                                    socket.emit("Error", {err : "ERROR :: Server error : Error While finding team01 object"});
                                                                }else{
                                                                    socket.emit("new_match_save");
                                                                    console.log("Saving Match Complete!!!!");
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }else{
                                            console.log("ERROR :: Server error : Error While finding team02 object");
                                            socket.emit("Error", {err : "ERROR :: Server error : Error While finding team02 object"});
                                        }
                                    }
                                });
                            }else{
                                console.log("ERROR :: Server error : Error While finding team01 object");
                                socket.emit("Error", {err : "ERROR :: Server error : Error While finding team01 object"});
                            }
                        }
                    });
                }
            }
        });
    });

    //Requesting match data
    socket.on("match_list_request",function(){
        matchDB.find({},function(err,foundData){
            if(err){
                console.log("Error ::: Error ::: Error while requesting team data");
                socket.emit("Error", {err : "Error ::: Error while requesting team data"});
            }else{
                for(var i=1;i<foundData.length;i++){
                    for(var j = foundData.length - 1; j > 0; j--){
                        if(foundData[j].index < foundData[j].index){
                            var temp = foundData[j];
                            foundData[j] = foundData[j-1];
                            foundData[j-1] = temp;
                        }
                    }
                }
                socket.emit("match_list_send",foundData);
            }
        });
    });

    //Editing Match Data
    socket.on("edit_match",function(match, newMatch){
        matchDB.findOne({index: match.index},function(err, foundMatch){
            if(err){
                console.log("Error ::: Error while finding match data");
                socket.emit("Error", {err : "Error ::: Error while finding match data"});
            }else{
                if(foundMatch){
                    teamDB.findOne({teamName: match.team1},function(err, oldTeam1){
                        if(err){
                            console.log("Error ::: Error while finding oldTeam1 data");
                            socket.emit("Error", {err : "Error ::: Error while finding oldTeam1 data"});
                        }else{
                            if(oldTeam1){
                                teamDB.findOne({teamName: match.team2},function(err, oldTeam2){
                                    if(err){
                                        console.log("Error ::: Error while finding oldTeam2 data");
                                        socket.emit("Error", {err : "Error ::: Error while finding oldTeam2 data"});
                                    }else{
                                        if(oldTeam2){
                                            teamDB.findOne({teamName: newMatch.team1},function(err, team1){
                                                if(err){
                                                    console.log("Error ::: Error while finding team1 data");
                                                    socket.emit("Error", {err : "Error ::: Error while finding team1 data"});
                                                }else{
                                                    if(team1){
                                                        teamDB.findOne({teamName: newMatch.team2},function(err, team2){
                                                            if(err){
                                                                console.log("Error ::: Error while finding team2 data");
                                                                socket.emit("Error", {err : "Error ::: Error while finding team2 data"});
                                                            }else{
                                                                if(team2){
                                                                    matchDB.findOne({index: newMatch.index},function(err,foundMatch){
                                                                        if(err){
                                                                            console.log("Error ::: Error while finding newMatch data");
                                                                            socket.emit("Error", {err : "Error ::: Error while finding newMatch data"});
                                                                        }else{
                                                                            if(match.index != newMatch.index){
                                                                                if(foundMatch){
                                                                                    console.log("Error ::: Match with same index already exists");
                                                                                    socket.emit("Error", {err : "Error ::: Match with same index already exists"});
                                                                                }else{
                                                                                    var foundMatch = new matchDB();

                                                                                    foundMatch.team1 = newMatch.team1;
                                                                                    foundMatch.team2 = newMatch.team2;
                                                                                    foundMatch.point1 = newMatch.point1;
                                                                                    foundMatch.point2 = newMatch.point2;
                                                                                    foundMatch.name = newMatch.name;
                                                                                    foundMatch.index = newMatch.index;
                                                                                    foundMatch.type = newMatch.type;
                                                                                    foundMatch.isPlayed = newMatch.isPlayed;

                                                                                    foundMatch.save(function(err, savedMatch){
                                                                                        if(err){
                                                                                            console.log("Error ::: Error While saving edited match");
                                                                                            socket.emit("Error", {err : "Error ::: Error while saving edited match"});
                                                                                        }else{
                                                                                            oldTeam1.matches.splice(oldTeam1.matches.indexOf(match),1);
                                                                                            oldTeam1.markModified('matches');
                                                                                            oldTeam2.matches.splice(oldTeam1.matches.indexOf(match),1);
                                                                                            oldTeam2.markModified('matches');

                                                                                            team1.matches.push(savedMatch);
                                                                                            team1.markModified('matches');
                                                                                            team2.matches.push(savedMatch);
                                                                                            team2.markModified('matches');

                                                                                            matchDB.findOne({index: match.index},function(err, foundMatchN){
                                                                                                if(err){
                                                                                                    console.log("Error ::: Error While finding old team to delete");
                                                                                                    socket.emit("Error", {err : "Error ::: Error While finding old team to delete"});
                                                                                                }else{
                                                                                                    if(foundMatchN){
                                                                                                        foundMatchN.remove(function(err){
                                                                                                            if(err){
                                                                                                                console.log("Error ::: Error While finding old team to delete");
                                                                                                                socket.emit("Error", {err : "Error ::: Error While finding old team to delete"});
                                                                                                            }
                                                                                                        })
                                                                                                    }
                                                                                                }
                                                                                            });

                                                                                            oldTeam1.save(function(err){
                                                                                                if(err){
                                                                                                    console.log("Error ::: Error While saving oldTeam1");
                                                                                                    socket.emit("Error", {err : "Error ::: Error while saving oldTeam1"});
                                                                                                }else{
                                                                                                    oldTeam2.save(function(err){
                                                                                                        if(err){
                                                                                                            console.log("Error ::: Error While saving oldTeam2");
                                                                                                            socket.emit("Error", {err : "Error ::: Error while saving oldTeam2"});
                                                                                                        }else{
                                                                                                            team1.save(function(err){
                                                                                                                if(err){
                                                                                                                    console.log("Error ::: Error While saving team1");
                                                                                                                    socket.emit("Error", {err : "Error ::: Error while saving team1"});
                                                                                                                }else{
                                                                                                                    team2.save(function(err){
                                                                                                                        if(err){
                                                                                                                            console.log("Error ::: Error While saving team2");
                                                                                                                            socket.emit("Error", {err : "Error ::: Error while saving team2"});
                                                                                                                        }else{
                                                                                                                            socket.emit("edit_match_save");
                                                                                                                            console.log("Edit match completed successfully");
                                                                                                                        }
                                                                                                                    });
                                                                                                                }
                                                                                                            });
                                                                                                        }
                                                                                                    });
                                                                                                }
                                                                                            });
                                                                                        }
                                                                                    })
                                                                                }
                                                                            }else{
                                                                                foundMatch.team1 = newMatch.team1;
                                                                                foundMatch.team2 = newMatch.team2;
                                                                                foundMatch.point1 = newMatch.point1;
                                                                                foundMatch.point2 = newMatch.point2;
                                                                                foundMatch.name = newMatch.name;
                                                                                foundMatch.index = newMatch.index;
                                                                                foundMatch.type = newMatch.type;
                                                                                foundMatch.isPlayed = newMatch.isPlayed;

                                                                                foundMatch.save(function(err, savedMatch){
                                                                                    if(err){
                                                                                        console.log("Error ::: Error While saving edited match");
                                                                                        socket.emit("Error", {err : "Error ::: Error while saving edited match"});
                                                                                    }else{
                                                                                        oldTeam1.matches.splice(oldTeam1.matches.indexOf(match),1);
                                                                                        oldTeam1.markModified('matches');
                                                                                        oldTeam2.matches.splice(oldTeam1.matches.indexOf(match),1);
                                                                                        oldTeam2.markModified('matches');

                                                                                        team1.matches.push(savedMatch);
                                                                                        team1.markModified('matches');
                                                                                        team2.matches.push(savedMatch);
                                                                                        team2.markModified('matches');

                                                                                        oldTeam1.save(function(err){
                                                                                            if(err){
                                                                                                console.log("Error ::: Error While saving oldTeam1");
                                                                                                socket.emit("Error", {err : "Error ::: Error while saving oldTeam1"});
                                                                                            }else{
                                                                                                oldTeam2.save(function(err){
                                                                                                    if(err){
                                                                                                        console.log("Error ::: Error While saving oldTeam2");
                                                                                                        socket.emit("Error", {err : "Error ::: Error while saving oldTeam2"});
                                                                                                    }else{
                                                                                                        team1.save(function(err){
                                                                                                            if(err){
                                                                                                                console.log("Error ::: Error While saving team1");
                                                                                                                socket.emit("Error", {err : "Error ::: Error while saving team1"});
                                                                                                            }else{
                                                                                                                team2.save(function(err){
                                                                                                                    if(err){
                                                                                                                        console.log("Error ::: Error While saving team2");
                                                                                                                        socket.emit("Error", {err : "Error ::: Error while saving team2"});
                                                                                                                    }else{
                                                                                                                        socket.emit("edit_match_save");
                                                                                                                        console.log("Edit match completed successfully");
                                                                                                                    }
                                                                                                                });
                                                                                                            }
                                                                                                        });
                                                                                                    }
                                                                                                });
                                                                                            }
                                                                                        });
                                                                                    }
                                                                                })
                                                                            }
                                                                        }
                                                                    });
                                                                }
                                                            }
                                                        });
                                                    }
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    });

    //Deleting Match Data
    socket.on("delete_match",function(match){
        matchDB.findOne({index: match.index},function(err,foundMatch){
            if(err){
                console.log("Error ::: Error while finding match data");
                socket.emit("Error", {err : "Error ::: Error while finding match data"});
            }else{
                if(foundMatch){
                    teamDB.findOne({teamName: foundMatch.team1},function(err, team1){
                        if(err){
                            console.log("Error ::: Error while finding team1 data");
                            socket.emit("Error", {err : "Error ::: Error while finding team1 data"});
                        }else{

                            if(team1){
                                teamDB.findOne({teamName: foundMatch.team2},function(err, team2){
                                    if(err){
                                        console.log("Error ::: Error while finding team1 data");
                                        socket.emit("Error", {err : "Error ::: Error while finding team1 data"});
                                    }else{
                                        team1.matches.slice(team1.matches.indexOf(foundMatch),1);
                                        team1.markModified("matches");
                                        if(team2){
                                            team2.matches.slice(team2.matches.indexOf(foundMatch),1);
                                            team2.markModified("matches");

                                            foundMatch.remove(function(err){
                                                if(err){
                                                    console.log("Error ::: Error while removing match data");
                                                    socket.emit("Error", {err : "Error ::: Error ::: Error while removing match data"});
                                                }else{
                                                    //Reset Played and other values
                                                    if(Number(foundMatch.point1) > Number(foundMatch.point2)){
                                                        //TODO ::: Change this value according to the points given
                                                        team1.points -= 2;

                                                        team1.won -= 1;
                                                        team2.lost -= 1;

                                                    }else if(Number(foundMatch.point1) < Number(foundMatch.point2)){
                                                        team2.won -= 1;
                                                        team1.lost -= 1;

                                                        //TODO ::: Change this value according to the points given
                                                        team2.points -= 2;
                                                    }else{
                                                        team1.draw -= 1;
                                                        team2.draw -= 1;

                                                        //TODO ::: Change this value according to the points given
                                                        team1.points -= 1;
                                                        team2.points -= 1;
                                                    }

                                                    team1.totalTries -= foundMatch.point1;
                                                    team2.totalTries -= foundMatch.point2;

                                                    team1.tryAgainst -= team2.totalTries;
                                                    team2.tryAgainst -= team1.totalTries;

                                                    var team2score= parseInt(foundMatch.point2);
                                                    var team1score = parseInt(foundMatch.point1);

                                                    team1.triesAgainst -= team2score;
                                                    team2.triesAgainst -= team1score;

                                                    team1.played -= 1;
                                                    team2.played -= 1;


                                                    team1.save(function(err){
                                                        if(err){
                                                            console.log("Error ::: Error while saving team1 data");
                                                            socket.emit("Error", {err : "Error ::: Error ::: Error while saving team1 data"});
                                                        }else{
                                                            team2.save(function(err){
                                                                if(err){
                                                                    console.log("Error ::: Error while saving team2 data" + err.toString());
                                                                    socket.emit("Error", {err : "Error ::: Error ::: Error while saving team2 data"});
                                                                }else{
                                                                    console.log("Delete match Complete");
                                                                    socket.emit("delete_match_complete");
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    });

    //Sending Data to the monitor
    socket.on("update_monitor",function(monitor){
        var data = monitor;

        if(data.match) {
            if (data.match.team1) {
                teamDB.findOne({teamName: data.match.team1}, function (err, foundData) {
                    if (err) {
                        console.log("Error ::: Error while finding team1 data");
                        socket.emit("Error", {err: "Error ::: Error while finding team1 data"});
                    } else {
                        if (foundData) {
                            for(var i=0;i<monitors.length;i++){
                                if(monitors[i].name == data.name){
                                    monitors[i].emit("update_team1",foundData);
                                    console.log("Team1 Data Send to : " + monitors[i].name);
                                }
                            }
                        } else {
                            console.log("Error ::: Cant find team1 data");
                            socket.emit("Error", {err: "Error ::: Cant find team1 data"});
                        }
                    }
                });

            }

            if (data.match.team2) {
                teamDB.findOne({teamName: data.match.team2}, function (err, foundData2) {
                    if (err) {
                        console.log("Error ::: Error while finding team2 data");
                        socket.emit("Error", {err: "Error ::: Error while finding team2 data"});
                    } else {
                        if (foundData2) {
                            for(var i=0;i<monitors.length;i++){
                                if(monitors[i].name == data.name){
                                    monitors[i].emit("update_team2",foundData2);
                                    console.log(foundData2);
                                    console.log("Team2 Data Send to : " + data.name);
                                }
                            }
                        } else {
                            console.log("Error ::: Cant find team2 data");
                            socket.emit("Error", {err: "Error ::: Cant find team2 data"});
                        }
                    }
                });

            }
        }

        matchDB.find({}).lean().exec(function(err,foundData){
            if(err){
                console.log("Error ::: Error while finding match data");
                socket.emit("Error", {err : "Error ::: Error while finding match data"});
            }else{
                if(foundData){
                    for(var i=1;i<foundData.length;i++){
                        for(var j = foundData.length - 1; j > 0; j--){
                            if(foundData[j].index < foundData[j].index){
                                var temp = foundData[j];
                                foundData[j] = foundData[j-1];
                                foundData[j-1] = temp;
                            }
                        }
                    }
                    data.fixtures = [];

                    if(foundData.length <= 12){
                        data.fixtures = foundData;
                    }else if(data.match){
                        var k;
                        var l;

                        if(data.match.index > 6){
                            for(k=data.match.index;k<=data.match.index+6;k++){
                                data.fixtures.push(foundData[k]);
                            }
                            for(l=data.match.index-1;l>data.match.index-6;l--){
                                data.fixtures.push(foundData[l]);
                            }

                        }else if(data.match.index < 6){

                            for(k=1;k<=data.match.index;k++){
                                data.fixtures.push(foundData[k]);
                            }

                            for(l=data.match.index+1;l<data.match.index+6;l++){
                                data.fixtures.push(foundData[l]);
                            }

                        }else if(foundData.length - 6 < data.match.index){

                            for(k=foundData.length;k>=data.match.index;k--){
                                data.fixtures.push(foundData[k]);
                            }

                            for(l=data.match.index - (12 - (foundData.length - data.match.index));l<data.match.index+6;l++){
                                data.fixtures.push(foundData[l]);
                            }

                        }
                    }

                    // data.fixtures.sort(function(a, b) {
                    //     var textA = a.group.toUpperCase();
                    //     var textB = b.group.toUpperCase();
                    //     return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                    // });
                    //
                    // data.fixtures.sort(function(a,b){
                    //     var team1 = a.group.toUpperCase();
                    //     var textB = b.group.toUpperCase();
                    //     if()
                    // });
                    //
                    // data.groups = {};
                    //
                    // for(var n=0;n<data.fixtures.length;n++){
                    //     data.groups[data.fixtures[n].group]
                    // }


                    for(var m=0;m<monitors.length;m++){
                        if(monitors[m].name == data.name){
                            monitors[m].emit("update_fixtures", data);
                            console.log("Fixture Data Send to : " + monitors[m].name);
                        }
                    }

                }else{
                    console.log("Error ::: Error can't find fixture data");
                    socket.emit("Error", {err : "Error ::: Error can't find fixture data"});
                }
            }

        });

        for(var i=0;i<monitors.length;i++){
            if(monitors[i].name == data.name){
                monitors[i].emit("monitor_data",data);
                console.log("State change : " + data.state);
            }
        }
    });

    socket.on("update_time", function(data){
        var monitor;

        console.log("Time Changing Sequence");

        for(var i=0;i<monitors.length;i++){
            monitors[i].emit("update_time",data);
        }
    });

    socket.on("pause_timer",function () {
        for(var i=0; i<monitors.length; i++){
            monitors[i].emit("pause_timer");
        }
    });

    socket.on("resume_timer",function () {
        for(var i=0; i<monitors.length; i++){
            monitors[i].emit("resume_timer");
        }
    });

    socket.on("update_scoreboard_data",function(data){
        for(var i=0;i<monitors.length;i++){
            monitors[i].emit("update_scoreboard_data",data);
        }
    });

    socket.on("final_score",function (data) {

        teamDB.findOne({teamName: data.team1},function (err,team1) {
            if(err){
                console.log("Error ::: Error while finding team1 data");
                socket.emit("Error", {err : "Error ::: Error while finding team1 data"});
            }else{
                if(team1){
                    teamDB.findOne({teamName: data.team2},function (err,team2) {
                        if(err){
                            console.log("Error ::: Error while finding team2 data");
                            socket.emit("Error", {err : "Error ::: Error while finding team2 data"});
                        }else{
                            if(team2){
                                if(Number(data.point1) > Number(data.point2)){
                                    //TODO ::: Change this value according to the points given
                                    team1.points += 2;

                                    team1.won += 1;
                                    team2.lost += 1;

                                }else if(Number(data.point1) < Number(data.point2)){
                                    team2.won += 1;
                                    team1.lost += 1;

                                    //TODO ::: Change this value according to the points given
                                    team2.points += 2;
                                }else{
                                    team1.draw += 1;
                                    team2.draw += 1;

                                    //TODO ::: Change this value according to the points given
                                    team1.points += 1;
                                    team2.points += 1;
                                }

                                team1.totalTries = parseInt(team1.totalTries) + parseInt(data.point1);
                                team2.totalTries = parseInt(team2.totalTries) + parseInt(data.point2);

                                var team2score= parseInt(data.point2);
                                var team1score = parseInt(data.point1);

                                team1.triesAgainst += team2score;
                                team2.triesAgainst += team1score;

                                team1.played += 1;
                                team2.played += 1;


                                team1.save(function(err){
                                    if(err){
                                        console.log("Error ::: while saving team1 data" + err);
                                        socket.emit("Error", {err : "Error ::: while saving team1 data"});
                                    }else{
                                        team2.save(function (err) {
                                            if(err){
                                                console.log("Error ::: while saving team1 data");
                                                socket.emit("Error", {err : "Error ::: while saving team1 data"});
                                            }else{
                                                socket.emit("finalize_match_complete");
                                            }
                                        })
                                    }
                                });
                            }else{
                                console.log("Error ::: team2 data not found");
                                socket.emit("Error", {err : "Error ::: team2 data not found"});
                            }
                        }
                    });
                }else{
                    console.log("Error ::: team1 data not found");
                    socket.emit("Error", {err : "Error ::: team1 data not found"});
                }
            }
        })
    });

    socket.on("group_data",function(){
        teamDB.find({}).lean().exec(function(err,foundData){
            if(err){

            }else{
                if(foundData){
                    foundData.sort(function(a, b) {
                        var textA = a.group.toUpperCase();
                        var textB = b.group.toUpperCase();
                        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                    });

                    var group = {};

                    for(var j=0;j<foundData.length;j++){
                        group[foundData[j].group] = [];
                    }

                    for(var i=0;i<foundData.length;i++){
                        group[foundData[i].group].push(foundData[i]);
                    }

                    for(var k=0;k<foundData.length;k++){
                        group[foundData[k].group].sort(function(a,b) {
                                if (a.points < b.points)
                                    return -1;
                                if (a.points > b.points)
                                    return 1;
                                return 0;
                        });
                    }

                    for(var l=0;k<foundData.length;l++){
                        group[foundData[l].group].sort(function(a,b) {
                            if (a.points < b.points) {
                                return -1;
                            }
                            if (a.points > b.points) {
                                return 1;
                            }
                            if(a.points===b.points){
                                if((parseInt(a.totalTries)- parseInt(a.triesAgainst)) < (parseInt(b.totalTries)- parseInt(b.triesAgainst))){
                                    return -1;
                                }
                                if(parseInt(a.totalTries)- parseInt(a.triesAgainst) < (parseInt(b.totalTries)- parseInt(b.triesAgainst))){
                                    return 1;
                                }
                                if(parseInt(a.totalTries)- parseInt(a.triesAgainst) === (parseInt(b.totalTries)- parseInt(b.triesAgainst))){
                                    if(a.totalTries < b.totalTries){
                                        return -1;
                                    }
                                    if(a.totalTries > b.totalTries){
                                        return 1;
                                    }
                                    if(a.totalTries === b.totalTries){
                                        if(a.triesAgainst > b.triesAgainst){
                                            return -1;
                                        }
                                        if(a.triesAgainst < b.triesAgainst){
                                            return 1;
                                        }
                                        if(a.triesAgainst === b.triesAgainst){
                                            if(a.played < b.played){
                                                return -1;
                                            }
                                            if(a.played < b.played){
                                                return 1;
                                            }
                                            if(a.played === b.played){
                                                if(a.teamName.toUpperCase() < b.teamName.toUpperCase()){
                                                    return -1;
                                                }
                                                if(a.teamName.toUpperCase() < b.teamName.toUpperCase()){
                                                    return 1;
                                                }
                                                return 0;
                                            }
                                        }
                                    }
                                }
                            }
                            console.log("Oops : Something wrong in the Sort");
                            return 0;
                        });
                    }


                    for(var m=0;m<monitors.length;m++){
                            socket.emit("group_data_send",group);
                            console.log("Group Data Send");
                    }
                }
            }
        });
    });
});


//Running the server
console.log("\x1b[32m","Server Tagby 7's running on : " + ip + ":" + port.toString(),"\x1b[37m");
server.listen(port,ip);