/**
 * Created by Lasantha Madushan on 8/16/2017.
 */

var circX = $("#logoOuter").position();
var wWidth = $( window ).width();
var sysState = "none";
var sysUpdate = true;
var tvLogo = false;

var app = angular.module("IdeApp",[]);

var videoNo = 0;
var maxVideo = 9;

var state = "start";
var name;

var recivedData;

var returnNow = false;

var recivedTeam1;
var recivedTeam2;
var recivedFixtures;


var timeCount;
var timerMin, timerSec;

var pathVid = "./resources/videos/00";

var timeLine;

var isReversed = false;

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
};



//**********MO.JS****************
//Circle burst
const circ = new mojs.Shape({
    opacity: {1:0},
    radius: {0: 55},
    stroke: 'white',
    fill: 'none',
    duration: 1200,
    left: '92.3%',
    top: '81.5%',
});

const circ2 = new mojs.Shape({
    delay: 200,
    opacity: {0.8:0},
    radius: {0: 50},
    stroke: 'white',
    fill: 'none',
    duration: 1500,
    left: '92.3%',
    top: '81.5%'
});

const circClose = new mojs.Shape({
    opacity: {1:0},
    radius: {0: 220},
    stroke: '#340040',
    fill: 'none',
    duration: 1200,
    top: '30%'
});

const circ2Close = new mojs.Shape({
    delay: 200,
    opacity: {0.8:0},
    radius: {0: 200},
    stroke: '#340040',
    fill: 'none',
    duration: 1500,
    top: '30%',
    strokeWidth: {4:2}
});

const circ3Close = new mojs.Shape({
    delay: 250,
    opacity: {1:0},
    radius: {0: 220},
    stroke: '#340040',
    fill: 'none',
    duration: 1000,
    top: '30%',
    strokeWidth: {10:3}
});


//Normal JS
var vid = document.getElementById("videoClass");

function interpret(rState){
    var newState;

    if(rState === "Start Screen"){
        newState = "start";
    }else if(rState === "Scoreboard"){
        newState = "scoreboard";
    }else if(rState === "Next Match"){
        newState = "nextMatch";
    }else if(rState === "2 Team Lineup"){
        newState = "team2Formation";
    }else if(rState === "Team Formation"){
        newState = "teamFormation";
    }else if(rState === "Match Fixtures"){
        newState = "fixtures";
    }else if(rState === "Group Information"){
        newState = "gInfo";
    }else if(rState === "Play Video")
        newState = "playVideo";
    return newState;
}

function playVid() {
    vid.play();
}

function pauseVid() {
    vid.pause();
}

//Get the state of the system
function playVidFunc(){
    if (sysState == "playVid") {
        //Loading Videos

        var video = document.getElementById('videoClass');
        var sources = video.getElementsByTagName('source');
        sources[0].src = pathVid + videoNo.toString() + ".mp4";
        video.load();

        $("#videoClass").bind("ended", function() {
            if(videoNo < maxVideo){
                ++videoNo;
            }else{
                videoNo = 1;
            }
            var video = document.getElementById('videoClass');
            var sources = video.getElementsByTagName('source');
            sources[0].src = "./resources/videos/00" + videoNo.toString() + ".mp4";
            video.load();
        });
        playVid();

    } else {
        pauseVid();
    }
}

function showLogo() {
    if(state === "playVideo") {
        timeLine = new mojs.Timeline({
            repeat: 6
        })
            .add(circ, circ2)
            .play();

        $("#tvLogo").css("visibility", "visible");
        $("#tvLogo").fadeIn(800);

    }else{

        $("#tvLogo").fadeOut(800);

        setTimeout(function () {
            $("#tvLogo").css("visibility", "hidden");
        },800);


    }
}



//Sys update function
function sysUpFunc() {
    if (sysUpdate == true) {
        $("#closeScr").css("visibility", "visible");

        $("#closeDiv1").addClass("slideLeft");
        $("#closeDiv2").addClass("slideRight");

        $("#closeScrDiv1").hide();
        $("#closeScrDiv2").hide();
        $("#closeImg").hide();


        setTimeout(function () {
            const timeLine2 = new mojs.Timeline({
                repeat: 1
            })
                .add(circClose, circ2Close, circ3Close)
                .play();

            $("#closeScrDiv1").slideDown(800);
            $("#closeScrDiv2").slideDown(800);
            $("#closeImg").fadeIn(500);
        }, 1000);

        setTimeout(function () {
            $("#closeDiv1").hide("slide", {direction: "left"}, 1000);
            $("#closeDiv2").hide("slide", {direction: "right"}, 1000);
            $("#closeScrDiv1").slideUp(800);
            $("#closeScrDiv2").slideUp(800);
            $("#closeImg").fadeOut(800);
            setTimeout(function () {
                $("#closeScr").css("visibility", "hidden");
            }, 1000)
        }, 4000);

        sysUpdate = false;

    }


    $(function () {
        $('.slideLeft').hide().show("slide", {direction: "left"}, 1000);
        $('.slideRight').hide().show("slide", {direction: "right"}, 1000);
        $('.slideDown').hide().slideDown(1500);
    });
}

//Scoreboard
function scoreboardFunc(){
    if(state == "scoreboard"){

        $(".sideScreenScr").hide();
        $("#magentaImgScr").hide();
        $(".magentaScr").hide();
        $(".scrName").hide();
        $(".scrScore").hide();
        $("#scrClock").hide();
        $("#scrState").hide();
        $("#scrMatch").hide();
        $("#scrLogo").hide();

        $("#scoreboard").css("visibility", "visible");

        $("#sideScreen1Scr").hide().show("slide", {direction: "left"}, 1000);
        $("#sideScreen2Scr").hide().show("slide", {direction: "right"}, 1000);

        setTimeout(function(){
            $("#magentaImgScr").fadeIn(800);
            $(".magentaScr").slideDown(800);
        },1000);

        setTimeout(function(){
            $(".scrName").slideDown(1000);
            $(".scrScore").slideDown(1000);
            $("#scrClock").slideDown(1000);
            $("#scrState").slideDown(1000);
            $("#scrMatch").slideDown(1000);
            $("#scrLogo").fadeIn(1000);
        },1800);
    }else{
        $(".scrName").slideUp(1000);
        $(".scrScore").slideUp(1000);
        $("#scrClock").slideUp(1000);
        $("#scrState").slideUp(1000);
        $("#scrMatch").slideUp(1000);
        $("#scrLogo").fadeOut(1000);

        setTimeout(function(){
            $("#magentaImgScr").fadeOut(800);
            $(".magentaScr").slideUp(800);
        },1000);

        setTimeout(function(){
            $("#sideScreen1Scr").hide("slide", {direction: "left"}, 1000);
            $("#sideScreen2Scr").hide("slide", {direction: "right"}, 1000);
        },1800);

        setTimeout(function(){
            $("#scoreboard").css("visibility", "hidden");
        },2800);
    }
}

//TeamFormation
function teamFormation(formationDuration,subDuration){
        $("#sideScreen3L").hide().show("slide", {direction: "left"}, 1000);
        $("#sideScreen4L").hide().show("slide", {direction: "right"}, 1000);

        $("#magentaImg2F").hide();
        $("#magenta2HF").hide();
        $("#magenta2H2F").hide();
        $("#team1SheetL").hide();
        $("#team1SheetLS").hide();
        $("#numberClass1L").hide();
        $("#numberClass1LS").hide();
        $("#formationDiv").hide();
        $("#formationTopic").hide();
        $("#numberClass1LF").hide();


        setTimeout(function(){
            $("#magentaImg2F").fadeIn(800);
            $("#magenta2HF").slideDown(800);
            $("#magenta2H2F").slideDown(800);
        },1000);

        setTimeout(function(){
            $(".entry").hide();
            $("#team1SheetL").slideDown(800);
            $("#formationTopic").slideDown(800);
            $("#formationDiv").slideDown(1000);

            setTimeout(function(){
                $(".entry").slideDown(800);
                $("#numberClass1L").slideDown(800);
                $("#numberClass1LF").slideDown(800);

                setTimeout(function(){
                    $("#team1SheetL").slideUp(800);
                    $("#numberClass1L").slideUp(800);

                    setTimeout(function(){
                        $("#numberClass1LS").slideDown(800);
                        $("#team1SheetLS").slideDown(800);

                        setTimeout(function(){
                            $("#numberClass1LS").slideUp(800);
                            $("#team1SheetLS").slideUp(800);
                            $("#formationDiv").slideUp(800);
                            $("#numberClass1LF").slideUp(800);
                            $("#formationTopic").slideUp(800);



                            setTimeout(function(){
                                $("#magentaImg2F").fadeOut(800);
                                $("#magenta2HF").slideUp(800);
                                $("#magenta2H2F").slideUp(800);


                                setTimeout(function(){

                                    $("#sideScreen3L").hide("slide", {direction: "left"}, 1000);
                                    $("#sideScreen4L").hide("slide", {direction: "right"}, 1000);

                                    setTimeout(function(){
                                        $("#lineup1Team").css("visibility", "hidden");
                                        state = "playVideo";
                                        showLogo();
                                    },800)
                                },800)
                            },800);
                        },subDuration);
                    },800);

                },formationDuration);

            },1000);
        },1800);
        $("#lineup1Team").css("visibility", "visible");
}

//Team2formation
function team2Formation(sub, formationDuration, subDuration){
    if(state == "team2Formation"){
        $("#magentaImg2").hide();
        $("#magenta2H").hide();
        $("#magenta2H2").hide();
        $("#team2Topic").hide();
        $("#team2subTopic").hide();

        $("#team1Sheet").hide();
        $("#team1SheetS").hide();
        $("#numberClass1").hide();
        $("#numberClass1S").hide();

        $("#team2Sheet").hide();
        $("#team2SheetS").hide();
        $("#numberClass2").hide();
        $("#numberClass2S").hide();

        $("#middleLogo").hide();
        $("#middleLogoImg").hide();

        $("#teamf2Sheet").css("visibility", "visible");



        $("#sideScreen3").hide().show("slide", {direction: "left"}, 1000);
        $("#sideScreen4").hide().show("slide", {direction: "right"}, 1000);

        setTimeout(function(){
            $("#magentaImg2").fadeIn(800);
            $("#magenta2H").slideDown(800);
            $("#magenta2H2").slideDown(800);

            setTimeout(function(){
                $("#team2Topic").slideDown(800);
                $("#team2subTopic").slideDown(800);
                $("#middleLogo").slideDown(800);
                $("#middleLogoImg").fadeIn(800);

                setTimeout(function(){
                    $("#team1Sheet").slideDown(1000);
                    $("#numberClass1").slideDown(1000);

                    $("#team2Sheet").slideDown(1000);
                    $("#numberClass2").slideDown(1000);

                    if(sub == true){
                        setTimeout(function () {
                            $("#team1Sheet").slideUp(1000);
                            $("#numberClass1").slideUp(1000);
                            $("#team2Sheet").slideUp(1000);
                            $("#numberClass2").slideUp(1000);

                            setTimeout(function(){
                                $("#team1SheetS").slideDown(800);
                                $("#numberClass1S").slideDown(800);
                                $("#team2SheetS").slideDown(800);
                                $("#numberClass2S").slideDown(800);

                                setTimeout(function(){

                                    $("#team1SheetS").slideUp(800);
                                    $("#numberClass1S").slideUp(800);
                                    $("#team2SheetS").slideUp(800);
                                    $("#numberClass2S").slideUp(800);

                                    setTimeout(function(){
                                        $("#team2Topic").slideUp(800);
                                        $("#team2subTopic").slideUp(800);
                                        $("#middleLogo").slideUp(800);
                                        $("#middleLogoImg").fadeOut(800);

                                        setTimeout(function(){
                                            $("#magentaImg2").fadeOut(800);
                                            $("#magenta2H").slideUp(800);
                                            $("#magenta2H2").slideUp(800);

                                            setTimeout(function(){
                                                $("#sideScreen3").hide("slide", {direction: "left"}, 1000);
                                                $("#sideScreen4").hide("slide", {direction: "right"}, 1000);

                                                setTimeout(function () {
                                                    $("#teamf2Sheet").css("visibility", "hidden");
                                                    state = "playVideo";
                                                    showLogo();
                                                },1000);
                                            },800)
                                        },800)
                                    },800);

                                },subDuration);

                            },1000);


                        },formationDuration);
                    }
                },800)

            },800)

        },1000);

        $("#teamf2Sheet").css("visibility", "visible");
    }else{
        $("#team1Sheet").slideUp(1000);
        $("#numberClass1").slideUp(1000);
        $("#team2Sheet").slideUp(1000);
        $("#numberClass2").slideUp(1000);


        setTimeout(function(){
            $("#team2Topic").slideUp(800);
            $("#team2subTopic").slideUp(800);
            $("#middleLogo").slideUp(800);
            $("#middleLogoImg").fadeOut(800);

            setTimeout(function(){
                $("#magentaImg2").fadeOut(800);
                $("#magenta2H").slideUp(800);
                $("#magenta2H2").slideUp(800);

                setTimeout(function(){
                    $("#sideScreen3").hide("slide", {direction: "left"}, 1000);
                    $("#sideScreen4").hide("slide", {direction: "right"}, 1000);

                    setTimeout(function(){
                        $("#teamf2Sheet").css("visibility", "hidden");
                        state = "playVideo";
                        showLogo();
                    },1000)
                },800)
            },800)
        },800);
    }
}

//Match fixtures
function matchFixtures(){
    if(state == "fixtures") {
        $("#magentaImg2FM").hide();
        $("#magenta2HFM").hide();
        $("#magenta2H2FM").hide();
        $("#tableData").hide();
        $(".defFont").hide();
        $("#orgBy").hide();

        $("#fixtureClass").css("visibility", "visible");

        $("#sideScreen3LM").hide().show("slide", {direction: "left"}, 1000);
        $("#sideScreen4LM").hide().show("slide", {direction: "right"}, 1000);

        setTimeout(function(){
            $("#magentaImg2FM").fadeIn(500);
            $("#magenta2HFM").slideDown(800);
            $("#magenta2H2FM").slideDown(800);

            $(".defFont").slideDown(800);
            $("#orgBy").hide();

            setTimeout(function(){
                $("#tableData").slideDown(800);
            },800);
        },1000);
    }else{
        $("#tableData").slideUp(800);
        setTimeout(function(){
            $("#magentaImg2FM").fadeOut(500);
            $("#magenta2HFM").slideUp(800);
            $("#magenta2H2FM").slideUp(800);

            $(".defFont").slideUp(800);

            setTimeout(function(){
                $("#sideScreen3LM").hide("slide", {direction: "left"}, 1000);
                $("#sideScreen4LM").hide("slide", {direction: "right"}, 1000);

                setTimeout(function(){
                    $("#fixtureClass").css("visibility", "hidden");
                },1000)
            },800)
        },800);
    }
}

//Intro Screen
function startSys(){
    if(state == "start") {
        $(".startPage").css("visibility", "visible");
        $("#orgByTag").hide();
        $("#orgBy").hide();
        $(".logo").hide();
        $("#topic1").hide();
        $("#topic2").hide();

        $("#startBack").hide().slideDown(800);


        setTimeout(function () {
            $("#orgByTag").slideDown(800);
            $("#orgBy").slideDown(800);
            $(".logo").fadeIn(500);
            $("#topic1").slideDown(800);
            $("#topic2").slideDown(800);
        }, 800);
    }else{
        $("#orgByTag").slideUp(800);
        $("#orgBy").slideUp(800);
        $(".logo").fadeOut(500);
        $("#topic1").slideUp(800);
        $("#topic2").slideUp(800);

        setTimeout(function(){
            $("#startBack").slideUp(800);
            setTimeout(function(){
                $(".startPage").css("visibility", "hidden");
            },800)

        },800);
    }
}

//Match Info
function comingMatch(){
    if(state === "nextMatch"){
        $("#nowplTag").hide();
        $("#nowpldownTag").hide();
        $("#antiR").hide();
        $("#team1Div").hide();
        $("#team2Div").hide();
        $("#hashTag").hide();
        $("#magentaImg").hide();
        $("#magentaH").hide();
        $("#magentaH2").hide();

        $("#nowPlaying").css("visibility", "visible");

        $("#sideScreen1").hide().show("slide", {direction: "left"}, 1000);
        $("#sideScreen2").hide().show("slide", {direction: "right"}, 1000);

        setTimeout(function(){
            $("#magentaImg").fadeIn(500);
            $("#magentaH").slideDown(800);
            $("#magentaH2").slideDown(800);

            $("#nowplTag").slideDown(800);
            $("#nowpldownTag").slideDown(800);

            $("#team1Div").show("slide", {direction: "left"}, 800);
            $("#team2Div").show("slide", {direction: "right"}, 800);

            setTimeout(function(){
                $("#antiR").slideDown(800);
                $("#hashTag").slideDown(800);
            },800);
        },1000);

    }else{
        setTimeout(function(){
            $("#antiR").slideUp(800);
            $("#hashTag").slideUp(800);
            setTimeout(function(){
                $("#magentaImg").fadeOut(500);
                $("#magentaH").slideUp(800);
                $("#magentaH2").slideUp(800);

                $("#nowplTag").slideUp(800);
                $("#nowpldownTag").slideUp(800);

                $("#team1Div").hide("slide", {direction: "left"}, 800);
                $("#team2Div").hide("slide", {direction: "right"}, 800);

                setTimeout(function(){
                    $("#sideScreen1").hide("slide", {direction: "left"}, 1000);
                    $("#sideScreen2").hide("slide", {direction: "right"}, 1000);

                    setTimeout(function(){
                        $("#nowPlaying").css("visibility", "hidden");
                    },1000);
                },800);
            },800);
        },1000);
    }
}

//Group Info
function groupInfo(){
    if(state === "gInfo"){
        $("#sideScreen1G").hide();
        $("#sideScreen2G").hide();
        $("#magentaImgG").hide();
        $("#magenta2G").hide();
        $("#magenta2HG").hide();

        $(".topicTG").hide();
        $(".topicSG").hide();

        $("#groupTable").hide();

        $("#groupInfo").css("visibility", "visible");

        $("#sideScreen1G").show("slide", {direction: "left"}, 1000);
        $("#sideScreen2G").show("slide", {direction: "right"}, 1000);

        setTimeout(function (){
            $("#magentaImgG").fadeIn(500);
            $("#magenta2G").slideDown(800);
            $("#magenta2HG").slideDown(800);

            $(".topicTG").slideDown(800);
            $(".topicSG").slideDown(800);

            setTimeout(function(){
                $("#groupTable").slideDown(800);
            },800);
        },1000);
    }else{
        $("#groupTable").slideUp(800);

        setTimeout(function () {
            $("#magentaImgG").fadeOut(500);
            $("#magenta2G").slideUp(800);
            $("#magenta2HG").slideUp(800);

            $(".topicTG").slideUp(800);
            $(".topicSG").slideUp(800);

            setTimeout(function () {
                $("#sideScreen1G").hide("slide", {direction: "left"}, 1000);
                $("#sideScreen2G").hide("slide", {direction: "right"}, 1000);

                setTimeout(function(){
                    $("#groupInfo").css("visibility", "hidden");
                },1000);
            },800);
        },800);
    }
}



function updateSystem(){
    //TODO : Add states here to refresh screens
    state = "none";

    scoreboardFunc();
    matchFixtures();
    startSys();
    comingMatch();
    groupInfo();
    showLogo();

    if(recivedData.state === "Start Screen"){
        console.log("Start Screen");

        setTimeout(function(){
            state = interpret(recivedData.state);
            startSys();
        },5200);

    }else if(recivedData.state === "Scoreboard"){
        console.log("Scoreboard");

        setTimeout(function(){
            state = interpret(recivedData.state);
            scoreboardFunc();
        },5200);

    }else if(recivedData.state === "Next Match"){
        console.log("Next Match");

        setTimeout(function(){
            state = interpret(recivedData.state);
            comingMatch();
        },5200);



    }else if(recivedData.state === "2 Team Lineup"){
        console.log("2 Team Lineup");

        setTimeout(function(){
            state = interpret(recivedData.state);
            team2Formation(true, recivedData.fDuration, recivedData.sDuration);
        },5200);

    }else if(recivedData.state === "Team Formation"){
        console.log("Team Formation");

        setTimeout(function(){
            state = interpret(recivedData.state);
            teamFormation(recivedData.fDuration, recivedData.sDuration);
        },5200);
    }else if(recivedData.state === "Match Fixtures"){
        console.log("Match Fixtures");

        setTimeout(function(){
            state = interpret(recivedData.state);
            matchFixtures();
        },5200);
    }else if(recivedData.state === "Group Information"){
        console.log("Group Information");

        setTimeout(function(){
            state = interpret(recivedData.state);
            groupInfo();
        },5200);
    }else if(recivedData.state = "Play Video"){
        console.log("Play Video");

        setTimeout(function(){
            state = interpret(recivedData.state);
            showLogo();
        },5200);
    }
}

var socket;

$(function(){
    socket = io.connect();
    console.log("Connection Requested!");

    socket.on("registered",function(data){
        state = "start";
        sysState = "playVid";
        console.log("Registration Complete!! "+ data);
        $(".monitorRegister").css("visibility", "hidden");
        playVidFunc();
        startSys();
    });

    socket.on("monitor_data",function(data){
        recivedData = data;
        isReversed = false;

        if(data.group) {
            data.group.sort(function (a, b) {
                if (a.points < b.points) {
                    return -1;
                }
                if (a.points > b.points) {
                    return 1;
                }
                if (a.points == b.points) {
                    if (a.totalTries - a.triesAgainst < b.totalTries - b.triesAgainst) {
                        return -1;
                    }
                    if (a.totalTries - a.triesAgainst > b.totalTries - b.triesAgainst) {
                        return 1;
                    }
                    if (a.totalTries - a.triesAgainst === b.totalTries - b.triesAgainst) {
                        if (a.totalTries < b.totalTries) {
                            return -1;
                        }
                        if (a.totalTries > b.totalTries) {
                            return 1;
                        }
                        if (a.totalTries == b.totalTries) {
                            if (a.triesAgainst > b.triesAgainst) {
                                return -1;
                            }
                            if (a.triesAgainst < b.triesAgainst) {
                                return 1;
                            }
                            if (a.triesAgainst == b.triesAgainst) {
                                if (a.played < b.played) {
                                    return -1;
                                }
                                if (a.played < b.played) {
                                    return 1;
                                }
                                if (a.played == b.played) {
                                    if (a.teamName.toUpperCase() < b.teamName.toUpperCase()) {
                                        return -1;
                                    }
                                    if (a.teamName.toUpperCase() < b.teamName.toUpperCase()) {
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

        if(data.group){
            data.group.reverse();
        }
        console.log(data);
        updateSystem();
        $(".clickMe").trigger("click");
    });

    socket.on("update_time",function(data){
        if(state === "scoreboard"){
            sysUpdate = true;
            sysUpFunc();
        }

        setTimeout(function(){
            timerMin = data.time % 60;
            timerSec = data.time / 60;

            clearInterval(timeCount);
            startTimer(data.time, document.getElementById("scrClock"));
            $("#scrState").text(data.state);
        },1000);
    });

    socket.on("update_scoreboard_data",function(data){
        if(state === "scoreboard"){
            sysUpdate = true;
            sysUpFunc();
        }

        setTimeout(function(){
            console.log("Update Scoreboard Data");
            $("#scrMatch").text(data.name);
            $("#scrTeam1").text(data.team1);
            $("#scrTeam2").text(data.team2);
            $("#scrScore1").text(data.point1);
            $("#scrScore2").text(data.point2);
        },1000);
    });

    socket.on("update_team1",function(data){
        recivedTeam1 = data;
        $(".clickMe").trigger("click");
    });

    socket.on("update_team2",function(data){
        recivedTeam2 = data;
        $(".clickMe").trigger("click");
    });

    socket.on("pause_timer",function () {
        clearInterval(timeCount);
    });

    socket.on("resume_timer",function () {
        startTimer(timerMin*60+timerSec,document.getElementById("scrClock"));
    });

    socket.on("update_fixtures",function(fixtures){
        recivedFixtures = fixtures;
        $(".clickMe").trigger("click");
    });
});

//Submitting monitor name
$(".register").click(function(){
    var $monitorName = $(".name");
    if(($monitorName).val() != undefined){
        socket.emit("registerMonitor", $monitorName.val());
    }
});

app.controller("ScreenController",function($scope){
    $scope.update = function(){
        $scope.data = recivedData;
        $scope.team1 =recivedTeam1;
        $scope.team2 =recivedTeam2;
        if(recivedFixtures) {
            $scope.fixtures = recivedFixtures.fixtures;
        }
    };
});