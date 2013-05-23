function field(processFunction, bounds, drawFunction) {
	this.process = processFunction;
	this.bounds = bounds;
	this.draw = drawFunction;
}

function electricalField(fieldVector, bounds) {
	return new field(function (particle) {
		particle.applyForce(fieldVector.scale(particle.charge));
	}, function (dest) {
		
	});
}

function gravitationalField() {
	return new field(function (particle) {
		particle.applyForce(new vector([0, 9.8/particle.mass,0]));
	}, new Rectangle(-1e6, -1e6, 1e6, 1e6), function () {});
}

function magneticField(strength, bounds) {			// into the page, positive. Out of the page, negative. This is not a 3D simulator.
	return new field(function (particle) {
		particle.applyForce(particle.vel.cross(new vector([0, 0, strength])).scale(particle.charge));
	}, bounds, function (dest) {
		for (var ch = this.bounds.y1; ch < this.bounds.y2; ch += 30/pixelsPerMeter) {
			for (var cw = this.bounds.x1; cw < this.bounds.x2; cw += 30/pixelsPerMeter) {
				dest.drawX(cw*pixelsPerMeter, ch*pixelsPerMeter, 7, 'blue');
			}
		}
	});
}

function Rectangle(x1, y1, x2, y2, usesizes) {
	this.x1 = x1;
	this.y1 = y1;
	if (usesizes)
	{
		this.width = x2;
		this.height = y2;
		this.x2 = x1 + x2;
		this.y2 = y1 + y2;
	}
	else if (typeof x2 == 'undefined')
	{
		this.x1 = this.y1 = 0;
		this.x2 = this.width = x1;
		this.y2 = this.height = y1;
	}
	else
	{
		this.x2 = x2;
		this.y2 = y2;
		this.width = x2 - x1;
		this.height = y2 - y1;
	}
}
Rectangle.prototype.hitPoint = function (x,y) {
	return x >= this.x1 && x <= this.x2 && y >= this.y1 && y <= this.y2;
};
Rectangle.prototype.hitRect = function (rect) {
	var mx = this.width + rect.width;
	var my = this.height + rect.height;
	var dx = this.x2 - rect.x1;
	var dy = this.y2 - rect.y1;
	return 0 <= dx && dx <= mx && 0 <= dy && dy <= my;
};

function addField(whichField) {
	fieldList[fieldList.length] = whichField;
	return whichField;
}