var toolnames = ['particle', 'field', 'select'];

var currentTool = 0;
//0 = add particle
//1 = add field
//2 = select

var settings = {
    particle: {
        charge: 0,
        chargeExp: -6,
        chargeSign: 1,
        mass: 1,
        massExp: 0,
		size: 2,
		sizeExp: -3,
        dropx: 0,
        dropy: 0,
        dragging: false,
		fixed: false
    },
    field: {
        type: 'electrical',
        strength: 1,
		strengthExp: 0,
		magSign: 1,
		dirActive: false,
		direction: {components: [0, -1, 0]},
		cropping: false,
		dragging: false,
		gravity: false
    },
    select: {

    }
};


function run() {
    running = !running;
    document.getElementById('startstop').innerHTML = running?"Pause":"Run";
    document.getElementById('step').disabled = running;
	document.getElementById('notrunning').style.display = running?"none":"block";
	document.getElementById('running').style.display = running?"block":"none";
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

function gravityToggle() {
	settings.field.gravity = document.getElementById('gravityToggle').checked;
}

function expNumber(number) {
	var abs = Math.abs(number);
	this.sign = number/abs;
	if (abs == 0) {
		this.base = 0;
		this.exp = 0;
	} else {
		var log = Math.floor(Math.log(abs)/Math.log(10));
		this.exp = log;
		this.base = abs*Math.pow(10, -log);
	}
}

expNumber.prototype.getVal = function () {
	return this.sign * this.base * Math.pow(10, this.exp);
}

function inputField(dest, options) {
	var div = document.createElement('div');
	this.value = options.value;
	div.appendChild(document.createTextNode(options.name + ' (' + options.units + '): '));
	if (options.canBeNegative) {
		var sign = document.createElement('a');
		a.className = 'button square';
		a.innerHTML = (options.value.sign < 0)?'-':'+';
		a.owner = this;
		a.onclick = function () {
			this.owner.value.sign = -this.owner.value.sign;
			this.innerHTML = (this.owner.value.sign < 0)?'-':'+';
		}
		div.appendChild(sign);
	}
	var root = document.createElement('input');
	root.type = 'number';
	root.style.width = 60;
	
	
}

function updateCharge() {
    var m = parseFloat(document.getElementById('particleCharge').value);
    if (m < 0) {
        m = settings.particle.charge;
    }
    settings.particle.charge = m;
    document.getElementById('particleCharge').value = settings.particle.charge.toString();
}

function updateChargeExp() {
    settings.particle.chargeExp = parseInt(document.getElementById('particleChargeExp').value);
    document.getElementById('particleChargeExp').value = settings.particle.chargeExp.toString();
}

function toggleChargeSign() {
    settings.particle.chargeSign = -settings.particle.chargeSign;
    document.getElementById('chargeSign').innerHTML = (settings.particle.chargeSign < 0)?'-':'+';
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

function updateSize() {
    var m = parseFloat(document.getElementById('particleSize').value);
    if (m <= 0) {
        m = settings.particle.size;
    }
    settings.particle.size = m;
    document.getElementById('particleSize').value = settings.particle.size.toString();
}

function updateSizeExp() {
    settings.particle.sizeExp = parseInt(document.getElementById('particleSizeExp').value);
    document.getElementById('particleSizeExp').value = settings.particle.sizeExp.toString();
}

function updateScale() {
    var f = parseFloat(document.getElementById('scaleDistance').value);
    document.getElementById('scaleDistance').value = f.toString();
    pixelsPerMeter = 100/f;
}

function toggleFixed() {
	settings.particle.fixed = document.getElementById('particleFixed').checked;
}

function updateFieldType() {
	var type = document.getElementById('fieldType').value;
	settings.field.type = type;
	if (type == 'electrical') {
		document.getElementById('eDirectionDiv').style.display = 'block';
		document.getElementById('mDirectionDiv').style.display = 'none';
		document.getElementById('funits').innerHTML = 'N/C=V/m';
	} else {
		document.getElementById('eDirectionDiv').style.display = 'none';
		document.getElementById('mDirectionDiv').style.display = 'block';
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

function updateMagDir() {
    settings.field.magSign = document.getElementById('mDirectionIn').checked?1:-1;
}

function mouseDown(e) {
    if (currentTool == 0) {
        settings.particle.dropX = e.pageX - workplace.origin.x;
        settings.particle.dropY = e.pageY - workplace.origin.y;
        settings.particle.dragging = particleList.length;
	    addParticle(new particle(settings.particle.mass*Math.pow(10,settings.particle.massExp), settings.particle.chargeSign*settings.particle.charge*Math.pow(10,settings.particle.chargeExp), (e.pageX - workplace.origin.x)/pixelsPerMeter, (e.pageY - workplace.origin.y)/pixelsPerMeter, settings.particle.size*Math.pow(10,settings.particle.sizeExp)));
	    particleList[particleList.length-1].fixed = settings.particle.fixed;
		particleList[particleList.length-1].dragging = true;
	} else if (currentTool == 1) {
		if (settings.field.type == 'electrical') {
			addField(electricalField(settings.field.direction.direction.scale(settings.field.strength*Math.pow(10, settings.field.strengthExp)),new Rectangle((e.pageX - workplace.origin.x)/pixelsPerMeter, (e.pageY - workplace.origin.y)/pixelsPerMeter, 0, 0, true)));
		} else {
		    addField(magneticField(settings.field.magSign*settings.field.strength*Math.pow(10, settings.field.strengthExp), new Rectangle((e.pageX - workplace.origin.x)/pixelsPerMeter, (e.pageY - workplace.origin.y)/pixelsPerMeter, 0, 0, true)));
		}
    	settings.field.cropping = fieldList.length-1;
	} else {
		if (running) {
			for (var i = 0; i < particleList.length; i++) {
				if (new Rectangle(particleList[i].x-particleList[i].radius, particleList[i].y-particleList[i].radius, particleList[i].radius*2, particleList[i].radius*2, true)
				  .hitPoint((e.pageX-workplace.origin.x)/pixelsPerMeter, (e.pageY-workplace.origin.y)/pixelsPerMeter)) {
					
				}
			}
		}
	}
}

function mouseMove(e) {
    if (currentTool == 0) {
        if (settings.particle.dragging !== false) {
            particleList[settings.particle.dragging].x = (e.pageX - workplace.origin.x)/pixelsPerMeter;
            particleList[settings.particle.dragging].y = (e.pageY - workplace.origin.y)/pixelsPerMeter;
        }
    } else if (currentTool == 1) {
		if (settings.field.cropping !== false) {
			fieldList[settings.field.cropping].bounds.x2 = (e.pageX - workplace.origin.x)/pixelsPerMeter;
			fieldList[settings.field.cropping].bounds.y2 = (e.pageY - workplace.origin.y)/pixelsPerMeter;
		}
	}
}

function mouseUp(e) {
    if (currentTool == 0) {
        if (settings.particle.dragging !== false) {
            particleList[settings.particle.dragging].vel = new vector([(e.pageX - workplace.origin.x - settings.particle.dropX)/pixelsPerMeter, (e.pageY - workplace.origin.y - settings.particle.dropY)/pixelsPerMeter, 0]);
			particleList[settings.particle.dragging].dragging = false;
            settings.particle.dragging = false;
        }
    } else if (currentTool == 1) {
		if (settings.field.cropping !== false) {
		    fieldList[settings.field.cropping].bounds = fieldList[settings.field.cropping].bounds.normalize();
		    settings.field.cropping = false;
		}
	}
}

var activeTouch = false;

function touchDown(e) {
	e.preventDefault();
	if (activeTouch === false && e.changedTouches.length > 0) {
		activeTouch = e.changedTouches[0].identifier;
		mouseDown(e.changedTouches[0]);
	}
}


function touchMove(e) {
	e.preventDefault();
	if (activeTouch !== false) {
		for (var i = 0; i < e.changedTouches.length; i++) {
			if (e.changedTouches[i].identifier == activeTouch) {
				mouseMove(e.changedTouches[i]);
			}
		}
	}
}

function touchUp(e) {
	e.preventDefault();
	if (activeTouch !== false) {
		for (var i = 0; i < e.changedTouches.length; i++) {
			if (e.changedTouches[i].identifier == activeTouch) {
				mouseUp(e.changedTouches[i]);
				activeTouch = false;
			}
		}
	}
}



function dirCanvas (dest) {
	
	this.active = false;
	this.owner = this;
	this.direction = new vector([0,-1,0]);
	this.mouseDownE = function (e) {
		this.owner.active = true;
		this.owner.mouseMoveE(e);
	};

	this.mouseMoveE = function (e) {
		if (this.owner.active) {
			var rx = e.pageX - (e.target.offsetLeft + 22);		//+20 for the offset of its parent, +2 for the border
			var ry = e.pageY - (e.target.offsetTop + 22);
			this.owner.direction = new vector([rx - 75, ry - 75, 0]).getUnitVector();
		}
	};

	this.mouseUpE = function (e) {
		this.owner.active = false;
	};

	this.activetouchE = false;

	this.touchDownE = function (e) {
		e.preventDefault();
		if (this.owner.activeTouchE === false && e.changedTouches.length > 0) {
			this.owner.activeTouchE = e.changedTouches[0].identifier;
			this.owner.mouseDownE(e.changedTouches[0]);
		}
	};


	this.touchMoveE = function (e) {
		e.preventDefault();
		if (this.owner.activeTouchE !== false) {
			for (var i = 0; i < e.changedTouches.length; i++) {
				if (e.changedTouches[i].identifier == this.owner.activeTouch) {
					this.owner.mouseMoveE(e.changedTouches[i]);
				}
			}
		}
	};

	this.touchUpE = function (e) {
		e.preventDefault();
		if (this.owner.activeTouchE !== false) {
			for (var i = 0; i < e.changedTouches.length; i++) {
				if (e.changedTouches[i].identifier == this.owner.activeTouchE) {
					this.owner.activeTouchE = false;
				}
			}
		}
	};
	
	this.area = new workArea({width: 150, height: 150}, {onmousedown: this.mouseDownE, onmousemove: this.mouseMoveE, onmouseup: this.mouseUpE, ontouchdown: this.touchDownE, ontouchmove: this.touchMoveE, ontouchup: this.touchUpE}, dest);
	this.area.style = 'solid 2px black';
	this.area.canvas.owner = this;
	
	this.draw = function () {
		this.area.clear();
		this.area.drawArrow(75,75,75+this.direction.components[0]*70,75+this.direction.components[1]*70);
	}
}