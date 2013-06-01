function generateInterface() {
    var dest = document.getElementById('opts0');
    settings.particle.charge = new inputField(dest, {label: 'Charge', units: 'coulombs', canBeNegative: true, canBeZero: true, value: new expNumber(0)});
    settings.particle.mass = new inputField(dest, {label: 'Mass', units: 'kilograms', canBeNegative: false, canBeZero: false, value: new expNumber(1)});
    settings.particle.radius = new inputField(dest, {label: 'Radius', units: 'meters', canBeNegative: false, canBeZero: false, value: new expNumber(2e-3)});
    settings.particle.fixed = new checkField(dest, {label: 'Fixed', state: false});
    
    dest = document.getElementById('opts1');
    settings.field.gravity = new checkField(dest, {label: 'Gravity', state: false});
    dest.appendChild(document.createElement('br'));
    settings.field.type = new optionField(dest, {label: 'Type', options: ['Electrical', 'Magnetic'], type: 'box', value: 0, onchange: function (v) {
        document.getElementById('field'+v).style.display = 'block';
        document.getElementById('field'+(v^1)).style.display = 'none';
    }});
    
    var elDest = document.createElement('div');
    elDest.id = 'field0';
    settings.field.electrical.strength = new inputField(elDest, {label: 'Strength', units: 'N/C=V/m', canBeNegative: false, canBeZero: false, value: new expNumber(1)});
    settings.field.electrical.direction = new dirCanvas(elDest, 'Direction');
    
    var magDest = document.createElement('div');
    magDest.id = 'field1';
    magDest.style.display = 'none';
    settings.field.magnetic.strength = new inputField(magDest, {label: 'Strength', units: 'teslas', canBeNegative: false, canBeZero: false, value: new expNumber(1)});
    settings.field.magnetic.direction = new optionField(magDest, {label: 'Direction', options: ['Into Page', 'Out of Page'], type: 'radio', value: 0, onchange: function (v) {
        settings.field.magnetic.strength.value.sign = (v-0.5)*-2;
    }});
    
    dest.appendChild(elDest);
    dest.appendChild(magDest);
	
	dest = document.getElementById('particleSelected');
	settings.select.particle.x = new inputField(dest, {label: 'X', units: 'meters', canBeNegative: 'inline', canBeZero: true, value: new expNumber(0), onchange: function (v) {
		settings.select.particle.selected.x = v;
	}});
	settings.select.particle.y = new inputField(dest, {label: 'Y', units: 'meters', canBeNegative: 'inline', canBeZero: true, value: new expNumber(0), onchange: function (v) {
		settings.select.particle.selected.y = -v;
	}});
	settings.select.particle.velr = new inputField(dest, {label: 'Velocity magnitude', units: 'm/s', canBeNegative: false, canBeZero: true, value: new expNumber(0), onchange: function (v) {
		var real = settings.select.particle.velt.direction.scale(v);
		settings.select.particle.velx.setValue(real.components[0]);
		settings.select.particle.vely.setValue(-real.components[1]);
		settings.select.particle.selected.vel = real;
	}});
	settings.select.particle.velt = new dirCanvas(dest, "Velocity direction", function (v) {
		var real = v.scale(settings.select.particle.velr.getValue());
		settings.select.particle.velx.setValue(real.components[0]);
		settings.select.particle.vely.setValue(-real.components[1]);
		settings.select.particle.selected.vel = real;
	});
    settings.select.particle.velx = new inputField(dest, {label: 'Horizontal component', units: 'm/s', canBeNegative: true, canBeZero: true, value: new expNumber(0), onchange: function (v) {
		var real = new vector([v, -settings.select.particle.vely.getValue(), 0]);
		settings.select.particle.velr.setValue(real.getMagnitude());
		settings.select.particle.velt.direction = real.getUnitVector();
		settings.select.particle.selected.vel = real;
	}});
	settings.select.particle.vely = new inputField(dest, {label: 'Vertical component', units: 'm/s', canBeNegative: true, canBeZero: true, value: new expNumber(0), onchange: function (v) {
		var real = new vector([settings.select.particle.velx.getValue(), -v, 0]);
		settings.select.particle.velr.setValue(real.getMagnitude());
		settings.select.particle.velt.direction = real.getUnitVector();
		settings.select.particle.selected.vel = real;
	}});
	settings.select.particle.mass = new inputField(dest, {label: 'Mass', units: 'kilograms', canBeNegative: false, canBeZero: false, value: new expNumber(1), onchange: function (v) {
		settings.select.particle.selected.mass = v;
	}});
	settings.select.particle.radius = new inputField(dest, {label: 'Radius', units: 'meters', canBeNegative: false, canBeZero: false, value: new expNumber(1), onchange: function (v) {
		settings.select.particle.selected.radius = v;
	}});
	settings.select.particle.charge = new inputField(dest, {label: 'Charge', units: 'coulombs', canBeNegative: true, canBeZero: true, value: new expNumber(0), onchange: function (v) {
		settings.select.particle.selected.charge = v;
	}});
	settings.select.particle.fixed = new checkField(dest, {label: 'Fixed', state: false, onchange: function (v) {
		settings.select.particle.selected.fixed = v;
	}});
	
	dest = document.getElementById('fieldSelected');
	settings.select.field.x = new inputField(dest, {label: 'X', units: 'meters', canBeNegative: 'inline', canBeZero: true, value: new expNumber(0), onchange: function (v) {
		settings.select.field.selected.bounds.x1 = v;
		settings.select.field.selected.bounds.x2 = v + settings.select.field.selected.bounds.width;
	}});
	settings.select.field.y = new inputField(dest, {label: 'Y', units: 'meters', canBeNegative: 'inline', canBeZero: true, value: new expNumber(0), onchange: function (v) {
		settings.select.field.selected.bounds.y1 = -v;
		settings.select.field.selected.bounds.y2 = -v + settings.select.field.selected.bounds.height;
	}});
	settings.select.field.width = new inputField(dest, {label: 'Width', units: 'meters', canBeNegative: false, canBeZero: false, value: new expNumber(1), onchange: function (v) {
		settings.select.field.selected.bounds.x2 = v + settings.select.field.selected.bounds.x1;
	}});
	settings.select.field.height = new inputField(dest, {label: 'Height', units: 'meters', canBeNegative: false, canBeZero: false, value: new expNumber(1), onchange: function (v) {
		settings.select.field.selected.bounds.y2 = v + settings.select.field.selected.bounds.y1;
	}});
	
	var sDestEl = document.createElement('div');
	settings.select.field.electrical.strength = new inputField(sDestEl, {label: 'Strength', units: 'N/C=V/m', canBeNegative: false, canBeZero: false, value: new expNumber(1), onchange: function (v) {
		settings.select.field.selected.vector = settings.field.electrical.direction.direction.scale(v);
	}});
	settings.select.field.electrical.direction = new dirCanvas(sDestEl, 'Direction', function (v) {
		settings.select.field.selected.vector = v.scale(settings.field.electrical.strength.getValue());
	});
	sDestEl.id = 'selectElectricalField';
	dest.appendChild(sDestEl);
	
	var sDestMag = document.createElement('div');
	settings.select.field.magnetic.strength = new inputField(sDestMag, {label: 'Strength', units: 'teslas', canBeNegative: false, canBeZero: false, value: new expNumber(1), onchange: function (v) {
		settings.select.field.selected.vector.components[2] /= Math.abs(settings.select.field.selected.vector.components[2]);
		settings.select.field.selected.vector.componetns[2] *= v;
	}});
	settings.select.field.magnetic.direction = new optionField(sDestMag, {label: 'Direction', options: ['Into Page', 'Out of Page'], value: 0, type: 'radio', onchange: function (v) {
		settings.select.field.selected.vector.components[2] = Math.abs(settings.select.field.selected.vector.components[2]) * (v-0.5) * -2;
	}});
	sDestMag.id = 'selectMagneticField';
	dest.appendChild(sDestMag);
	
	workplace = new workArea({width: '100%', height: '100%', originX: '50%', originY: '50%'}, {onmousedown: mouseDown, onmousemove: mouseMove, onmouseup: mouseUp, ontouchdown: touchDown, ontouchmove: touchMove, ontouchup: touchUp});
	workplace.canvas.id = 'workplace';
}

var toolnames = ['particle', 'field', 'select'];

var currentTool = 0;
//0 = add particle
//1 = add field
//2 = select

var settings = {
    particle: {
        dropx: 0,
        dropy: 0,
        dragging: false
    },
    field: {
        magnetic: {
        
        },
        electrical: {
        
        },
		dirActive: false,
		cropping: false,
		dragging: false
    },
    select: {
		particle: {},
		field: {
			magnetic: {},
			electrical: {}
		}
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

function expNumber(number) {
	if (number == 0) {
		this.base = 0;
		this.exp = 0;
		this.sign = 1;
	} else {
	    var abs = Math.abs(number);
	    this.sign = number/abs;
		var log = Math.floor(Math.log(abs)/Math.log(10));
		this.exp = log;
		this.base = abs*Math.pow(10, -log);
	}
}

expNumber.prototype.getValue = function () {
	return this.sign * this.base * Math.pow(10, this.exp);
};

function inputField(dest, options) {
    this.canBeZero = options.canBeZero;
	this.canBeNegative = options.canBeNegative;
	var div = document.createElement('div');
	this.value = options.value;
	div.appendChild(document.createTextNode(options.label + ' (' + options.units + '): '));
	var a = document.createElement('a');
	if (options.canBeNegative && options.canBeNegative != 'inline') {
		a.className = 'button square';
		a.innerHTML = (options.value.sign < 0)?'-':'+';
		a.owner = this;
		a.onclick = function () {
			this.owner.value.sign = -this.owner.value.sign;
			this.innerHTML = (this.owner.value.sign < 0)?'-':'+';
			if (typeof options.onchange == 'function') {
				options.onchange(this.owner.getValue());
			}
		}
		div.appendChild(a);
	}
	var root = document.createElement('input');
	root.type = 'number';
	root.value = options.value.base.toString();
	root.style.width = 60;
	root.owner = this;
	root.onchange = function () {
	    var m = parseFloat(this.value);
	    if ((m < 0 && this.owner.canBeNegative != 'inline') || (!this.owner.canBeZero && m == 0)) {
	        m = this.owner.value.base;
	    }
	    this.owner.value.base = m;
	    this.value = m.toString();
		if (typeof options.onchange == 'function') {
			options.onchange(this.owner.getValue());
		}
	}
	div.appendChild(root);
	div.appendChild(document.createTextNode("x10^"));
	var exp = document.createElement('input');
	exp.type = 'number';
	exp.value = options.value.exp;
	exp.style.width = 40;
	exp.owner = this;
	exp.onchange = function () {
	    var m = parseInt(this.value);
	    this.owner.value.exp = m;
	    this.value = m.toString();
		if (typeof options.onchange == 'function') {
			options.onchange(this.owner.getValue());
		}
	}
	div.appendChild(exp);
	dest.appendChild(div);
	this.base = root;
	this.exp = exp;
	this.sign = a;
}

inputField.prototype.getValue = function () {
    return this.value.getValue();
};

inputField.prototype.setValue = function (v) {
    this.value = new expNumber(v);
	if (this.canBeNegative == 'inline') {
		this.value.base *= this.value.sign;
		this.value.sign = 1;
	}
    this.base.value = this.value.base;
    this.exp.value = this.value.exp;
    this.sign.innerHTML = (this.value.sign < 0)?'-':'+';
};

function checkField(dest, options) {
    this.state = options.state;
    var div = document.createElement('div');
    var lab = document.createElement('label');
    var check = document.createElement('input');
    check.type = 'checkbox';
    check.checked = options.state;
    check.owner = this;
    check.onchange = function () {
        this.owner.state = this.checked;
        if (typeof options.onchange == 'function') {
            options.onchange(this.checked);
        }
    }
    lab.appendChild(check);
    lab.appendChild(document.createTextNode(' '+options.label));
    div.appendChild(lab);
    dest.appendChild(div);
    this.check = check;
}

checkField.prototype.setValue = function (v) {
    this.state = v;
    this.check.checked = v;
};

function optionField(dest, options) {
    if (!options.name) {
        options.name = Math.random().toString();
    }
    this.type = options.type;
    this.value = options.value;
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(options.label + ': '));
    if (options.type == 'radio') {
        var d2 = document.createElement('div');
        d2.style.display = 'inline-block';
        d2.style.textAlign = 'left';
        d2.style.verticalAlign = 'middle';
        var opts = [];
        for (var i = 0; i < options.options.length; i++) {
            var lb = document.createElement('label');
            var ip = document.createElement('input');
            ip.type = 'radio';
            ip.name = options.name;
            ip.owner = this;
            ip.value = i;
            if (i == options.value) {
                ip.checked = true;
            }
            ip.onchange = function () {
                if (this.checked) {
                    this.owner.value = this.value;
                    if (typeof options.onchange == 'function') {
                        options.onchange(this.value);
                    }
                }
            };
            lb.appendChild(ip);
            lb.appendChild(document.createTextNode(' '+options.options[i]));
            d2.appendChild(lb);
            d2.appendChild(document.createElement('br'));
            opts[opts.length] = ip;
        }
        div.appendChild(d2);
        this.opts = opts;
    } else if (options.type == 'box') {
        var box = document.createElement('select');
        box.owner = this;
        box.onchange = function () {
            this.owner.value = this.value;
            if (typeof options.onchange == 'function') {
                options.onchange(this.value);
            }
        };
        for (var i = 0; i < options.options.length; i++) {
            var opt = document.createElement('option');
            opt.value = i;
            opt.innerHTML = options.options[i];
            if (i == options.value) {
                opt.selected = true;
            }
            box.appendChild(opt);
        }
        div.appendChild(box);
        this.opts = box;
    }
    dest.appendChild(div);
}

optionField.prototype.setValue = function (v) {
	if (this.type == 'box') {
		this.value = v;
		this.opts.value = v;
	} else if (this.type == 'radio') {
		for (var i = 0; i < this.opts.length; i++) {
			this.opts[i].checked = (i == v);
		}
	}
};

function dirCanvas (dest, label, onchange) {
	
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
			if (typeof onchange == 'function') {
				onchange(this.owner.direction);
			}
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
	
	dest.appendChild(document.createTextNode(label + ': '));
	this.area = new workArea({width: 150, height: 150}, {onmousedown: this.mouseDownE, onmousemove: this.mouseMoveE, onmouseup: this.mouseUpE, ontouchdown: this.touchDownE, ontouchmove: this.touchMoveE, ontouchup: this.touchUpE}, dest);
	this.area.canvas.style.border = '2px solid black';
	this.area.canvas.owner = this;
	this.area.canvas.style.verticalAlign = 'middle';
	
	this.draw = function () {
		this.area.clear();
		this.area.drawArrow(75,75,75+this.direction.components[0]*70,75+this.direction.components[1]*70);
	}
}

dirCanvas.prototype.setValue = function (v) {
    this.direction = v.getUnitVector();
};

function updateScale() {
    var f = parseFloat(document.getElementById('scaleDistance').value);
    document.getElementById('scaleDistance').value = f.toString();
    pixelsPerMeter = 100/f;
}



function mouseDown(e) {
    if (currentTool == 0) {
        settings.particle.dropX = e.pageX - workplace.origin.x;
        settings.particle.dropY = e.pageY - workplace.origin.y;
        settings.particle.dragging = particleList.length;
	    addParticle(new particle(settings.particle.mass.getValue(), settings.particle.charge.getValue(), (e.pageX - workplace.origin.x)/pixelsPerMeter, (e.pageY - workplace.origin.y)/pixelsPerMeter, settings.particle.radius.getValue()));
	    particleList[particleList.length-1].fixed = settings.particle.fixed.state;
		particleList[particleList.length-1].dragging = true;
	} else if (currentTool == 1) {
		if (settings.field.type.value == 0) {
			addField(electricalField(settings.field.electrical.direction.direction.scale(settings.field.electrical.strength.getValue()),new Rectangle((e.pageX - workplace.origin.x)/pixelsPerMeter, (e.pageY - workplace.origin.y)/pixelsPerMeter, 0, 0, true)));
		} else {
		    addField(magneticField(settings.field.magnetic.strength.getValue(), new Rectangle((e.pageX - workplace.origin.x)/pixelsPerMeter, (e.pageY - workplace.origin.y)/pixelsPerMeter, 0, 0, true)));
		}
    	settings.field.cropping = fieldList.length-1;
	} else {
		if (!running) {
			for (var i = 0; i < particleList.length; i++) {
				if (new Rectangle(particleList[i].x-particleList[i].radius, particleList[i].y-particleList[i].radius, particleList[i].radius*2, particleList[i].radius*2, true)
				  .hitPoint((e.pageX-workplace.origin.x)/pixelsPerMeter, (e.pageY-workplace.origin.y)/pixelsPerMeter)) {
					document.getElementById('noneSelected').style.display = 'none';
					document.getElementById('particleSelected').style.display = 'block';
					document.getElementById('fieldSelected').style.display = 'none';
					settings.select.particle.selected = particleList[i];
					settings.select.field.selected = false;
					settings.select.particle.x.setValue(particleList[i].x);
					settings.select.particle.y.setValue(-particleList[i].y);
					settings.select.particle.velx.setValue(particleList[i].vel.components[0]);
					settings.select.particle.vely.setValue(-particleList[i].vel.components[1]);
					settings.select.particle.velr.setValue(particleList[i].vel.getMagnitude());
					settings.select.particle.velt.direction = new vector([particleList[i].vel.components[0], particleList[i].vel.components[1], 0]).getUnitVector();
					settings.select.particle.mass.setValue(particleList[i].mass);
					settings.select.particle.radius.setValue(particleList[i].radius);
					settings.select.particle.charge.setValue(particleList[i].charge);
					settings.select.particle.fixed.setValue(particleList[i].fixed);
					return;
				}
			}
			for (var i = 0; i < fieldList.length; i++) {
				if (fieldList[i].bounds.hitPoint((e.pageX-workplace.origin.x)/pixelsPerMeter, (e.pageY-workplace.origin.y)/pixelsPerMeter)) {
					document.getElementById('noneSelected').style.display = 'none';
					document.getElementById('particleSelected').style.display = 'none';
					document.getElementById('fieldSelected').style.display = 'block';
					settings.select.particle.selected = false;
					settings.select.field.selected = fieldList[i];
					settings.select.field.x.setValue(fieldList[i].bounds.x1);
					settings.select.field.y.setValue(-fieldList[i].bounds.y1);
					settings.select.field.width.setValue(fieldList[i].bounds.width);
					settings.select.field.height.setValue(fieldList[i].bounds.height);
					if (!fieldList[i].vector.components[2]) {
						document.getElementById('selectMagneticField').style.display = 'none';
						document.getElementById('selectElectricalField').style.display = 'block';
						settings.select.field.electrical.strength.setValue(fieldList[i].vector.getMagnitude());
						settings.select.field.electrical.direction.direction = fieldList[i].vector.getUnitVector();
					} else {
						document.getElementById('selectMagneticField').style.display = 'block';
						document.getElementById('selectElectricalField').style.display = 'none';
						settings.select.field.magnetic.strength.setValue(Math.abs(fieldList[i].vector.components[2]));
						settings.select.field.magnetic.direction.setValue(fieldList[i].vector.components[2] > 0 ? 0 : 1);
					}
					return;
				}
			}
			document.getElementById('noneSelected').style.display = 'block';
			document.getElementById('particleSelected').style.display = 'none';
			document.getElementById('fieldSelected').style.display = 'none';
			settings.select.particle.selected = false;
			settings.select.field.selected = false;
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




