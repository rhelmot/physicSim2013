function particle (mass, charge, x, y, radius) {
	this.mass = mass;
	this.charge = charge;		//quantize?
	this.radius = radius;
	this.x = x;
	this.y = y;
	this.vel = new vector([0,0,0]);
	this.accl = new vector([0,0,0]);
	this.fixed = false;
	this.dragging = false;
}

particle.prototype.applyForce = function (fVector) {
	this.accl = this.accl.add(fVector.scale(1/this.mass));
};

particle.prototype.process = function (dt) {
	if (!(this.fixed || this.dragging)) {
		if (settings.field.gravity.state) {
			this.accl = this.accl.add(new vector([0, 9.8, 0]));
		}
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
	dest.drawDot(this.x*pixelsPerMeter, this.y*pixelsPerMeter, this.radius*pixelsPerMeter, color, this.fixed);
};

particle.prototype.interact = function (other) {
	var fv = new vector([this.x - other.x, this.y - other.y, 0]);
	if (fv.getMagnitude() < (this.radius + other.radius) && !this.dragging && !other.dragging) {     //collision!
	    this.vel = new vector([ ((this.mass*this.vel.components[0])+(other.mass*other.vel.components[0])) / (this.mass + other.mass),
	                            ((this.mass*this.vel.components[1])+(other.mass*other.vel.components[1])) / (this.mass + other.mass), 0]);     //conservation of momentum
	    this.radius += other.radius;        //should probably be changed
	    this.mass += other.mass;            //conservation of mass
	    this.charge += other.charge;        //conservation of charge
	    this.x += other.x;
	    this.x /= 2;
	    this.y += other.y;                  //set position to mean position... should it just be point of collision?
	    this.y /= 2;
	    //acceleration..?
	    other.x = -1e6;
	    other.y = -1e6;
	    clearOffscreenParticles();
	} else {
	    var ev = fv.getUnitVector().scale(8.987551787e9*this.charge*other.charge/((fv.components[0]*fv.components[0]) + (fv.components[1]*fv.components[1])))
	    this.applyForce(ev);
	    other.applyForce(ev.scale(-1));
	    var gv = fv.getUnitVector().scale(6.67384e-11*this.mass*other.mass/((fv.components[0]*fv.components[0]) + (fv.components[1]*fv.components[1])))
	    this.applyForce(gv);
	    other.applyForce(gv.scale(-1));
	}
};

function addParticle(whichParticle) {
	particleList[particleList.length] = whichParticle;
	return whichParticle;
}
