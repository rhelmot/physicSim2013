var particleList = [];
var fieldList = [];
var pixelsPerMeter = 1000;

function vector (components) {
	this.components = components;
}

vector.prototype.scale = function (r) {
	return new vector(this.components.map(function (x) {return x * r}));
};

vector.prototype.getUnitVector = function () {
	return this.scale(1/this.getMagnitude());
};

vector.prototype.getMagnitude = function () {
	return Math.sqrt(this.components.map(function(x) { return x*x; }).reduce(function(a, b) { return a+b; }));
};

vector.prototype.add = function (vec) {
	if (vec.components.length != this.components.length) {
		return false;
	}
	var outcomp = [];
	for (var i = 0; i < vec.components.length; i++) {
		outcomp[i] = this.components[i] + vec.components[i];
	}
	return new vector(outcomp);
};

vector.prototype.dot = function (vec) {
	if (vec.components.length != this.components.length) {
		return false;
	}
	var out = 0;
	for (var i = 0; i < vec.length; i++) {
		out += this.components[i] * vec.components[i];
	}
	return out;
};

vector.prototype.cross = function (vec) {								//this x vec
	if (vec.components.length != 3 || this.components.length != 3) {
		return false;
	}
	return new vector([	(this.components[1]*vec.components[2]) - (this.components[2]*vec.components[1]),
						(this.components[2]*vec.components[0]) - (this.components[0]*vec.components[2]),
						(this.components[0]*vec.components[1]) - (this.components[1]*vec.components[0])]);
};

vector.prototype.angleAgainst = function (vec) {
	return Math.acos(this.dot(vec)/(this.getMagnitude() * vec.getMagnitude()));
};

function particle (mass, charge, x, y) {
	this.mass = mass;
	this.charge = charge;		//quantize?
	this.x = x;
	this.y = y;
	this.vel = new vector([0,0,0]);
	this.accl = new vector([0,0,0]);
	this.fixed = false;
}

particle.prototype.applyForce = function (fVector) {
	this.accl = this.accl.add(fVector.scale(1/this.mass));
};

particle.prototype.process = function (dt) {
	if (!this.fixed) {
		this.vel = this.vel.add(this.accl.scale(dt));
		this.x += this.vel.components[0] * dt;
		this.y += this.vel.components[1] * dt;
	}
	this.accl = new vector([0,0,0]);
};

particle.prototype.draw = function (dest) {
	dest.context.beginPath();
	if (this.charge > 0) {
		dest.context.fillStyle = 'red';
	} else if (this.charge < 0) {
		dest.context.fillStyle = 'blue';
	} else {
		dest.context.fillStyle = 'black';
	}
    dest.context.arc(this.x*pixelsPerMeter, this.y*pixelsPerMeter, this.mass*10, 0, 2 * Math.PI, false);
    dest.context.fill();
	if (this.fixed) {
		dest.context.strokeStyle = 'grey';
		dest.context.stroke();
	}
};

particle.prototype.interact = function (other) {
	var fv = new vector([this.x - other.x, this.y - other.y, 0]);
	var rv = fv.getUnitVector().scale(8.987551787e9*this.charge*other.charge/((fv.components[0]*fv.components[0]) + (fv.components[1]*fv.components[1])))
	this.applyForce(rv);
	other.applyForce(rv.scale(-1));
};

function field(processFunction) {
	this.process = processFunction;
}

function electricalField(fieldVector) {
	return new field(function (particle) {
		particle.applyForce(fieldVector.scale(particle.charge));
	});
}

function gravitationalField() {
	return new field(function (particle) {
		particle.applyForce(new vector([0, 9.8/particle.mass,0]));
	});
}

function magneticField(strength) {			// into the page, positive. Out of the page, negative. This is not a 3D simulator.
	return new field(function (particle) {
		particle.applyForce(particle.vel.cross(new vector([0, 0, strength])).scale(particle.charge));
	});
}

function addField(whichField) {
	fieldList[fieldList.length] = whichField;
	return whichField;
}

function addParticle(whichParticle) {
	particleList[particleList.length] = whichParticle;
	return whichParticle;
}

var workplace;
var killcode;

window.onload = function () {
	
	workplace = new workArea({width: '100%', height: '100%'});
	killcode = setInterval(function () {
		workplace.clear();
		for (var i = 0; i < particleList.length; i++) {
			for (var j = i + 1; j < particleList.length; j++) {
				particleList[i].interact(particleList[j]);
			}
			particleList[i].process(0.016);
		}
		for (var i = 0; i < fieldList.length; i++) {
			for (var j = 0; j < particleList.length; j++) {
				fieldList[i].process(particleList[j]);
			}
		}
		for (var i = 0; i < particleList.length; i++) {
			particleList[i].draw(workplace);
		}
	}, 16);
};

function kill() {
	clearInterval(killcode);
}