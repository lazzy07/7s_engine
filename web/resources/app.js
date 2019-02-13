/**
 * Created by Lasantha Madushan on 8/19/2017.
 */

var app = angular.module("IdeApp",[]);
var socket;
var state = "Data Control";
var error = false;
var errorData = "";
var monitorList;

var selectedTeamEdit = {};
var selectedMatchEdit = {};

var stack;

var teamList;
var matchList;

var editTeamState = "Def";
var editMatchState = "Def";

var timerPause = false;
var matchChange;
var nowMatch;

var timeCount;

var timerMin, timerSec;

var recivedGroups;
var groupAvailable;


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

        timerMin = minutes;
        timerSec = seconds;

        if (diff <= 0) {
            // add one second so that the count down starts at the full duration
            // example 05:00 not 04:59
            //start = Date.now() + 1000;
            clearInterval(timeCount);
        }
    }

    // we don't want to wait a full second before the timer starts
    timer();

    timeCount  = setInterval(timer, 1000);
}

//Error handler
function errorHandler(){
   if(error){
      $("#EH").css("display","block");
   }else{
      $("#EH").css("display","none");
   }
}

function editTeamScreen(){
    if(editTeamState === "Def"){
        $(".addTeamsJumbo").css("display", "block");
        $(".editTeamsJumbo").css("display", "block");
        $("#ediTeamNav").css("display", "none");
    }else{
        $(".addTeamsJumbo").css("display", "none");
        $(".editTeamsJumbo").css("display", "none");
        $("#ediTeamNav").css("display", "block");
    }

    if(editTeamState === "Add team"){
        $("#AddT").css("display", "block");
        $("#ediTeamNav").css("display", "block");
    }else{
        $("#AddT").css("display", "none");
    }

    if(editTeamState === "Edit team"){
        $("#EditT").css("display", "block");
    }else{
        $("#EditT").css("display", "none");
    }
}

function editMatchesScreen(){
    if(editMatchState === "Def"){
        $(".addMatchesJumbo").css("display", "block");
        $(".editMatchesJumbo").css("display", "block");
        $("#ediMatchNav").css("display", "none");
    }else{
        $(".addMatchesJumbo").css("display", "none");
        $(".editMatchesJumbo").css("display", "none");
        $("#ediMatchNav").css("display", "block");
    }

    if(editMatchState === "Add Match"){
        $("#addMatch").css("display", "block");
    }else{
        $("#addMatch").css("display", "none");
    }

    if(editMatchState === "Edit Match"){
        $("#editMatch").css("display", "block");
    }else{
        $("#editMatch").css("display", "none");
    }

    if(editMatchState === "Match List"){
        $("#matchList").css("display", "block");
    }else {
        $("#matchList").css("display", "none");
    }
}


//Team Arithmetic
$(".btnEditT").click(function(){
    editTeamState = "Edit team";
    editTeamScreen();
    mySocket.emit("team_list_request");
});

$(".btnAddT").click(function(){
    editTeamState = "Add team";
    editTeamScreen();
});

$(".btnBackET").click(function(){
    editTeamState = "Def";
    editTeamScreen();
});



//Matches Arithmetic
$(".btnAddM").click(function(){
    mySocket.emit("team_list_request");
    $(".editMatchesClick").trigger("click");
    editMatchState = "Add Match";
    editMatchesScreen();
});

$(".btnEditM").click(function(){
    editMatchState = "Match List";
    editMatchesScreen();
    mySocket.emit("team_list_request");
    mySocket.emit("match_list_request");
    $(".editMatchesClick").trigger("click");
});

$("#ediMatchNav").click(function(){
    if(editMatchState === "Match List" || editMatchState === "Add Match"){
        editMatchState = "Def";
        editMatchesScreen();
    }else if(editMatchState === "Edit Match"){
        editMatchState = "Match List";
    }
});

$(".matchTypeSelA").click(function(){
    $(".matchTypeSel").text($(this).text());
});

$(".matchTypeSelAE").click(function(){
    $(".matchTypeSelE").text($(this).text());
});

$(".updateML").click(function(){
    socket.emit("MC_load");
});

//Update Screen
function updateScreen(){
    $(".successEditAlert").css("display","none");
    $("#doneSavingNewAlert").css("display","none");
    $("#edoneSavingEditAlert").css("display","none");
    $(".errorEditMatch").css("display", "none");

   if(state === "Data Control"){
      $("#DC").css("display","block");
   }else{
      $("#DC").css("display","none");
   }

   if(state === "Monitor Control"){
      $("#MC").css("display","block");
      socket.emit("MC_load");
      socket.emit("team_list_request");
      socket.emit("match_list_request");
      socket.emit("group_data");
   }else{
      $("#MC").css("display","none");
   }

   if(state === "Edit Team"){
      $("#ET").css("display","block");
      editTeamScreen();

   }else{
      $("#ET").css("display","none");
   }

   if(state === "Edit Matches"){
      $("#EM").css("display","block");
      editMatchesScreen();
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
       mySocket.emit("team_list_request");
       mySocket.emit("match_list_request");
       mySocket.emit("group_data");
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



    socket.on("ET_new_team_success",function () {
        $("#teamName").val('');
        $("#teamFaculty").val('');
        $("#teamGroup").val('');
        $("#teamBatch").val('');

        $("#teamPlayer1").val('');
        $("#teamPlayer2").val('');
        $("#teamPlayer3").val('');
        $("#teamPlayer4").val('');
        $("#teamPlayer5").val('');
        $("#teamPlayer6").val('');
        $("#teamPlayer7").val('');
        $("#teamPlayer8").val('');
        $("#isFemale").find('span').removeClass('checked');

        $("#doneSavingNewAlert").css("display","block");

        setTimeout(function () {
            $("#doneSavingNewAlert").css("display","none");
        },6000);

    });

    socket.on("team_list_send",function(teamsObject){
        teamList = teamsObject;
        $(".clickEditTeam").trigger("click");
        $(".editMatchesClick").trigger("click");
    });

    socket.on("ET_edit_team_success", function(){
        /*
        $("#eteamName").val('');
        $("#eteamFaculty").val('');
        $("#eteamGroup").val('');
        $("#eteamBatch").val('');

        $("#eteamPlayer1").val('');
        $("#eteamPlayer2").val('');
        $("#eteamPlayer3").val('');
        $("#eteamPlayer4").val('');
        $("#eteamPlayer5").val('');
        $("#eteamPlayer6").val('');
        $("#eteamPlayer7").val('');
        $("#eteamPlayer8").val('');
        $("#eisFemale").find('span').removeClass('checked');
        */



        $("#edoneSavingEditAlert").css("display","block");

        $(".clickEditTeam").trigger("click");
        $(".editMatchesClick").trigger("click");

        editTeamState = "Def";
        editTeamScreen();

        setTimeout(function () {
            $("#edoneSavingEditAlert").css("display","none");
        },6000);
    });

    socket.on("team_delete_done",function(object){
        editTeamState = "Edit team";
        editTeamScreen();
        mySocket.emit("team_list_request");

        $("#eteamName").val('');
        $("#eteamFaculty").val('');
        $("#eteamGroup").val('');
        $("#eteamBatch").val('');

        $("#eteamPlayer1").val('');
        $("#eteamPlayer2").val('');
        $("#eteamPlayer3").val('');
        $("#eteamPlayer4").val('');
        $("#eteamPlayer5").val('');
        $("#eteamPlayer6").val('');
        $("#eteamPlayer7").val('');
        $("#eteamPlayer8").val('');
        $("#eisFemale").find('span').removeClass('checked');

        //teamList.splice(teamList.indexOf(object),1);
    });


    //Matches socket
    socket.on("match_list_send",function(matchesObject){
        matchList = matchesObject;
        $(".editMatchesClick").trigger("click");
        $(".dataClick").trigger("click");
    });

    socket.on("new_match_save",function(){
        $(".team1listDropBtn").text("Team 01");
        $(".team2listDropBtn").text("Team 02");
        $(".matchTypeSel").text("Match Type");
        $(".matchIndex").val("");
        $(".matchName").val("");

        $(".pointsTeam1").val("");
        $(".pointsTeam2").val("");
    });

    socket.on("edit_match_save",function(){
        $(".successEditAlert").css("display","block");
        setTimeout(function(){
            $(".successEditAlert").css("display","none");
        },6000);
    });

    socket.on("delete_match_complete",function(){
        editMatchState = "Def";
        editMatchesScreen();
    });

    socket.on("group_data_send",function(groupData){
        recivedGroups = groupData;
        groupAvailable = Object.keys(recivedGroups);
        $(".clickMe").trigger("click");
    })
});

errorHandler();
updateScreen();

setInterval(function(){
    if(state === "Data Control"){
        mySocket.emit("team_list_request");
        $(".dataClick").trigger("click");
    }
},1000);



$(".nav-link").click(function(){
   $(".nav-link").removeClass("active");
   $(this).addClass("active");
   state = $(this).text();
   updateScreen();
});


//Angular functions
app.controller("DataControl",function($scope){
    $scope.update = function(){
        $scope.matches = matchList;
    };

    $scope.changeClass = function(){
        $(".matchSelector").removeClass("active");
        $scope.class = "active";
    };

    $scope.selectMatch = function(match){
        matchChange = match;
        $(".team1Playing").text(match.team1);
        $(".team2Playing").text(match.team2);
        nowMatch = match.name;
    };
});

app.controller("MonitorCtrl",function($scope){

    var interval;
    var closeAt;
    var timerStart = true;

    $scope.stack = {};

    $scope.monitorGet = function(){
        $scope.monitors = monitorList;
        $scope.matches = matchList;
        $scope.teams = teamList;

        $scope.groupAvailable = groupAvailable;
        $scope.groups = recivedGroups;


        for(var i=0;i<$scope.monitors.length;i++){
            $scope.monitors[i].matchSelectorName = "Select Match";
            $scope.monitors[i].teamSelectorName = "Select Team";
            $scope.monitors[i].groupName = "Select Group";
            if(!$scope.stack[$scope.monitors[i].name]){
                $scope.stack[$scope.monitors[i].name] = [];
            }
        }
    };

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
    };

    $scope.teamSelect = function(team, monitorIndex){
        $scope.monitors[monitorIndex].team = team;
        $scope.monitors[monitorIndex].teamSelectorName = team.teamName;
    };

    $scope.clickOn = function(newState,obj){
        monitorList[monitorList.indexOf(obj)].state = newState;
        if($scope.selectedGroup){
            monitorList[monitorList.indexOf(obj)].group = recivedGroups[$scope.selectedGroup];
        }

        //Adding Stack data to an object and push it to the stack array
        var newDiv = {};
        newDiv.mName = $scope.monitors[monitorList.indexOf(obj)].name;
        newDiv.duration = $scope.monitors[monitorList.indexOf(obj)].duration;
        newDiv.fDuration = $scope.monitors[monitorList.indexOf(obj)].fDuration;
        newDiv.sDuration = $scope.monitors[monitorList.indexOf(obj)].sDuration;
        newDiv.team = $scope.monitors[monitorList.indexOf(obj)].team;
        newDiv.match = $scope.monitors[monitorList.indexOf(obj)].match;
        newDiv.state = newState;

        newDiv.close = "x";

        //TODO : Add conditionals Here if wrong show an error
        $scope.stack[obj.name].push(newDiv);



        mySocket.emit("MC_change_state", obj);
    };

    $scope.matchSelect = function(match, monitorIndex){
        $scope.monitors[monitorIndex].match = match;
        $scope.monitors[monitorIndex].matchSelectorName = match.name + " : " + match.team1 + " vs " + match.team2;

    };

    $scope.removeDiv = function(name ,index){
        $scope.stack[name].splice(index,1);
    };

    $scope.execStack = function(name, monitor){
        mySocket.emit("update_monitor", monitor);
        mySocket.emit("group_data_send", monitor);

        interval = setInterval(function(){
            if($scope.stack[name][0]) {
                if ($scope.stack[name][0].duration) {
                    if(timerStart) {
                        console.log("Triggered");

                        closeAt = setTimeout(function () {
                            $scope.stack[name].splice(0, 1);
                            $(".clickMe").trigger("click");
                            timerStart = true;
                        }, $scope.stack[name][0].duration);
                        timerStart = false;
                    }
                }
            }
        },10)
    };

    $scope.groupSelect = function(group, monitorIndex){
        $scope.monitors[monitorIndex].groupName = group;
        $scope.selectedGroup = group;
    }

});

app.controller("EditTeam",function($scope){
    $scope.update = function () {
        $scope.teams = teamList;

    };

    $scope.show = function(){
        console.log($scope.teams);
    };

    $scope.selectTeam = function(team){
        $scope.teamSelected = team;
    };
});

app.controller("EditMatches",function($scope){
    $scope.update = function(){
        $scope.matches = matchList;
        $scope.teams = teamList;
    };

    $scope.selectTeam = function(match){
        $scope.matchSelected = match;
        selectedMatchEdit = match;

        editMatchState = "Edit Match";

        $(".team1listDropBtnE").text(selectedMatchEdit.team1);
        $(".team2listDropBtnE").text(selectedMatchEdit.team2);
        $(".matchTypeSelE").text(selectedMatchEdit.type);
        $(".matchIndexE").val(selectedMatchEdit.index);
        $(".matchNameE").val(selectedMatchEdit.name);

        $(".pointsTeam1E").val(selectedMatchEdit.point1);
        $(".pointsTeam2E").val(selectedMatchEdit.point2);

        editMatchesScreen();
    };

    $scope.changeLabel = function(label,name){
        $(label).text(name);
    };
});

app.controller("ErrorControl",function($scope){
   $scope.error = errorData;

   $scope.getError = function(){
      $scope.error = errorData;
   };
});


//Submit Forum Data
$(".btnSubmitAddTeam").click(function(){
    var team = {};

    team.teamName = $("#teamName").val();
    team.teamFaculty = $("#teamFaculty").val();
    team.teamGroup = $("#teamGroup").val();
    team.teamBatch = $("#teamBatch").val();

    team.teamPlayer1 = {};
    team.teamPlayer2 = {};
    team.teamPlayer3 = {};
    team.teamPlayer4 = {};
    team.teamPlayer5 = {};
    team.teamPlayer6 = {};
    team.teamPlayer7 = {};
    team.teamPlayer8 = {};

    team.teamPlayer1.name = $("#teamPlayer1").val();
    team.teamPlayer2.name = $("#teamPlayer2").val();
    team.teamPlayer3.name = $("#teamPlayer3").val();
    team.teamPlayer4.name = $("#teamPlayer4").val();
    team.teamPlayer5.name = $("#teamPlayer5").val();
    team.teamPlayer6.name = $("#teamPlayer6").val();
    team.teamPlayer7.name = $("#teamPlayer7").val();
    team.teamPlayer8.name = $("#teamPlayer8").val();

    team.isFemale = $("#isFemale").prop('checked');

    mySocket.emit("RT_register_team", team);
});

$("#editTeamSubmitBtn").click(function(){
    var team = {};
    team.teamName = $("#eteamName").val();
    team.teamFaculty = $("#eteamFaculty").val();
    team.teamGroup = $("#eteamGroup").val();
    team.teamBatch = $("#eteamBatch").val();

    team.teamPlayer1 = {};
    team.teamPlayer2 = {};
    team.teamPlayer3 = {};
    team.teamPlayer4 = {};
    team.teamPlayer5 = {};
    team.teamPlayer6 = {};
    team.teamPlayer7 = {};
    team.teamPlayer8 = {};

    team.teamPlayer1.name = $("#eteamPlayer1").val();
    team.teamPlayer2.name = $("#eteamPlayer2").val();
    team.teamPlayer3.name = $("#eteamPlayer3").val();
    team.teamPlayer4.name = $("#eteamPlayer4").val();
    team.teamPlayer5.name = $("#eteamPlayer5").val();
    team.teamPlayer6.name = $("#eteamPlayer6").val();
    team.teamPlayer7.name = $("#eteamPlayer7").val();
    team.teamPlayer8.name = $("#eteamPlayer8").val();

    team.isFemale = $("#isFemale").prop('checked');

    mySocket.emit("team_list_request");

    mySocket.emit("RT_update_team", team, selectedTeamEdit);
});

$(".submitNewMatch").click(function(){
    if($(".team1listDropBtn").text() !== "Team 01"
        && $(".team2listDropBtn").text() !== "Team 02"
        && $(".matchTypeSel").text() !== "Match Type"
        && $(".matchIndex").val() !== ""
        && $(".matchName").val() !== ""){

        var savedMatch = {};

        savedMatch.name = $(".matchName").val();
        savedMatch.team01 = $(".team1listDropBtn").text();
        savedMatch.team02 = $(".team2listDropBtn").text();
        savedMatch.index = $(".matchIndex").val();
        savedMatch.type = $(".matchTypeSel").text();
        savedMatch.points01 = $(".pointsTeam1").val();
        savedMatch.points02 = $(".pointsTeam2").val();
        savedMatch.isPlayed = $(".isPlayed").val();

        mySocket.emit("add_new_match",savedMatch);

    }else{
        $(".errorEditMatch").css("display", "block");
        console.log("Loaded");
        setTimeout(function(){
            $(".errorEditMatch").css("display", "none");
        },6000)
    }
});

$(".submitEditMatchE").click(function(){
    var selectedMatchEditE = {};

    selectedMatchEditE.team1 = $(".team1listDropBtnE").text();
    selectedMatchEditE.team2 = $(".team2listDropBtnE").text();
    selectedMatchEditE.type = $(".matchTypeSelE").text();
    selectedMatchEditE.index = $(".matchIndexE").val();
    selectedMatchEditE.name = $(".matchNameE").val();

    selectedMatchEditE.point1 = $(".pointsTeam1E").val();
    selectedMatchEditE.point2 = $(".pointsTeam2E").val();
    selectedMatchEditE.isPlayed = $(".isPlayedE").val();

    mySocket.emit("edit_match", selectedMatchEditE, selectedMatchEdit);

    mySocket.emit("team_list_request");
});

$("#editTeamDeleteBtn").click(function(){
    var team = {};

    team.teamName = $("#eteamName").val();
    mySocket.emit("RT_delete_team",team);
});

$(".deleteEditMatchE").click(function(){
    mySocket.emit("delete_match",selectedMatchEdit);
});

$(".updatePlayingMatch").click(function(){
    if($(".ppointsTeam1").val() != "" && $(".ppointsTeam1").val() != "" && matchChange){
        matchChange.point1 = $(".ppointsTeam1").val();
        matchChange.point2 = $(".ppointsTeam2").val();
        mySocket.emit("edit_match", matchChange, matchChange);

        var data = {};
        data.name = nowMatch;
        data.team1 = $(".team1Playing").text();
        data.team2 = $(".team2Playing").text();
        data.point1 = $(".ppointsTeam1").val();
        data.point2 = $(".ppointsTeam2").val();

        if(data.name && data.team1 !== "Team 01" && data.team1 !== "Team 02" && data.point1 && data.point2){
            mySocket.emit("update_scoreboard_data",data);
        }
    }
});

$(".selectTimeState").click(function(){
    $(".stateTime").text($(this).text());
});

$(".btnTimeUpdate").click(function(){
    if($(".minutesInput").val() != "" && $(".secondsInput").val() != ""){
        var data = {};
        var minutes = $(".minutesInput").val();
        var seconds = $(".secondsInput").val();

        var timeM = Number(minutes)*60;
        var timeS = Number(seconds);

        if(minutes && seconds){
            data.time = timeS+timeM;
            data.state = $(".stateTime").text();
        }

        setTimeout(function(){
            clearInterval(timeCount);
            startTimer(timeS+timeM,document.getElementById("displayTime"));
            $(".btnTimePause").html('Pause');
        },1000);

        mySocket.emit("update_time",data);

    }
});

$(".btnTimePause").click(function(){
    if($(".btnTimePause").text() === "Pause"){
        $(".btnTimePause").html('Resume');
        clearInterval(timeCount);
        socket.emit("pause_timer");
    }else{
        $(".btnTimePause").html('Pause');
        startTimer(timerMin*60+timerSec,document.getElementById("displayTime"));
        socket.emit("resume_timer");
    }
});

$(".submitPlayingMatch").click(function(){
    if($(".ppointsTeam1").val() != "" && $(".ppointsTeam1").val() != "" && matchChange){
        matchChange.point1 = $(".ppointsTeam1").val();
        matchChange.point2 = $(".ppointsTeam2").val();
        mySocket.emit("edit_match", matchChange, matchChange);

        var data = {};
        data.team1 = $(".team1Playing").text();
        data.team2 = $(".team2Playing").text();
        data.point1 = $(".ppointsTeam1").val();
        data.point2 = $(".ppointsTeam2").val();

        mySocket.emit("final_score",data);
    }
});