/**
 * Created by Lasantha Madushan on 8/19/2017.
 * Server of Tagby 7's 2K17
 */

var ip = "127.0.0.1";
var port = 4505;
var express = require("express");
var app = express();
http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var mongoose = require("mongoose");

var  teamDB = require("./models/team.js");
var  matchDB = require("./models/match.js");


//Socket arrays
monitors = [];
connections = [];
controllers = [];

//For controller usage
var monitor_list = [];

//Timer
function startTimer(duration, display) {
    var start = Date.now(),
        diff,
        minutes,
        seconds;

    function timer() {
        // get the number of seconds that have elapsed since
        // startTimer() was called
        diff = duration - (((Date.now() - start) / 1000) | 0);

        // does the same job as parseInt truncates the float
        minutes = (diff / 60) | 0;
        seconds = (diff % 60) | 0;

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (diff <= 0) {
            // add one second so that the count down starts at the full duration
            // example 05:00 not 04:59
            start = Date.now() + 1000;
        }
    }

    // we don't want to wait a full second before the timer starts
    timer();
    setInterval(timer, 1000);
}

app.use(express.static(__dirname +'/web'));


app.get("/rest/controller",function(req,res){
    res.json({hello:"Hello"});
});

//Connecting sockets with socket.io
io.sockets.on("connection",function(socket){
    connections.push(socket);
    console.log("Connected ::: %s sockets connected", connections.length);

    socket.on("Register_controller",function(){
       controllers.push(socket);
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
                console.log("triggered");
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
    })

    socket.on('MC_change_state',function(data){
        for(var i = 0;i< monitor_list.length;i++){
            if(monitor_list[i].name === data.name){
                monitor_list[i].state = data.state;
                console.log("Object found to change state");
            }
        }
        socket.emit("MC_monitor_list",monitor_list);
    })
});


//Running the server
console.log("\x1b[32m","Server Tagby 7's running on : " + ip + ":" + port.toString(),"\x1b[37m");
server.listen(port,ip);