data = data.filter(function(dataEntry){
    return dataEntry.capital !== "";
});

var allCountries = data.map(function(dataEntry){
    var country ={};
    country.name = dataEntry.name.common;
    country.capital = dataEntry.capital;
    country.region = dataEntry.region;
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

regions.push("All");


var countries = [];
var currentCountry = {};
var currentRegion = "";
var btns = {};
var playerAnswer = 0;
var correctBtnIndex = 0;
var score = 0;

populateRegions();
populateRegionsUI();
regionSelection();
startGame();
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

function startGame(){
    var startElt = document.getElementById("start-game");
    var warningElt = document.getElementById("warning");
    startElt.addEventListener("click", function(){
        
        if(regions.indexOf(currentRegion) === -1){
            warningElt.textContent = "Please select a region :)";
            return;
        }

        if(currentRegion === "All"){
            countries = allCountries.slice(0);
        }else{
            countries = allCountries.filter(function(country){
                return country.region === currentRegion;
            });
        }

        warningElt.textContent = "";
        document.querySelector("#dropdownMenuButton").textContent = "Select region";
        loadNewQuestion(0);
        hideMainScreen();
        showGameScreen();
        
    });

    var restartElt = document.getElementById("restart");
    restartElt.addEventListener("click", function(){
        showMainScreen();
        hideGameScreen();
    });  
}

function hideMainScreen(){
    document.querySelector(".main-screen").style.visibility = "hidden";
}

function showMainScreen(){
    document.querySelector(".main-screen").style.visibility = "visible";
}

function hideGameScreen(){
    document.querySelector(".game-container").style.visibility = "hidden";
}

function showGameScreen(){
    document.querySelector(".game-container").style.visibility = "visible";
}

function loadNewQuestion(timeDelay){
    setTimeout(function(){
        currentCountry = randomCountry();
        displayQuestion();
        correctBtnIndex = populateBtns();
        clearResult();
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
    if(playerAnswer === correctBtnIndex){
        return true;
    }
    return false;
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
    var timeDelay = 2000;
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
    var reponseElt = document.getElementById("answer");
    if(isCorrect()){
        score+=1;
        reponseElt.textContent = "Correct";
    }else{
        reponseElt.textContent = currentCountry.capital;
    }
    updateScore();
}

function clearResult(){
    var reponseElt = document.getElementById("answer");
    reponseElt.textContent = "";
}

function updateScore(){
    var scoreElt = document.getElementById("score");
    scoreElt.textContent = "Score: " + score;
}

function displayQuestion(){
    var questionElt = document.getElementById("question");
    questionElt.textContent = "What is the capital of " + currentCountry.name + "?";
}