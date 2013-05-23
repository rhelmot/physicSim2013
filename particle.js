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
	var color;
	if (this.charge > 0) {
		color = 'red';
	} else if (this.charge < 0) {
		color = 'blue';
	} else {
		color = 'black';
	}
	dest.drawDot(this.x*pixelsPerMeter, this.y*pixelsPerMeter, this.mass*10, color, this.fixed);
};

particle.prototype.interact = function (other) {
	var fv = new vector([this.x - other.x, this.y - other.y, 0]);
	var ev = fv.getUnitVector().scale(8.987551787e9*this.charge*other.charge/((fv.components[0]*fv.components[0]) + (fv.components[1]*fv.components[1])))
	this.applyForce(ev);
	other.applyForce(ev.scale(-1));
	var gv = fv.getUnitVector().scale(6.67384e-11*this.mass*other.mass/((fv.components[0]*fv.components[0]) + (fv.components[1]*fv.components[1])))
};

function addParticle(whichParticle) {
	particleList[particleList.length] = whichParticle;
	return whichParticle;
}