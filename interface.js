var toolnames = ['particle', 'field', 'select'];

var currentTool = 0;
//0 = add particle
//1 = add field
//2 = select

var settings = {
    particle: {
        charge: 0,
        chargeExp: 0,
        mass: 1,
        massExp: 0,
        dropx: 0,
        dropy: 0,
        dragging: false
    },
    field: {
        type: 'electrical',
        strength: 1,
		strengthExp: 0,
		dirActive: false,
		direction: {components: [0, -1, 0]}	//vector h4x,
		cropping: false,
		dragging: false
    },
    select: {
    
    }
};


function run() {
    running = !running;
    document.getElementById('startstop').innerHTML = running?"Pause":"Run";
    document.getElementById('step').disabled = running;
}

function selectTool(tool) {
	if (currentTool == tool) {
		return;
	}
	removeClass(document.getElementById('tool'+currentTool), "selected");
	addClass(document.getElementById('tool'+tool), "selected");
	document.getElementById('opts'+currentTool).style.display = 'none';
	document.getElementById('opts'+tool).style.display = 'block';
	currentTool = tool;
}

function updateCharge() {
    settings.particle.charge = parseFloat(document.getElementById('particleCharge').value);
    document.getElementById('particleCharge').value = settings.particle.charge.toString();
}

function updateChargeExp() {
    settings.particle.chargeExp = parseInt(document.getElementById('particleChargeExp').value);
    document.getElementById('particleChargeExp').value = settings.particle.chargeExp.toString();
}

function updateMass() {
    var m = parseFloat(document.getElementById('particleMass').value);
    if (m <= 0) {
        m = settings.particle.mass;
    }
    settings.particle.mass = m;
    document.getElementById('particleMass').value = settings.particle.mass.toString();
}

function updateMassExp() {
    settings.particle.massExp = parseInt(document.getElementById('particleMassExp').value);
    document.getElementById('particleMassExp').value = settings.particle.massExp.toString();
}

function updateScale() {
    var f = parseFloat(document.getElementById('scaleDistance').value);
    document.getElementById('scaleDistance').value = f.toString();
    pixelsPerMeter = 100/f;
}

function clearOffscreenParticles() {		//TODO: Do this

}

function updateFieldType() {
	var type = document.getElementById('fieldType').value;
	settings.field.type = type;
	if (type == 'electrical') {
		document.getElementById('eDirectionDiv').style.display = 'none';
		document.getElementById('mDirectionDiv').style.display = 'block';
		document.getElementById('funits').innerHTML = 'N/C=V/m';
	} else {
		document.getElementById('eDirectionDiv').style.display = 'block';
		document.getElementById('mDirectionDiv').style.display = 'none';
		document.getElementById('funits').innerHTML = 'Teslas';
	}
}

function updateStrength() {
    var m = parseFloat(document.getElementById('fieldStrength').value);
    if (m <= 0) {
        m = settings.field.strength;
    }
    settings.field.strength = m;
    document.getElementById('fieldStrength').value = settings.field.strength.toString();
}

function updateStrengthExp() {
    settings.field.strengthExp = parseInt(document.getElementById('fieldStrengthExp').value);
    document.getElementById('fieldStrengthExp').value = settings.field.strengthExp.toString();
}

function mouseDown(e) {
    if (currentTool == 0) {
        settings.particle.dropX = e.pageX;
        settings.particle.dropY = e.pageY;
        settings.particle.dragging = particleList.length;
	    addParticle(new particle(settings.particle.mass*Math.pow(10,settings.particle.massExp), settings.particle.charge*Math.pow(10,settings.particle.chargeExp), e.pageX/pixelsPerMeter, e.pageY/pixelsPerMeter));
	    particleList[particleList.length-1].fixed = true;
	} else if (currentTool == 1) {
		if (settings.field.type == 'electrical') {
			addField(electricalField(settings.field.direction.scale(settings.field.strength*Math.pow(10, settings.field.strengthExp))),new Rectangle(e.pageX/pixelsPerMeter, e.pageY/pixelsPerMeter, 0, 0));
			settings.field.cropping = fieldList.length-1;
	}
}

function mouseMove(e) {
    if (currentTool == 0) {
        if (settings.particle.dragging !== false) {
            particleList[settings.particle.dragging].x = e.pageX/pixelsPerMeter;
            particleList[settings.particle.dragging].y = e.pageY/pixelsPerMeter;
        }
    } else if (currentTool == 1) {
		if (settings.field.cropping !== false) {
			fieldList[settings.field.cropping].bounds.x2 = e.pageX/pixelsPerMeter;
			fieldList[settings.field.cropping].bounds.y2 = e.pageY/pixelsPerMeter;
		}
	}
}

function mouseUp(e) {
    if (currentTool == 0) {
        if (settings.particle.dragging !== false) {
            particleList[settings.particle.dragging].fixed = false;
            particleList[settings.particle.dragging].vel = new vector([(e.pageX-settings.particle.dropX)/pixelsPerMeter, (e.pageY-settings.particle.dropY)/pixelsPerMeter, 0]); 
            settings.particle.dragging = false;
        }
    } else if (currentTool == 1) {
		
	}
}

function touchDown(e) {

}

function touchMove(e) {

}

function touchUp(e) {

}




function mouseDownE(e) {
    settings.field.dirActive = true;
	mouseMoveE(e);
}

function mouseMoveE(e) {
	if (settings.field.dirActive) {
		var rx = e.pageX - e.target.offsetLeft;
		var ry = e.pageY - e.target.offsetTop;
		settings.field.direction = new vector([rx - 75, ry - 75, 0]).getUnitVector();
	}
}

function mouseUpE(e) {
    settings.field.dirActive = false;
}

function touchDownE(e) {

}

function touchMoveE(e) {

}

function touchUpE(e) {

}