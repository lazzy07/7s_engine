/**
 * Created by Lasantha Madushan on 8/16/2017.
 */

var circX = $("#logoOuter").position();
var wWidth = $( window ).width();
var sysState = "none";
var sysUpdate = true;
var tvLogo = false;

var videoNo = 1;
var maxVideo = 3;

var state = "start";
var name;

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
        sources[0].src = "./resources/videos/00" + videoNo.toString() + ".mp4";
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
        if(tvLogo == true) {
            const timeLine = new mojs.Timeline({
                repeat: 999
            })
                .add(circ, circ2)
                .play();
        }
    } else {
        pauseVid();
    }
}


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
        console.log("triggered");
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
                    },1000)
                },800)
            },800)
        },800);
    }
}

function matchFixtures(){
    if(state == "fixtures") {
        $("#magentaImg2FM").hide();
        $("#magenta2HFM").hide();
        $("#magenta2H2FM").hide();
        $("#tableData").hide();
        $(".defFont").hide();

        $("#sideScreen3LM").hide().show("slide", {direction: "left"}, 1000);
        $("#sideScreen4LM").hide().show("slide", {direction: "right"}, 1000);

        setTimeout(function(){
            $("#magentaImg2FM").fadeIn(500);
            $("#magenta2HFM").slideDown(800);
            $("#magenta2H2FM").slideDown(800);

            $(".defFont").slideDown(800);

            setTimeout(function(){
                $("#tableData").slideDown(800);
            },800);
        },1000);

        $("#fixtureClass").css("visibility", "visible");
    }else{
        console.log("Debugging ::: Run");
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
        },800);
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
});

//Submitting monitor name
$(".register").click(function(){
    var $monitorName = $(".name");
    if(($monitorName).val() != undefined){
        socket.emit("registerMonitor", $monitorName.val())
    }
});

