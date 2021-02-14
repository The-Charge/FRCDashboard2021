// Define UI elements
let ui = {
    timer: document.getElementById('timer'),
    robotState: document.getElementById('robot-state'),
    camera1: document.getElementById('camera1'),
    camera2: document.getElementById('camera2'),
    gyro: {
        turret: {
            marker: document.getElementById('turret-direction'),
            value: 0,
        }
    },
    climber: {
        slider: document.getElementById('test-element-climber'),
        arm: document.getElementById('climb-arm'),
        top: document.getElementById('climb-top'),
    },
    elevation: {
        slider: document.getElementById('test-element-elevation'),
        arm: document.getElementById('turret-elevation'),
        number: document.getElementById('elevation-number'),
    },
    vision: {
        text: document.getElementById('vision-target'),
        found: document.getElementById('vision-target-found'),
        moving: document.getElementById('vision-target-moving'),
        none: document.getElementById('vision-target-none'),
        leftArrow: document.getElementById('left-arrow'),
        rightArrow: document.getElementById('right-arrow'),
        degreeNumber: document.getElementById('vision-degrees'),
    },
    gearText: document.getElementById('gear'),
    indexerText: document.getElementById('indexer-text'),
    autoSelect: document.getElementById('auto-select'),
    ballCount: document.getElementById('ball-count'),
    turretSpeed: document.getElementById('turret-speed'),
    stopperButton: document.getElementById('stopper-toggle'),
    // testInput: document.getElementById('test-element'),
    // panelText: document.getElementById('control-panel'),
};

// Update camera every second. This is necessary because if the camera disconnects during the match, it will not automatically reconnect
setInterval(() => {
    // TEST IMAGES:
    ui.camera1.style.backgroundImage = 'url("https://i.ytimg.com/vi/ekthcIHDt3I/maxresdefault.jpg")';
    ui.camera2.style.backgroundImage = 'url("https://i.ytimg.com/vi/ekthcIHDt3I/maxresdefault.jpg")';
}, 500);


var stopperOpen = true;

function stopperToggle() {
    stopperOpen = !stopperOpen;
    if(stopperOpen == false) {
        ui.stopperButton.innerHTML = "Stopper Closed";
        ui.stopperButton.classList.add('off');
        ui.stopperButton.classList.remove('on');
    }
    else {
        ui.stopperButton.innerHTML = "Stopper Open";
        ui.stopperButton.classList.add('on');
        ui.stopperButton.classList.remove('off');
    }

    NetworkTables.putValue('/SmartDashboard/Stopper Toggle', stopperOpen);
}

// Update match timer
NetworkTables.addKeyListener('/robot/time', (key, value) => {
    ui.timer.textContent = value < 0 ? '0:00' : Math.floor(value / 60) + ':' + (value % 60 < 10 ? '0' : '') + value % 60;
});

// Error handler
addEventListener('error',(ev)=>{
    ipc.send('windowError',{mesg:ev.message,file:ev.filename,lineNumber:ev.lineno})
});

//Event Listeners:

NetworkTables.addKeyListener('/SmartDashboard/Turret Rotation', (key, value) => { //FINAL NETWORKTABLE VALUE
    ui.gyro.turret.marker.setAttribute('transform', 'rotate(' + value + ',0,38.5)');
});

NetworkTables.addKeyListener('/SmartDashboard/Turret Valid Angle Setpoint', (key, value) => { //FINAL NETWORKTABLE VALUE
    if(value == true) {
        ui.vision.leftArrow.classList.add('on');
        ui.vision.rightArrow.classList.add('on');
        ui.vision.leftArrow.classList.remove('off');
        ui.vision.rightArrow.classList.remove('off');
        ui.vision.degreeNumber.style.fill = black;
    } else {
        ui.vision.leftArrow.classList.add('off');
        ui.vision.rightArrow.classList.add('off');
        ui.vision.leftArrow.classList.remove('on');
        ui.vision.rightArrow.classList.remove('on');
        ui.vision.degreeNumber.style.fill = white;
    }
});

NetworkTables.addKeyListener('/SmartDashboard/Climber Elevation', (key, value) => {
    ui.climber.arm.style.y = String(150 - parseInt(value));
    ui.climber.top.style.cy = String(132 - parseInt(value));
});

NetworkTables.addKeyListener('/SmartDashboard/Turret Elevation', (key, value) => { //FINAL NETWORKTABLE VALUE
    ui.elevation.arm.setAttribute('transform', 'rotate(-' + value + ',-60,0)');
    ui.elevation.number.innerHTML = round(value) + '°';
});

NetworkTables.addKeyListener('/SmartDashboard/Ball Count', (key, value) => {
    ui.ballCount.innerHTML = value;
    if(parseInt(value) == 5) {
        ui.ballCount.style.color = 'lime';
        ui.ballCount.style.fontWeight = 'bold';
    }
    else {
        ui.ballCount.style.color = 'white';
        ui.ballCount.style.fontWeight = 'normal';
    }
});

NetworkTables.addKeyListener('/SmartDashboard/Vision Status', (key, value) => { //FINAL NETWORKTABLE VALUE
    //0 is none, 1 is moving, 2 is found
    if(value == 'none' || 'disabled') {
        value = 0;
    } else if(value == 'homing') {
        value = 1;
    } else if(value == 'locked') {
        value = 2;
    } else {
        value = -1;
    }

    if(parseInt(value) == 0) {
        ui.vision.text.innerHTML = 'NONE';
        ui.vision.text.style.color = 'red';
        ui.vision.none.style.opacity = 1;
        ui.vision.moving.style.opacity = 0;
        ui.vision.found.style.opacity = 0;
    } else if(parseInt(value) == 1) {
        ui.vision.text.innerHTML = 'MOVING';
        ui.vision.text.style.color = 'yellow';
        ui.vision.none.style.opacity = 1;
        ui.vision.moving.style.opacity = 1;
        ui.vision.found.style.opacity = 0;
    } else if(parseInt(value) == 2) {
        ui.vision.text.innerHTML = 'FOUND';
        ui.vision.text.style.color = 'lime';
        ui.vision.none.style.opacity = 1;
        ui.vision.moving.style.opacity = 1;
        ui.vision.found.style.opacity = 1;
    } else if(parseInt(value) == -1) {
        ui.vision.text.innerHTML = 'ERROR';
        ui.vision.text.style.color = 'red';
        ui.vision.none.style.opacity = 0;
        ui.vision.moving.style.opacity = 0;
        ui.vision.found.style.opacity = 0;
    }
});

NetworkTables.addKeyListener('/SmartDashboard/High Gear', (key, value) => { //FINAL NETWORKTABLE VALUE
    if(value == true) {
        ui.gearText.innerHTML = 'HIGH';
        ui.gearText.classList.add(on);
        ui.gearText.classList.remove(off);
    } else {
        ui.gearText.innerHTML = 'LOW';
        ui.gearText.classList.add(off);
        ui.gearText.classList.remove(on);
    }
});

NetworkTables.addKeyListener('/SmartDashboard/Shooter Speed', (key, value) => {
    if(value == true) {
        ui.turretSpeed.innerHTML = "At Speed";
        ui.turretSpeed.classList.add(on);
        ui.turretSpeed.classList.remove(warning);
    } else {
        ui.turretSpeed.innerHTML = "Below Speed";
        ui.turretSpeed.classList.add(warning);
        ui.turretSpeed.classList.remove(on);
    }
});

NetworkTables.addKeyListener('/SmartDashboard/Indexer', (key, value) => {
    if(value == true) {
        ui.indexerText.innerHTML = 'RUNNING';
        ui.indexerText.style.classList.add(on);
        ui.indexerText.style.classList.remove(off);
    } else {
        ui.indexerText.innerHTML = 'STOPPED';
        ui.indexerText.style.classList.add(off);
        ui.indexerText.style.classList.remove(on);
    }
});

NetworkTables.addKeyListener('/SmartDashboard/Turret Angle To Setpoint', (key, value) => { //FINAL NETWORKTABLE VALUE
    if(value == 0) {
        ui.vision.degreeNumber.style.opacity = 0;
        ui.vision.leftArrow.style.opacity = 0;
        ui.vision.rightArrow.style.opacity = 0;

    } else {
        if(value > 0) {
            ui.vision.rightArrow.style.opacity = 1;
            ui.vision.leftArrow.style.opacity = 0;
        } else {
            ui.vision.rightArrow.style.opacity = 0;
            ui.vision.leftArrow.style.opacity = 1;
        }
        ui.vision.degreeNumber.style.opacity = 1;
        ui.vision.degreeNumber.innerHTML = Math.abs(value) + 'º';
    }
});

// UNTESTED:
// Load list of prewritten autonomous modes
NetworkTables.addKeyListener('/SmartDashboard/AutoSelect', (key, value) => { //FINAL NETWORKTABLE VALUE
    // Clear previous list
    while (ui.input.autoSelect.firstChild) {
        ui.input.autoSelect.removeChild(ui.input.autoSelect.firstChild);
    }
    // Make an option for each autonomous mode and put it in the selector
    for (let i = 0; i < value.length; i++) {
        var option = document.createElement('option');
        option.appendChild(document.createTextNode(value[i]));
        ui.input.autoSelect.appendChild(option);
    }
    // Set value to the already-selected mode. If there is none, nothing will happen.
    ui.input.autoSelect.value = NetworkTables.getValue('/SmartDashboard/currentlySelectedMode');
});
