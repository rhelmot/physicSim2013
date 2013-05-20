var particleList = [];
var pixelsPerMeter = 1000;

function vector (useComponents, xr, yt) {
	if (useComponents) {
		this.setCartesian(xr, yt);
	} else {
		this.setPolar(xr, yt);
	}
}

vector.prototype.setPolar = function (r, theta) {
	this.r = r;
	this.theta = theta;
	this.y = r*Math.sin(theta);
	this.x = r*Math.cos(theta);
};

vector.prototype.setCartesian = function (x, y) {
	this.x = x;
	this.y = y;
	this.r = Math.sqrt(x*x + y*y);
	if (this.r == 0) {
		this.theta = ((y < 0)?-1:1)*Math.PI/2;
	} else {
		this.theta = ((x < 0)?-1:1)*Math.atan(y/x);
	}
};

vector.prototype.resize = function (abs, r) {
	return new vector(false, abs?r:r*this.r, this.theta);
};

vector.prototype.add = function(vec) {
	return new vector(true, this.x + vec.x, this.y + vec.y);
};

function particle (mass, charge, x, y) {
	this.mass = mass;
	this.charge = charge;		//quantize?
	this.x = x;
	this.y = y;
	this.vel = new vector(false, 0, 0);
	this.accl = new vector(false, 0, 0);
}

particle.prototype.applyForce = function (fVector) {
	this.accl = this.accl.add(fVector.resize(false, 1/this.mass));
};

particle.prototype.process = function (dt) {
	this.vel = this.vel.add(this.accl.resize(false, dt));
	this.accl = new vector(false, 0, 0);
	this.x += this.vel.x * dt;
	this.y += this.vel.y * dt;
};

particle.prototype.draw = function (dest) {
	dest.context.beginPath();
    dest.context.arc(this.x*pixelsPerMeter, this.y*pixelsPerMeter, 30, 0, 2 * Math.PI, false);
    dest.context.stroke();
};

var workplace;
var killcode;

window.onload = function () {
	workplace = new workArea({width: '100%', height: '100%'});
	killcode = setInterval(function () {
		workplace.clear();
		for (var i = 0; i < particleList.length; i++) {
			particleList[i].applyForce(new vector(true, 0, particleList[i].mass*9.8));	//gravity
			particleList[i].process(0.016);
			particleList[i].draw(workplace);
		}
	}, 16);
};

function kill() {
	clearInterval(killcode);
}