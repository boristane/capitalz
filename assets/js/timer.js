const TIME_TO_ANSWER = 16;
var count = TIME_TO_ANSWER;

var timer = setInterval(function(){
    
    var complete = false;
    count-=1;
    if(count <= 0){
        complete = true;
        clearInterval(timer);
    }
    postMessage({
        complete: complete,
        count: count
    });

}, 1000);