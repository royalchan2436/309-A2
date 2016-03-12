/* Initial Canvas */
var canvas;
var ctx;


/* Resume Function */
var resume = false;
function stop(){
      if(resume === true){
         resume = false;
      }else{
         resume = true;
      }
}
document.addEventListener('mousedown', function (event) {

        var mousePosition = getMousePos(canvas, event);
        var x = mousePosition.x;
        var y = mousePosition.y;

        if(x >= 150 && x <= 250 && y >= 0 && y <= 70){
            stop();
        }
});



/* Load score */
var score = 0;
var condition = 5;
var level_1_score = localStorage.getItem("level1");
var level_2_score = localStorage.getItem("level2");
if(level_1_score === null){
   level_1_score = 0;
}
if(level_2_score === null){
   level_2_score = 0;
}

/* Setup the CountDown */
var time = 60;
function countdown() {
    time -= 1;
}

/* Default Level */
var level = 1;

/* Make Foods */
var beer = new Image();
beer.src = 'beer.png';
var foods = [];
var f;
for (f = 0; f < 5; f += 1) { //Make 5 foods
    addFood(f);
}
function addFood(i) {  //Make one random food postion and put it in array

    var food = {
        width: 30,
        length: 30,
        x: Math.random() * 400,
        y: 400 + Math.random() * 50
    };

    foods.push(food);
}

/* Make bugs */


var speed_score;
var bugs = [];
//Let every 1-3 sec produce a bug
setInterval(push_bug, Math.random() * 3000 + 1000);
//Make a random bug and put it into array
function push_bug() {

    speed_score = find_speed_score();

    var bug = {
        width: 20,
        length: 20,
        speed: speed_score.speed,
        x: 400 * Math.random(),
        y: 40,
        score: speed_score.score,
        life: false
    };

    bugs.push(bug);
}
//Random Speed for a bug and set score
function find_speed_score() {

    var temp = Math.random();

    if (level === 1){
        if (temp <= 0.4) { //Orange Probality 0.4
            return{
               speed : 0.06,
               score : 1
            };
        }
        if (temp > 0.4 && temp <= 0.7) { //Red Prob 0.3
          return{
             speed : 0.075,
             score : 3
          };
        }
        if (temp > 0.7) { //Black Prob 0.3
          return{
             speed : 0.15,
             score : 5
          };
        }
    }
    if (level === 2){
        if (temp <= 0.4) {
          return{
             speed : 0.08,
             score : 1
          };
        }
        if (temp > 0.4 && temp <= 0.7) {
          return{
             speed : 0.1,
             score : 3
          };
        }
        if (temp > 0.7) {
          return{
             speed : 0.2,
             score : 5
          };
        }
    }

}


/* Initial Function */
function init() {

    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");

    if (condition === 5){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "50px Arial";
        ctx.fillStyle = "red";
        ctx.fillText("TAP TAP BUG", 40, 200);

        ctx.font = "20px Arial";

        ctx.fillText("Level 1", 170, 350);
        ctx.fillText("Level 2", 170, 400);

        ctx.fillText("LV1 HighScore:"+level_1_score, 120, 450);
        ctx.fillText("LV2 HighScore:"+level_2_score, 120, 500);
    }


    document.addEventListener('mousedown', function (event) {

    var mousePosition = getMousePos(canvas, event);
    var mouseX = mousePosition.x;
    var mouseY = mousePosition.y;

    var p;

    for (p = 0; p < bugs.length; p += 1){

        var bug = bugs[p];
        if (mouseInBug(mouseX, mouseY, bug.x, bug.y, bug.width, bug.length)) {
            bug.life = true;
            score += bug.score;
            bugs.splice(p, 1);
        }
    }

    if (condition === 1 | condition === 2) {
        location.reload();
    }

    if (condition === 5) {
        if(mouseInBug(mouseX, mouseY, 170, 350, 60, 30)){
            condition = 0;
            level = 1;
            setInterval(countdown, 1000);
            requestAnimation();
        }

        if(mouseInBug(mouseX, mouseY, 170, 400, 60, 30)){
            condition = 0;
            level = 2;
            setInterval(countdown, 1000);
            requestAnimation();
        }
    }
    }, false);

    if (condition === 0) {
        requestAnimation();
    }

}

/* Loop the canvas to draw */

function requestAnimation() {

    if (condition === 0) {
        window.requestAnimationFrame(requestAnimation);
    }

    var j, k;

    for (j = 0; j < bugs.length; j += 1) {
        for (k = 0; k < foods.length; k += 1) {
            if (detectCollision(bugs[j], foods[k])) {
                if (foods.length > 1) {
                    foods.splice(k, 1);
                    bugs.splice(j, 1);
                } else {
                    condition = 1;
                }
            }
        }
    }

    if(resume === false){
          draw();
    }

    if (condition === 1) {
        ctx.font = "60px Arial";
        ctx.fillStyle = "black";
        ctx.fillText("GAME Over", 60, 320);
        ctx.font = "30px Arial";
        ctx.fillText("Your score is: " + score, 120, 370);
        ctx.fillText("restart", 125, 410);
        ctx.fillText("exit", 125, 500);

        if(level == 1){
           if(score > level_1_score){
              localStorage.setItem("level1", score);
           }
        }else{
           if(score > level_2_score){
              localStorage.setItem("level2", score);
           }
        }

    }

    if (time === 0) {

        ctx.font = "60px Arial";
        ctx.fillStyle = "black";
        ctx.fillText("YOU WIN", 100, 320);
        ctx.font = "30px Arial";
        ctx.fillText("Your score is: " + score, 130, 370);
        ctx.fillText("restart", 125, 410);
        ctx.fillText("exit", 125, 500);

        if(level == 1){
           if(score > level_1_score){
              localStorage.setItem("level1", score);
           }
        }else{
           if(score > level_2_score){
              localStorage.setItem("level2", score);
           }
        }

        condition = 2;
    }
}

/* As function name */

function mouseInBug(mx, my, bx, by, bw, bl) {
    var dx = mx - bx;
    var dy = my - by;

    return (dx * dx + dy * dy <= bw * bl);
}

/* As function name */

function getMousePos(canvas, evt) {

    var temp = canvas.getBoundingClientRect();

    return {
        x: evt.clientX - temp.left,
        y: evt.clientY - temp.top
    };
}

/* As function name */

function detectCollision(a, b) {
    return (a.y > b.y || a.x == b.x + 50);
}

var array = [];
var food_position;

/* As function name */

function find_small_distance(bug, food){
    var x = Math.abs(bug.x - food.x);
    var y = Math.abs(bug.y - food.y);
    var r = Math.sqrt(x*x + y*y);
    return r;
}

/* Draw All bugs and foods and all respond */

function draw() {

    var k, g;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + score, 300, 20);

    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("time: " + time, 50, 20);

    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Stop ", 180, 20);


    for (k = 0; k < bugs.length; k += 1) {

        var bug = bugs[k];

        if (bug.life === false) {

            ctx.beginPath();
            ctx.arc(bug.x, bug.y, 5, 10, 2 * Math.PI);
            ctx.arc(bug.x, bug.y, 5, 0, 2 * Math.PI);
            ctx.closePath();

            if (bug.speed === 0.06 || bug.speed === 0.08) {
                ctx.fillStyle = "Orange";
            }
            if (bug.speed === 0.075 || bug.speed === 0.1) {
                ctx.fillStyle = "Red";
            }
            if (bug.speed === 0.15 || bug.speed === 0.2) {
                ctx.fillStyle = "Black";
            }
            ctx.stroke();
            ctx.fill();

            var i, food;
            array.length = 0;
            food_position = 0;
            for(i = 0; i < foods.length; i++){
                food = foods[i];
                array.push(find_small_distance(bug, food));
            }

            for(i = 0; i < array.length; i++){
                if(i < array.length - 1){
                    if(array[i] < array[i+1]){
                       food_position = i;
                    }else{
                       food_position = i + 1;
                    }
                }
            }

            if (bug.x < foods[food_position].x) {
                bug.x += bug.speed * 10;
            }
            if (bug.x > foods[food_position].x) {
                bug.x -= bug.speed * 10;
            }
            bug.y += bug.speed * 10;
        }

    }
    for (g = 0; g < foods.length; g += 1){

        var foodx = foods[g];
        ctx.drawImage(beer, foodx.x, foodx.y, 40, 40);
    }
}

/* Load the Game */

window.onload = init;
