/**
 * Created by Lasantha Madushan on 8/19/2017.
 */

var app = angular.module("IdeApp",[]);
var socket;
var state = "Data Control";
var error = false;
var errorData = "";
var monitorList;
var monitorState = "none";

var mcInterval;

//Error handler
function errorHandler(){
   if(error){
      $("#EH").css("display","block");
   }else{
      $("#EH").css("display","none");
   }
}


//Update Screen
function updateScreen(){
   if(state === "Data Control"){
      $("#DC").css("display","block");
   }else{
      $("#DC").css("display","none");
   }

   if(state === "Monitor Control"){
      $("#MC").css("display","block");
      socket.emit("MC_load");
      mcInterval = setInterval(function(){
          if(!error) {
              socket.emit("MC_load");
          }
      },2000)
   }else{
      $("#MC").css("display","none");
        if(mcInterval !== undefined) {
            clearInterval(mcInterval);
        }
   }

   if(state === "Edit Team"){
      $("#ET").css("display","block");
   }else{
      $("#ET").css("display","none");
   }

   if(state === "Edit Matches"){
      $("#EM").css("display","block");
   }else{
      $("#EM").css("display","none");
   }
}

var mySocket;

//Socket Arithmetic
$(function(){
   socket = io.connect();
   mySocket = socket;
   socket.emit("Register_controller");

   socket.on("registered",function(){
      console.log("Registration Complete!!");
   });

   socket.on("Error",function(data){
      error = true;
      var preState = state;
      errorHandler();
      errorData = data.err;
      $(".errorClick").trigger("click");
      setTimeout(function(){
          error = false;
          errorHandler();
      },6000);
   });

   //When Changes happen in monitors
    socket.on("MC_monitor_list", function (monitor_list) {
        monitorList = monitor_list;
        $(".clickMe").trigger("click");
    });

    socket.on("Monitor_disconnected", function(data){
        alert("Monitor Disconnected Monitor name :'"+ data +"'\nPlease Check!!");
        console.log("Disconnected Monitor : " + data);
        socket.emit("MC_load");
    });
});


errorHandler();
updateScreen();


$(".nav-link").click(function(){
   $(".nav-link").removeClass("active");
   $(this).addClass("active");
   state = $(this).text();
   updateScreen();
});


//Angular functions

app.controller("DataControl",function($scope){
   $scope.hello = "Hello from DataControl";


});

app.controller("MonitorCtrl",function($scope){
    $scope.monitorGet = function(){
        $scope.monitors = monitorList;
    };

    $scope.clickOn = function(newState,obj){
        monitorList[monitorList.indexOf(obj)].state = newState;
        mySocket.emit("MC_change_state", obj);
    }

    $scope.setStateClass = function(state){
        var retClass;
        if(state === "Start Screen"){
            retClass = ""
        }else if(state === "Scoreboard"){
            retClass = "alert-primary"
        }else if(state === "Next Match"){
            retClass = "alert-success"
        }else if(state === "2 Team Lineup"){
            retClass = "alert-warning"
        }else if(state === "Team Formation"){
            retClass = "alert-info"
        }else if(state === "Match Fixtures"){
            retClass = "alert-danger"
        }

        return retClass;
    }
});

app.controller("EditTeam",function($scope){
   $scope.hello = "Hello from EditTeam";
});

app.controller("EditMatches",function($scope){
   $scope.hello = "Hello from EditMatches";
});

app.controller("ErrorControl",function($scope){
   $scope.error = errorData;

   $scope.getError = function(){
      $scope.error = errorData;
   };
});