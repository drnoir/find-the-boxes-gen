// script for generating buildings / game logic etc
const buildingsNumber = getRandomInt(10, 200);

let amountofWinBoxes = Math.floor(buildingsNumber/10);
let amountofnegBoxes = Math.floor(buildingsNumber/20);
let gamestarted = false;

const totalTime  = buildingsNumber*3;
let health = 10;

window.onload = function() {
    const playBtn = document.getElementById("playBtn");
    const Win = document.getElementById("Win");
    playBtn.addEventListener('click',beginGame);
};

AFRAME.registerComponent('player', {
    init: function() {
        this.el.addEventListener('collide', function(e) {
            console.log('Player has collided with ', e.detail.body.el);
            e.detail.target.el; // Original entity (playerEl).
            e.detail.body.el; // Other entity, which playerEl touched.
            e.detail.contact; // Stats about the collision (CANNON.ContactEquation).
            e.detail.contact.ni; // Normal (direction) of the collision (CANNON.Vec3).
            console.log('NAME'+e.detail.body.el.className);

            if (gamestarted === true){
                document.getElementById('collide').play();
                document.getElementById('collide').volume = 0.3;
            }

            if (e.detail.body.el.className=== "winbox")
            {
                console.log("winbox");
                const box = document.querySelector('a-box');
                let winboxRemove = e.detail.body.el;
                box.parentNode.removeChild(winboxRemove);
                document.getElementById('pickup').play();
                decrementScore();
            }

            if (e.detail.body.el.className=== "negbox")
            {
                console.log("negbox");
                const box = document.querySelector('a-box');
                document.getElementById('damage').play();
                health--;
            }

        });
    }
})

AFRAME.registerComponent('gamebox', {
    init: function() {
        this.direction = 1;
        this.position = new THREE.Vector3();
        this.position.copy(this.el.object3D.position);
        setTimeout(() => {
            this.ready = true;
        }, 3000);
    },

    tick: function() {
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



function beginGame(){
    let time = 0;
    gamestarted = true;

    const timeLeft = document.getElementById('timeLeft');
    const totalTimeElm = document.getElementById('totalTime');
    const cubesCreated = document.getElementById('cubesCreated');
    const cubesLeft= document.getElementById('cubesLeft');
    const cubesTotal= document.getElementById('totalCubes');
    const healthLeft= document.getElementById('healthLeft');
    createCubes(buildingsNumber);
    cubesCreated.innerHTML=buildingsNumber.toString();
    cubesTotal.innerHTML=amountofWinBoxes.toString();
    totalTimeElm.innerHTML=totalTime.toString();
    healthLeft.innerHTML = health.toString();

    createWinBoxes(amountofWinBoxes);
    createnNegBoxes(amountofnegBoxes);
    document.getElementById('myAudio').play();
    document.getElementById('myAudio').volume = 0.2;
    console.log("Game Started");
    playBtn.style.visibility = "hidden";
    updateGameState(time);

}

function restart(){
    location.reload();
}

function decrementScore(){
    amountofWinBoxes--;

    //check for win condition
    if (amountofWinBoxes===0){
        document.getElementById("Win").style.visibility = "visible";
        document.getElementById("restart").addEventListener('click',restart);
        console.log("Win Condition met");
    }

}

function  updateGameState(time){
    setInterval(function(){
        time++;
        timeLeft.innerHTML=time;
        cubesLeft.innerHTML=amountofWinBoxes;
        healthLeft.innerHTML=health;
        console.log(time, amountofWinBoxes);
        if (time===totalTime){
            restart();
        }
        if (health===0){
            restart();
        }

    }, 1000);
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomColor(colors){
    return colors[Math.floor(Math.random() * colors.length)];
}

function createWinBoxes() {
    let i;
    for (i = 0; i < amountofWinBoxes; i++) {
        let winbox = document.createElement('a-box');
        console.log("created box");
        let posx =getRandomInt(10, 80);
        let posz =getRandomInt(10,100);
        let scale = getRandomInt(5,10);

        winbox.setAttribute('position', {x: posx, y: 250, z: posz});
        winbox.object3D.scale.set(scale, scale, scale);
        winbox.setAttribute('material', 'color', 'white');
        winbox.setAttribute('name', 'winbox');
        winbox.setAttribute('winbox', '');
        winbox.setAttribute('class', 'winbox');
        winbox.setAttribute('material', 'src', 'energy.jpg');
        document.querySelector('a-scene').appendChild(winbox);
        winbox.setAttribute('body', {type: "dynamic"})
    }
}

function createnNegBoxes() {
    let i;
    for (i = 0; i < amountofnegBoxes; i++) {
        let negbox = document.createElement('a-box');
        console.log("created box");
        let posx =getRandomInt(10,80);
        let posz =getRandomInt(10,100);
        let scale = getRandomInt(5,10);

        negbox.setAttribute('position', {x: posx, y: 250, z: posz});
        negbox.object3D.scale.set(scale, scale, scale);
        negbox.setAttribute('material', 'color', 'white');
        negbox.setAttribute('name', 'negbox');
        negbox.setAttribute('negbox', '');
        negbox.setAttribute('class', 'negbox');
        negbox.setAttribute('material', 'src', 'energyneg.jpg');
        document.querySelector('a-scene').appendChild(negbox);
        negbox.setAttribute('body', {type: "dynamic"})
    }
}


function createCubes(amount) {
    let boxNum = amount;
    let i;
    for (i = 0; i < boxNum; i++) {
        let building = document.createElement('a-box');
        console.log("created box");
        let posx =getRandomInt(10,80);
        let posz =getRandomInt(10,100);
        let scale = getRandomInt(10,15);
        let colorArr = ['red', 'green', 'blue', 'brown'];
        let color = getRandomColor(colorArr);
        building.setAttribute('position', {x: posx, y: 250, z: posz});
        building.object3D.scale.set(scale, scale, scale);
        building.setAttribute('gamebox', '');
        building.setAttribute('material', 'src', 'energy.jpg');
        building.setAttribute('material', 'color', color);
        document.querySelector('a-scene').appendChild(building);
        building.setAttribute('body', {type: "dynamic"})
    }
}
