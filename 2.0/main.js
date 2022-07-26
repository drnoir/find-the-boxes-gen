// script for generating buildings / game logic etc

// global game vars
const starsNum = getRandomInt(1000,1200);
let gamestarted = false;
let firstDamage = false;
const totalTime = starsNum * 3;
let health = 10;

window.onload = function () {
    // const playBtn = document.getElementById("playBtn");
    const Win = document.getElementById("Win");
    beginGame();
    // playBtn.addEventListener('click', beginGame);

    // LOAD GAME IN BG? PRELOADER?
};

AFRAME.registerComponent('player', {
    init: function () {
        this.el.addEventListener('collide', function (e) {
            console.log('Player has collided with ', e.detail.body.el);
            e.detail.target.el; // Original entity (playerEl).
            e.detail.body.el; // Other entity, which playerEl touched.
            e.detail.contact; // Stats about the collision (CANNON.ContactEquation).
            e.detail.contact.ni; // Normal (direction) of the collision (CANNON.Vec3).
            console.log('NAME' + e.detail.body.el.className);

            if (gamestarted === true) {
                // ADD LOADING ANIMATION - NEED WAY TO DETERMINE LOAD FINISHED
                document.getElementById('collide').play();
                document.getElementById('collide').volume = 0.3;
            }

            if (e.detail.body.el.className === "winbox") {
                console.log("winbox");
                const box = document.querySelector('a-box');
                let winboxRemove = e.detail.body.el;
                box.parentNode.removeChild(winboxRemove);
                document.getElementById('pickup').play();
                decrementScore();
            }

            if (e.detail.body.el.className === "negbox") {
                console.log("negbox");
                const box = document.querySelector('a-box');
                document.getElementById('damage').play();
                health--;
            }


            if (e.detail.body.el.className === "planetAura") {
                console.log("planet Aura");
                const planet = document.querySelector('a-sphere');
                document.getElementById('collect').play();
                spaceMana++;
            }

        });
    }
})

AFRAME.registerComponent('gamebox', {
    init: function () {
        this.direction = 1;
        this.position = new THREE.Vector3();
        this.position.copy(this.el.object3D.position);
        setTimeout(() => {
            this.ready = true;
        }, 3000);
    },

    tick: function () {
        if (!this.ready) return;
        var position = this.el.object3D.position.y;
        if (position <= 0) {
            this.direction = 1;
        } else if (position >= 5) {
            this.direction = -1;
        }
        this.el.object3D.position.set(this.position.x, position + 0.05 * this.direction, this.position.z);
    }

});

function beginGame() {
    let time = 0;
    gamestarted = true;

    document.getElementById('warp').play();
    document.getElementById('warp').volume = 0.4;

    const timeLeft = document.getElementById('timeLeft');
    const totalTimeElm = document.getElementById('totalTime');
    const cubesCreated = document.getElementById('cubesCreated');
    const cubesLeft = document.getElementById('cubesLeft');
    const cubesTotal = document.getElementById('totalCubes');
    const healthLeft = document.getElementById('healthLeft');
    const portalNum = 3;

    createStars(starsNum);
    totalTimeElm.innerHTML = totalTime.toString();
    // healthLeft.innerHTML = health.toString()
    createPlanets(starsNum/90);
    createPortals(portalNum);

    document.getElementById('myAudio').play();
    document.getElementById('myAudio').volume = 0.2;
    console.log("Game Started");
    // playBtn.style.visibility = "hidden";
    updateGameState(time);

}

function restart() {

    location.reload();
}

function decrementScore() {
    amountofWinBoxes--;

    //check for win condition
    if (amountofWinBoxes === 0) {
        document.getElementById("Win").style.visibility = "visible";
        document.getElementById("restart").addEventListener('click', restart);
        console.log("Win Condition met");
    }

}

function updateGameState(time) {
    setInterval(function () {
        time++;
        timeLeft.innerHTML = time;
        // cubesLeft.innerHTML = amountofWinBoxes;
        // healthLeft.innerHTML = health;
        // console.log(time, amountofWinBoxes);
        if (time === totalTime) {
            restart();
        }
        if (health === 0) {
            restart();
        }
        if (health <= 4) {
            document.getElementById('overheat').play();
            document.getElementById('overheat').volume = 0.1;
            if (firstDamage === false) {
                document.getElementById('strobe').setAttribute("visible", true)
                firstDamage = true;
            }
        }

    }, 1000);
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)];
}


function createPlanets(planetsNum) {
    let i;
    for (i = 0; i <planetsNum ; i++) {
        // function to create planets with random position
        let planet = document.createElement('a-sphere');
        let aura = document.createElement('a-sphere');
        let posx = getRandomInt(100, 30000);
        let posz = getRandomInt(1000, 80000);
        let posy = getRandomInt(800, 60000);
        let scale = getRandomInt(500, 900);
        planet.setAttribute('position', {x: posx, y: posy, z: posz});
        planet.object3D.scale.set(scale, scale, scale);
        planet.setAttribute('planet', '');
        planet.setAttribute('material', 'src', 'energy.jpg');
        planet.setAttribute('material', 'color', 'red');
        planet.setAttribute('class', 'planet');
        let colorArr = ['#880000', '#274E13', '#3D85C6','#7F6000'];
        let color = getRandomColor(colorArr);
        planet.setAttribute('material', 'color', color);
        document.querySelector('a-scene').appendChild(planet);
        planet.setAttribute('body', {type: 'dynamic', mass: "80", linearDamping: "0.5"})

    }
}


// aura ode to reuse
// let auraScale = getRandomInt(scale + 25, scale + 25);
// aura.setAttribute('body', {type: 'static'})
// aura.setAttribute('position', {x: posx, y: posy, z: posz});
// aura.object3D.scale.set(auraScale, auraScale, auraScale);
// aura.setAttribute('planetAura', '');

function createPortals(portalsNum){
    let i;
    for (i = 0; i < 3; i++) {
        let portal = document.createElement('a-sky');
        let posxP = getRandomInt(10000, 20000);
        let poszP = getRandomInt(10000, 20000);
        let posyP = getRandomInt(10000, 20000);
        let scaleP = getRandomInt(500, 500);

        portal.setAttribute('position', {x:posxP , y: posyP, z: poszP});
        portal.object3D.scale.set(scaleP, scaleP, scaleP);
        let colorArr = ['white', 'orange', 'red'];
        let color = getRandomColor(colorArr);
        portal.setAttribute('material', 'src',  color);
        portal.setAttribute('name', 'portal');
        portal.setAttribute('class', 'portal');
        portal.setAttribute('material', 'src', '#spaceBG_v');
        document.querySelector('a-scene').appendChild(portal);
    }
}

    function createStars(amount) {
        let starNum = amount;
        let i;
        for (i = 0; i < starNum; i++) {
            let star = document.createElement('a-sphere');
            let posx = getRandomInt(-10000, 80000);
            let posz = getRandomInt(0,3000);
            let posy = getRandomInt(0,3000);
            let scale = getRandomInt(5,8);
            star.setAttribute('position', {x: posx, y: posy, z: posz});
            star.object3D.scale.set(scale, scale, scale);
            star.setAttribute('gamebox', '');
            let colorArr = ['#880000', '#274E13', '#3D85C6','#7F6000'];
            let color = getRandomColor(colorArr);
            star.setAttribute('material', 'src', 'energy.jpg');
            star.setAttribute('material', 'color', color);
            document.querySelector('a-scene').appendChild(star);
            star.setAttribute('body', {type: 'dynamic', mass: "1", linearDamping: "0.1"});
        }
}
