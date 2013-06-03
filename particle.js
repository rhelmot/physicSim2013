function particle (mass, charge, x, y, radius) {
	this.mass = mass;
	this.charge = charge;		//quantize?
	this.radius = radius;
	this.x = x;
	this.y = y;
	this.vel = new vector([0,0,0]);
	this.accl = new vector([0,0,0]);
	this.fixed = false;
}

particle.prototype.applyForce = function (fVector) {
	this.accl = this.accl.add(fVector.scale(1/this.mass));
};

var evaluateForRK4 = function(initialState, dt, d, accel) {
  var state = {x: initialState.x + d.dx * dt, v: initialState.v + d.dv * dt};
  var out = {dx: state.v, dv: accel};
  return out;
}

var calcRK4 = function(state, dt, accl) {
  var a = evaluateForRK4(state, 0.0, {dx: 0.0, dv: 0.0}, accl);
  var b = evaluateForRK4(state, 0.5*dt, a, accl);
  var c = evaluateForRK4(state, 0.5*dt, b, accl);
  var d = evaluateForRK4(state, dt, c, accl);

  var dxdt = 1.0/6.0 * (a.dx + 2.0*(b.dx + c.dx) + d.dx);
  var dvdt = 1.0/6.0 * (a.dv + 2.0*(b.dv + c.dv) + d.dv);

  return {x: state.x + dxdt * dt, v: state.v + dvdt * dt};
}

particle.prototype.process = function (dt) {
	if (!this.fixed) {
		if (settings.field.gravity) {
			this.accl = this.accl.add(new vector([0, 9.8, 0]));
		}
    var rk4 = false;
    var verlet = true;
    if (rk4) {
      var stateX = {x: this.x, v: this.vel.components[0]};
      var newState = calcRK4(stateX, dt, this.accl.components[0]);
      this.x = newState.x;
      this.vel.components[0] = newState.v;

      var stateY = {x: this.y, v: this.vel.components[1]};
      var newState = calcRK4(stateY, dt, this.accl.components[1]);
      this.y = newState.x;
      this.vel.components[1] = newState.v;


    } else if (verlet) {
      if (typeof this.dt_last === "undefined") {
        this.dt_last = dt;
        this.x_last = this.x;
        this.y_last = this.y;
        this.ax_last = this.accl.components[0];
        this.ay_last = this.accl.components[1];
        this.x = this.x + this.vel.components[0] * dt;
        this.y = this.y + this.vel.components[1] * dt;
        return;
      }
      var x_last = this.x;
      var y_last = this.y;
      this.x = this.x + (this.x - this.x_last) * (dt / this.dt_last) + (this.accl.components[0] * dt * dt);
      this.y = this.y + (this.y - this.y_last) * (dt / this.dt_last) + (this.accl.components[1] * dt * dt);
      this.x_last = x_last;
      this.y_last = y_last;
      this.vel.components[0] = this.vel.components[0] + 0.5 * (this.ax_last + this.accl.components[0]) * dt;
      this.vel.components[1] = this.vel.components[1] + 0.5 * (this.ay_last + this.accl.components[1]) * dt;
      this.ax_last = this.accl.components[0];
      this.ay_last = this.accl.components[1];
      this.dt_last = dt;
    } else {
	  	this.vel = this.vel.add(this.accl.scale(dt));
	  	this.x += this.vel.components[0] * dt;
		  this.y += this.vel.components[1] * dt;
    }
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
	if (fv.getMagnitude() < (this.radius + other.radius)) {     //collision!
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
