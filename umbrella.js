let a = 1;
let outsideUmbrella = function (x, umbrellaX) {
    return (x < umbrellaX || x > umbrellaX + a * 200);
};
let catchHeart = function (x, y, umbrellaX, umbrellaY) {
    return (x >= umbrellaX && x <= umbrellaX + a * 200 && (y - umbrellaY) <= a * 20 && (y - umbrellaY) >= 0)
};

// Define rain
class RainDrop {
    constructor() {
        this.x = a * 10 * floor(random(0, 40));
        this.y = a * 10 * random(0, 20);
        this.speed = random(5, 7);
    }
    drop() {
        image(rain, this.x, this.y, 7 * a, 10 * a);
        this.y = this.y + this.speed * a;


    }
}
class HeartDrop {
    constructor() {
        this.x = 20 + a * 5 * floor(random(0, 75));
        this.y = 30 + a * 60 * floor(random(60, 100));
        this.speed = random([1, 2, 3, 4]);
        this.size = a * 15;
    }
    drop() {
        image(heart, this.x, this.y, this.size, this.size);
        this.y += 5 + this.speed;
    }
}

let theRain = [];
let theHeart = [];
let toggle = false;
let heartBroken = 0;
let getCold = 0;
let time = 0;
let sad;
let team;
let heart;
let leftright = 0;
let outsideCanvas = false;
let button;
function preload() {
    sad = loadImage('assets/sad.png');
    team = loadImage('assets/couple.png');
    heart = loadImage('assets/heart.png');
    umbrella = loadImage('assets/umbrella.png');
    right = loadImage('assets/right-arrow.png');
    left = loadImage('assets/left-arrow.png');
    rain = loadImage('assets/rain.png');
    normalFont = loadFont('assets/animeace.ttf');
    fancyFont = loadFont('assets/type-font.ttf');
}
function setup() {
    if (windowHeight <= windowWidth) {
        a = (windowHeight - 80) / 400;
    }
    else {
        a = (windowWidth - 80) / 400;
    }
    createCanvas(400 * a, 400 * a);
    for (var numberdrop = 0; numberdrop < a * 100; numberdrop++) {
        theRain.push(new RainDrop());
    }

    for (var numberheart = 0; numberheart < 5; numberheart++) {
        theHeart.push(new HeartDrop());
    }
}
function draw() {
    if (!toggle) {
        background(217, 255, 0);
        textAlign(CENTER, CENTER);
        textSize(28 * a);
        textFont(normalFont);
        text("Under my Umbrella", a * 200, a * 50);
        // the team
        image(team, a * 100, a * 80, a * 200, a * 200);
        // Game rule
        textSize(a * 14);
        textFont(fancyFont);
        if (leftright === 0) {
            text("Yen & Vu are a couple who love \n grocery shopping and live in Stockholm. \n The weather here is terrible.", a * 200, a * 320);
            image(right, a * 360, a * 315, a * 20, a * 20);
        }
        if (leftright === 1) {
            text("Vu uses his umbrella to protect them \n from the cold rain. He also uses it to \n catch hearts for Yen. How cute!", a * 200, a * 320);
            image(left, a * 20, a * 315, a * 20, a * 20);
            image(right, a * 360, a * 315, a * 20, a * 20);
        }
        if (leftright === 2) {
            text("The game will stop if you miss > 50 hearts \n and make them cold.  Let's ensure \n they are always warm & romantic!", a * 200, a * 320);
            image(left, a * 20, a * 315, a * 20, a * 20);
        }
        textSize(a * 16);
        fill(210);
        rect(a * 150, a * 360, a * 100, a * 30);
        fill(232, 79, 79);
        text("Start now", a * 200, a * 370);
        return;
    }
    // Check if game is over
    if ((heartBroken >= 50 && floor(getCold / 300) > 100) || heartBroken >= 70) {
        //normalText();
        fill(191, 88, 88);
        rect(a * 20, a * 0, a * 360, a * 400);
        image(sad, a * 100, a * 80, a * 200, a * 200);
        fill(255, 250, 250);
        textSize(a * 30);
        text("GAME OVER", a * 200, a * 310);
        text("Your score: " + floor(time / 1000), a * 200, a * 350);
        textSize(a * 12);
    }
    else {
        background(217, 255, 0);
        noStroke();
        for (var i = 0; (i < theRain.length) && (!outsideCanvas); i++) {
            theRain[i].drop();
            time++;
            // rain back
            if (outsideUmbrella(theRain[i].x, mouseX)) {
                //this is the notification that the umbrella is not covering the team from Rain
                if (theRain[i].x > a * 110 && theRain[i].y > a * 205 && theRain[i].x < a * 310 & theRain[i].y < a * 300) {
                    //fancyText();
                    textSize(a * 12);
                    text("We are not covered", a * 170, a * 190);
                }
                // losing Cold point
                if (theRain[i].x > a * 110 && theRain[i].x < a * 360) {
                    getCold++;
                }
                // if rain reach the end of the canvas, return to 0
                if (theRain[i].y > a * 400) {
                    theRain[i].y = 0;
                }
            }
            //Umbrella effect. If rains meet umbrella, rain goes back to the top of the canvas
            if (!outsideUmbrella(theRain[i].x, mouseX)) {
                if (theRain[i].y > (mouseY + a * 20)) {
                    theRain[i].y = 0;
                }
            }

        }
        // Part 2: HEART DROP
        for (var j = 0; j < (theHeart.length) && (!outsideCanvas); j++) {
            theHeart[j].drop();
            if (outsideUmbrella(theHeart[j].x, mouseX)) {
                // If a heart reaches the bottom, heart goes back to the top, the user loses Heart point.
                if (theHeart[j].y > a * 400) {
                    heartBroken++;
                    theHeart[j].y = 0;
                }
            }
            if (catchHeart(theHeart[j].x, theHeart[j].y, mouseX, mouseY)) {
                theHeart[j].y = 0;
            }
        }


        // Scoreboard
        fill(237, 35, 193);
        textSize(a * 15);
        textAlign(LEFT, TOP);
        textFont(fancyFont);
        text("Broken Hearts: " + heartBroken + "/50", a * 30, a * 30);
        text("Cold: " + floor(getCold / 300) + "%", a * 30, a * 50);
        text("Score: " + floor(time / 1000), a * 300, a * 30);
        // Other text
        textAlign(CENTER, CENTER);
        // Warning when a condition is met.
        textFont(normalFont);
        textSize(a * 14);
        if (heartBroken >= 50) {
            text("Oh!!!! You broke our hearts.", a * 200, a * 140);
        }
        if (floor(getCold / 300) > 100) {
            text("Oouch, we feel cold!", a * 200, a * 165);
        }
        // Key graphic
        image(team, a * 110, a * 205, a * 200, a * 200);
        fill(232, 79, 79);
        //umbrella moves with the mouse
        image(umbrella, mouseX, mouseY, a * 200, a * 180);
        textFont(normalFont);
        textSize(a * 14);
        if (outsideCanvas) {
            fill(220);
            rect(a * 20, a * 0, a * 360, a * 400);
            fill(232, 79, 79)
            text("Paused! \n Move your mouse back\n when you're ready", a * 200, a * 200)
        }
    }
};
// Execute game by Click 
function mousePressed() {
    if (mouseX >= a * 150 && mouseX <= a * 250 && mouseY >= a * 360 && mouseY <= a * 390) {
        toggle = !toggle;
    }
    if (mouseX >= a * 360 && mouseX <= a * 380 && mouseY >= a * 315 && mouseY <= a * 335) {
        leftright++;
    }
    if (mouseX >= a * 20 && mouseX <= a * 40 && mouseY >= a * 315 && mouseY <= a * 335) {
        leftright -= 1;
    }
};
function mouseMoved() {
    if ((mouseX > a * 400) || (mouseY > a * 400)) {
        outsideCanvas = true;
    }
    else {
        outsideCanvas = false;
    }
    function touchMoved() {
        fill(255, 0, 0)
        rect(x, y, 10, 10);
    }
}