let outsideUmbrella = function (x, umbrellaX) {
    return (x < umbrellaX || x > umbrellaX + 200);
};
let catchHeart = function (x, y, umbrellaX, umbrellaY) {
    return (x >= umbrellaX && x <= umbrellaX + 200 && (y - umbrellaY) <= 20 && (y - umbrellaY) >= 0)
};

// Define rain
class RainDrop {
    constructor() {
        this.x = 10 * floor(random(0, 40));
        this.y = 10 * random(0, 20);
        this.speed = random(5, 7);
    }
    drop() {
        image(rain, this.x, this.y, 8, 10);
        this.y = this.y + this.speed;


    }
}
class HeartDrop {
    constructor() {
        this.x = 20 + 5 * floor(random(0, 75));
        this.y = 50 + 60 * floor(random(60, 100));
        this.speed = random([1, 2, 3]);
        this.size = 15
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
    createCanvas(400, 400);

    for (var numberdrop = 0; numberdrop < 100; numberdrop++) {
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
        textSize(30);
        textFont(normalFont);
        text("Under my Umbrella", 200, 50);
        // the team
        image(team, 100, 80, 200, 200);
        // Game rule
        textSize(14);
        textFont(fancyFont);
        if (leftright === 0) {
            text("Yen & Vu are a couple who love \n grocery shopping and live in Stockholm. \n The weather here is terrible.", 200, 320);
            image(right, 360, 315, 20, 20);
        }
        if (leftright === 1) {
            text("Vu uses his umbrella to protect them \n from the cold rain. He also uses it to \n catch hearts for Yen. How cute!", 200, 320);
            image(left, 20, 315, 20, 20);
            image(right, 360, 315, 20, 20);
        }
        if (leftright === 2) {
            text("The game will stop if you miss > 50 hearts \n and make them cold.  Let's ensure \n they are always warm & romantic!", 200, 320);
            image(left, 20, 315, 20, 20);
        }
        textSize(16);
        fill(210);
        rect(150, 360, 100, 30);
        fill(232, 79, 79);
        text("Start now", 200, 370);
        return;
    }
    // Check if game is over
    if ((heartBroken >= 50 && floor(getCold / 300) > 100) || heartBroken >= 70) {
        //normalText();
        fill(191, 88, 88);
        rect(20, 0, 360, 400);
        image(sad, 100, 80, 200, 200);
        fill(255, 250, 250);
        textSize(30);
        text("GAME OVER", 200, 310);
        text("Your score: " + floor(time / 1000), 200, 350);
        textSize(12);
    }
    else {
        background(217, 255, 0);
        noStroke();
        for (var i = 0; i < theRain.length; i++) {
            theRain[i].drop();
            time++;
            // rain back
            if (outsideUmbrella(theRain[i].x, mouseX)) {
                //this is the notification that the umbrella is not covering the team from Rain
                if (theRain[i].x > 110 && theRain[i].y > 205 && theRain[i].x < 310 & theRain[i].y < 300) {
                    //fancyText();
                    textSize(12);
                    text("We are not covered", 170, 190);
                }
                // losing Cold point
                if (theRain[i].x > 110 && theRain[i].x < 360) {
                    getCold++;
                }
                // if rain reach the end of the canvas, return to 0
                if (theRain[i].y > 400) {
                    theRain[i].y = 0;
                }
            }
            //Umbrella effect. If rains meet umbrella, rain goes back to the top of the canvas
            if (!outsideUmbrella(theRain[i].x, mouseX)) {
                if (theRain[i].y > (mouseY + 20)) {
                    theRain[i].y = 0;
                }
            }

        }
        // Part 2: HEART DROP
        for (var j = 0; j < (theHeart.length); j++) {
            theHeart[j].drop();
            if (outsideUmbrella(theHeart[j].x, mouseX)) {
                // If a heart reaches the bottom, heart goes back to the top, the user loses Heart point.
                if (theHeart[j].y > 400) {
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
        textSize(15);
        textAlign(LEFT, TOP);
        textFont(fancyFont);
        text("Broken Hearts: " + heartBroken + "/50", 30, 30);
        text("Cold: " + floor(getCold / 300) + "%", 30, 50);
        text("Score: " + floor(time / 1000), 300, 30);
        // Other text
        textAlign(CENTER, CENTER);
        // Warning when a condition is met.
        textFont(normalFont);
        textSize(14);
        if (heartBroken >= 50) {
            text("Oh!!!! You broke our hearts.", 200, 140);
        }
        if (floor(getCold / 300) > 100) {
            text("Oouch, we feel cold!", 200, 165);
        }
        // Key graphic
        image(team, 110, 205, 200, 200);
        fill(232, 79, 79);
        //umbrella moves with the mouse
        image(umbrella, mouseX, mouseY, 200, 180);
        textFont(normalFont);
        textSize(14);
    }
};
// Execute game by Pressing Enter rect(150,360,100,30);
function mousePressed() {
    if (mouseX >= 150 && mouseX <= 250 && mouseY >= 360 && mouseY <= 390) {
        toggle = !toggle;
    }
    /*
    image(left, 20, 315, 20, 20);
          image(right, 360, 315, 20, 20);*/
    if (mouseX >= 360 && mouseX <= 380 && mouseY >= 315 && mouseY <= 335) {
        leftright++;
    }
    if (mouseX >= 20 && mouseX <= 40 && mouseY >= 315 && mouseY <= 335) {
        leftright -= 1;
    }
};