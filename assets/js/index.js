data = data.filter(function(dataEntry){
    return dataEntry.capital !== "";
});

var allCountries = data.map(function(dataEntry){
    var country ={};
    country.name = dataEntry.name.common;
    country.capital = dataEntry.capital;
    country.region = dataEntry.region;
    country.code = dataEntry.cca2.toLowerCase();
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
var scores = []; 
var timer;
var timeDelay = 2000;
var questionCount = 0;
var currentCountriesCount = 0;
var numPlayers = 0;
var currentPlayerId = 0;

populateRegions();
populateRegionsUI();
regionSelection();
hidePlayerSelectionButtons();
startUI();
startMultiPlayerGameUI();
btns = getBtns();
getPlayerAnswer();

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

function startUI(){
    var soloElt = document.getElementById("solo-game");
    questionCount = 0;
    soloElt.addEventListener("click", function(){
        numPlayers = 1;
        if(regionCheck()){
            currentPlayerId = 0;
            scores[currentPlayerId] = 0;
            currentCountriesCount = countries.length;
            setScoreUI();
            startGame();
        }
    });

    var partyElt = document.getElementById("party-game");
    partyElt.addEventListener("click", function(){
        if(regionCheck()){
            showMultiPlayerUI();
            getNumPlayers();
        }
        

    });

    var returnElt = document.getElementById("btn-return");
    returnElt.addEventListener("click", function(){
        hideMultiPlayerUI();
    });
    
    var restartElt = document.getElementById("restart");
    restartElt.addEventListener("click", function(){
        stopGame();
    });  
}

function startGame(){
    document.querySelector("#dropdownMenuButton").textContent = "Select region";
    loadNewQuestion(0);
    hideMainScreen();
    showGameScreen();
}

function stopGame(){
    numPlayers = 0;
    showMainScreen();
    hideGameScreen();
    scores.forEach(function(score){
        score = 0;
    });
    document.getElementById("warning").textContent = "";
    currentRegion = "";
    updateScoreUI();
    stopTimer();
    questionCount = 0;
}

function regionCheck(){
    var warningElt = document.getElementById("warning");
    if(regions.indexOf(currentRegion) === -1){
        warningElt.textContent = "Please select a region :)";
        setTimeout(function(){
            warningElt.textContent = "";
        }, timeDelay);
        return false;
    }

    if(currentRegion === ALL_REGIONS_STRING){
        countries = allCountries.slice(0);
    }else{
        countries = allCountries.filter(function(country){
            return country.region === currentRegion;
        });
    }

    return true;
}

function getNumPlayers(){
    var foo = document.getElementsByClassName("nbr-player-selection");
    var numPlayerElts = [];
    for(var i=0; i < foo.length; i++){
        numPlayerElts.push(foo[i]);
    }
    numPlayerElts.forEach(function(numPlayerElt){
        numPlayerElt.addEventListener("click", function(){
            if(isNaN(Number(numPlayerElt.id[0]))){
                return;
            }
            numPlayers = Number(numPlayerElt.id[0]);
            for(var j=0; j<numPlayers; j++){
                scores.push(0);
            }
            hideMultiPlayerUI();
            setScoreUI();
        });
    });
}

function startMultiPlayerGameUI(){
    var foo = document.getElementsByClassName("nbr-player-selection");
    var numPlayerElts = [];
    for(var i=0; i < foo.length; i++){
        numPlayerElts.push(foo[i]);
    }
    numPlayerElts.forEach(function(numPlayerElt){
        numPlayerElt.addEventListener("click", function(){
            currentCountriesCount = countries.length;
            startGame();
        });
    });
}

function showMultiPlayerUI(){
    $("#solo-game").hide();
    $("#party-game").hide();
    $(".dropdown").hide();
    showPlayerSelectionButtons();
}

function hideMultiPlayerUI(){
    $("#solo-game").show();
    $("#party-game").show();
    $(".dropdown").show();
    hidePlayerSelectionButtons();
}

function hidePlayerSelectionButtons(){
    $(".nbr-player").hide();
}

function showPlayerSelectionButtons(){
    $(".nbr-player").show();
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
        displayResult(currentPlayerId);
        nextPlayer();
        loadNewQuestion(timeDelay);
    });
    btns[1].addEventListener("click", function(){
        playerAnswer = 1;
        displayResult(currentPlayerId);
        nextPlayer();
        loadNewQuestion(timeDelay);
    });
    btns[2].addEventListener("click", function(){
        playerAnswer = 2;
        displayResult(currentPlayerId);
        nextPlayer();
        loadNewQuestion(timeDelay);
    });
    btns[3].addEventListener("click", function(){
        playerAnswer = 3;
        displayResult(currentPlayerId);
        nextPlayer();
        loadNewQuestion(timeDelay);
    });
}

function nextPlayer(){
    if(currentPlayerId+1 === numPlayers){
        currentPlayerId = 0;
    }else{
        currentPlayerId += 1;
    }
}

function displayResult(playerId){
    var reponseElt = document.getElementById("answer");
    if(isCorrect()){
        scores[playerId]+=1;
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
    var scoreElts = document.getElementsByClassName("score");
    for(var i= 0; i< numPlayers; i++){
        scoreElts[i].textContent = "Player " + (i+1) + ": " + scores[i];
    }

    if(numPlayers === 0){
        for(var j= 0; j< scoreElts.length; j++){
            scoreElts[j].textContent = "";
        }
    }
}

function setScoreUI(){
    var scoreElts = document.getElementsByClassName("score");
    while(scoreElts.length <= numPlayers){
        var newScoreElt = document.createElement("h2");
        newScoreElt.setAttribute("class","score");
        newScoreElt.textContent = "-";
        scoreElts[0].parentNode.insertBefore(newScoreElt, scoreElts[0]);
    }
}

function displayQuestion(){
    var questionElt = document.getElementById("question");
    questionElt.textContent = "What is the capital of " + currentCountry.name + "?";
    document.getElementById("timer").textContent = "-";
    displayQuestionCount();
    setTimer();
    displayFlag();
    if(numPlayers > 1){
        displayCurrentPlayer();
    }
}

function displayCurrentPlayer(){
    document.getElementById("current-player").textContent = "Your turn Player " + (currentPlayerId+1);
}

function setTimer(){
    var timerElt = document.getElementById("timer");
    stopTimer();
    timer = new Worker("assets/js/timer.js");
    timer.onmessage = function(e){
        timerElt.textContent = e.data.count;
        if(e.data.complete === true){
            timerElt.textContent = "Time out";
            displayResult(currentPlayerId);
            nextPlayer();
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

function displayFlag(){
    var flagElt = document.getElementById("flag");
    flagElt.setAttribute("src","assets/img/png100px/"+currentCountry.code+".png");
    document.getElementById("flag-link").setAttribute("href","https://en.wikipedia.org/wiki/"+currentCountry.name);
}