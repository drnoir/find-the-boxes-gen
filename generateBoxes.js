// script for generating buildings / game logic etc

window.onload = function() {
    const amountofWinBoxes = 5;
    let time = 0;
    createCubes(50);
    createWinBoxes(5);
    updateGameState(time, amountofWinBoxes);
    console.log("loaded");
};

AFRAME.registerComponent('player', {
    init: function() {
        this.el.addEventListener('collide', function(e) {
            console.log('Player has collided with ', e.detail.body.el);
            console.log(e.getAttribute('name'));
            e.detail.target.el; // Original entity (playerEl).
            e.detail.body.el; // Other entity, which playerEl touched.
            e.detail.contact; // Stats about the collision (CANNON.ContactEquation).
            e.detail.contact.ni; // Normal (direction) of the collision (CANNON.Vec3).
        });
    }
})

function restart(){
    location.reload();
}

function  updateGameState(time, amountofWinBoxes){
    setInterval(function(){
        time++;
        console.log(time);
        if (time===100){
            restart();
        }
        if (amountofWinBoxes===0){
            alert("you found all the boxes");
            restart();
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
        let color = getRandomColor(colorArr);
        building.setAttribute('position', {x: posx, y: 10, z: posz});
        building.object3D.scale.set(scale, scale, scale);
        // building.setAttribute('material', 'src', 'fac.jpg');
        building.setAttribute('material', 'color', color);
        document.querySelector('a-scene').appendChild(building);
        building.setAttribute('body', {type: "dynamic"})
    }
}