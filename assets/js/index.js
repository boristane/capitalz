data = data.filter(function(dataEntry){
    return dataEntry.capital !== "";
});

var allCountries = data.map(function(dataEntry){
    var country ={};
    country.name = dataEntry.name.common;
    country.capital = dataEntry.capital;
    country.region = dataEntry.region;
    country.description = "The capital of " + dataEntry.name.common + " is " + country.capital + ".";
    return country;
});

var regions = [];

function populateRegions(){
    for(var i = 0; i < allCountries.length; i++){
        if(regions.indexOf(allCountries[i].region) === -1 && allCountries[i].region !== ""){
            regions.push(allCountries[i].region);
        }
    }
}

const ALL_REGIONS_STRING = "All";
regions.push(ALL_REGIONS_STRING);


var countries = [];
var currentCountry = {};
var currentRegion = "";
var btns = {};
var playerAnswer = -1;
var correctBtnIndex = 0;
var score = 0; 
var timer;
var timeDelay = 4000;
var questionCount = 0;
var currentCountriesCount = 0;

populateRegions();
populateRegionsUI();
regionSelection();
startGame();
btns = getBtns();
getPlayerAnswer();
var timerIntervalId = 0;

function populateRegionsUI(){
    var dropdownElt = document.querySelector(".dropdown-menu");
    
    regions.forEach(function(region){
        var regionElt = document.createElement("a");
        regionElt.setAttribute("class", "dropdown-item");
        regionElt.setAttribute("id", region);
        regionElt.href = "#";
        regionElt.textContent = region;
        dropdownElt.appendChild(regionElt);
    });

    hideGameScreen();
}

function regionSelection(){

    var displayElt = document.getElementById("dropdownMenuButton");
    var dropdownElts = [];
    regions.forEach(function(region){
        dropdownElts.push(document.getElementById(region));
    });

    dropdownElts.forEach(function(dropdownElt){
        dropdownElt.addEventListener("click", function(e){
            e.preventDefault();
            currentRegion = dropdownElt.id;
            displayElt.textContent = dropdownElt.id;
        });
    });
}

function startGame(){
    var startElt = document.getElementById("start-game");
    var warningElt = document.getElementById("warning");
    startElt.addEventListener("click", function(){
        questionCount = 0;
        if(regions.indexOf(currentRegion) === -1){
            warningElt.textContent = "Please select a region :)";
            return;
        }

        if(currentRegion === ALL_REGIONS_STRING){
            countries = allCountries.slice(0);
        }else{
            countries = allCountries.filter(function(country){
                return country.region === currentRegion;
            });
        }

        currentCountriesCount = countries.length;

        document.querySelector("#dropdownMenuButton").textContent = "Select region";
        loadNewQuestion(0);
        hideMainScreen();
        showGameScreen();
        
    });

    var restartElt = document.getElementById("restart");
    restartElt.addEventListener("click", function(){
        showMainScreen();
        hideGameScreen();
        score = 0;
        warningElt.textContent = "";
        currentRegion = "";
        updateScoreUI();
    });  
}

function hideMainScreen(){
    $(".main-screen").hide();
}

function showMainScreen(){
    $(".main-screen").show();
}

function hideGameScreen(){
    $(".game-container").hide();
}

function showGameScreen(){
    $(".game-container").show();
}

function loadNewQuestion(timeDelay){
    playerAnswer = -1;
    questionCount+=1;
    btns.forEach(function(btn){
        btn.disabled = true;
    });

    setTimeout(function(){
        currentCountry = randomCountry();
        displayQuestion();
        correctBtnIndex = populateBtns();
        clearResult();
        btns.forEach(function(btn){
            btn.disabled = false;
        });
    }, timeDelay);
}

function randomCountry(){
    try{
        var index = Math.floor(Math.random()*countries.length);
        return countries[index];
    }finally{
        countries.splice(index,1);
    }
}

function isCorrect(){
    return playerAnswer === correctBtnIndex;
}

function getBtns(){
    var btnA = document.getElementById("btn-A");
    var btnB = document.getElementById("btn-B");
    var btnC = document.getElementById("btn-C");
    var btnD = document.getElementById("btn-D");
    return [btnA, btnB, btnC, btnD];
}

function populateBtns(){
    correctBtnIndex = Math.floor(Math.random()*4);
    for(var i=0; i< btns.length; i++){
        var btn = btns[i];
        if(i===correctBtnIndex){
            btn.textContent = currentCountry.capital;
            continue;
        }
        var index = Math.floor(Math.random()*allCountries.length);
        btn.textContent = allCountries[index].capital;
    }
    return correctBtnIndex;
}

function getPlayerAnswer(){
    btns[0].addEventListener("click", function(){
        playerAnswer = 0;
        displayResult();
        loadNewQuestion(timeDelay);
    });
    btns[1].addEventListener("click", function(){
        playerAnswer = 1;
        displayResult();
        loadNewQuestion(timeDelay);
    });
    btns[2].addEventListener("click", function(){
        playerAnswer = 2;
        displayResult();
        loadNewQuestion(timeDelay);
    });
    btns[3].addEventListener("click", function(){
        playerAnswer = 3;
        displayResult();
        loadNewQuestion(timeDelay);
    });
}

function displayResult(){
    //document.getElementById("timer").textContent = "-";
    var reponseElt = document.getElementById("answer");
    if(isCorrect()){
        score+=1;
        reponseElt.textContent = "Correct ! " + currentCountry.description;
    }else{
        reponseElt.textContent = "Naah... " + currentCountry.description;
    }
    updateScoreUI();
    stopTimer();
}

function clearResult(){
    var reponseElt = document.getElementById("answer");
    reponseElt.textContent = "";
}

function updateScoreUI(){
    var scoreElt = document.getElementById("score");
    scoreElt.textContent = "Score: " + score;
}

function displayQuestion(){
    var questionElt = document.getElementById("question");
    questionElt.textContent = "What is the capital of " + currentCountry.name + "?";
    document.getElementById("timer").textContent = "-";
    displayQuestionCount();
    setTimer();
}

function setTimer(){
    var timerElt = document.getElementById("timer");
    stopTimer();
    timer = new Worker("assets/js/timer.js");
    timer.onmessage = function(e){
        timerElt.textContent = e.data.count;
        if(e.data.complete === true){
            timerElt.textContent = "Time out";
            displayResult();
            loadNewQuestion(timeDelay);
        }
    };
} 

function stopTimer(){
    if(typeof timer !== "undefined"){
        timer.terminate();
    }
}

function displayQuestionCount(){
    document.getElementById("question-count").textContent = "Question " + questionCount + " of " + currentCountriesCount + " in " + currentRegion;
}