// script for generating buildings / game logic etc
const buildingsNumber = getRandomInt(200);
let amountofWinBoxes = Math.floor(buildingsNumber/4);


window.onload = function() {

    const playBtn = document.getElementById("playBtn");
    const Win = document.getElementById("Win");

    playBtn.addEventListener('click',beginGame);
    // createCubes(buildingsNumber);
    // cubesCreated.innerHTML=buildingsNumber.toString();
    // cubesTotal.innerHTML=amountofWinBoxes.toString();
    // createWinBoxes(amountofWinBoxes);
    // updateGameState(time);
    // document.getElementById('myAudio').play();
    // console.log("loaded");
};

AFRAME.registerComponent('player', {
    init: function() {
        this.el.addEventListener('collide', function(e) {
            console.log('Player has collided with ', e.detail.body.el);
            e.detail.target.el; // Original entity (playerEl).
            e.detail.body.el; // Other entity, which playerEl touched.
            e.detail.contact; // Stats about the collision (CANNON.ContactEquation).
            e.detail.contact.ni; // Normal (direction) of the collision (CANNON.Vec3).
        });
    }
})

AFRAME.registerComponent('winbox', {
    init: function() {
        this.el.addEventListener('collide', function(e) {

            if (e.detail.body.el.id === "camera") {
                const box = document.querySelector('a-box');
                let winboxRemove = e.detail.target.el;
                box.parentNode.removeChild(winboxRemove);
                document.getElementById('pickup').play();
                decrementScore();
            }
            e.detail.target.el; // Original entity (playerEl).
            e.detail.body.el; // Other entity, which playerEl touched.
            e.detail.contact; // Stats about the collision (CANNON.ContactEquation).
            e.detail.contact.ni; // Normal (direction) of the collision (CANNON.Vec3).
        });
    }
})

function beginGame(){
    let time = 0;
    const timeLeft = document.getElementById('timeLeft');
    const cubesCreated = document.getElementById('cubesCreated');
    const cubesLeft= document.getElementById('cubesLeft');
    const cubesTotal= document.getElementById('totalCubes');

    createCubes(buildingsNumber);
    cubesCreated.innerHTML=buildingsNumber.toString();
    cubesTotal.innerHTML=amountofWinBoxes.toString();
    createWinBoxes(amountofWinBoxes);
    updateGameState(time);
    document.getElementById('myAudio').play();
    document.getElementById('myAudio').volume = 0.5;
    console.log("Game Started");
    playBtn.style.visibility = "hidden";
}

function restart(){
    location.reload();
}

function decrementScore(){
    amountofWinBoxes--;
}

function  updateGameState(time){
    setInterval(function(){
        time++;
        timeLeft.innerHTML=time;
        cubesLeft.innerHTML=amountofWinBoxes;
        console.log(time, amountofWinBoxes);
        if (time===100){
            restart();
        }
        if (amountofWinBoxes===0){
            document.getElementById("Win").style.visibility = "visible";
            console.log("Win Condition met");
        }

    }, 1000);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function getRandomColor(colors){
    return colors[Math.floor(Math.random() * colors.length)];
}

function createWinBoxes(amount) {
    let winBoxNum = amount;
    let i;
    for (i = 0; i < winBoxNum; i++) {
        let winbox = document.createElement('a-box');
        console.log("created box");
        let posx =getRandomInt(80);
        let posz =getRandomInt(100);
        let scale = getRandomInt(4);

        winbox.setAttribute('position', {x: posx, y: 20, z: posz});
        winbox.object3D.scale.set(scale, scale, scale);
        winbox.setAttribute('material', 'color', 'white');
        winbox.setAttribute('name', 'winbox');
        winbox.setAttribute('winbox', '');
        document.querySelector('a-scene').appendChild(winbox);
        winbox.setAttribute('body', {type: "dynamic"})
    }
}


function createCubes(amount) {
    let boxNum = amount;
    let i;
    for (i = 0; i < boxNum; i++) {
        let building = document.createElement('a-box');
        console.log("created box");
        let posx =getRandomInt(80);
        let posz =getRandomInt(100);
        let scale = getRandomInt(15);
        let colorArr = ['red', 'green', 'blue', 'brown'];
        let textureArr = []
        let color = getRandomColor(colorArr);
        building.setAttribute('position', {x: posx, y: 10, z: posz});
        building.object3D.scale.set(scale, scale, scale);
        building.setAttribute('material', 'src', 'brick.jpg');
        building.setAttribute('material', 'color', color);
        document.querySelector('a-scene').appendChild(building);
        building.setAttribute('body', {type: "dynamic"})
    }
}