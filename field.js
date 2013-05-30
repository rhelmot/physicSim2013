function field(processFunction, bounds, drawFunction) {
	this.process = processFunction;
	this.bounds = bounds;
	this.draw = drawFunction;
}

function electricalField(fieldVector, bounds) {
	return new field(function (particle) {
		particle.applyForce(fieldVector.scale(particle.charge));
	}, bounds, function (dest) {
	    var fb = this.bounds.normalize();
		var c = fieldVector.components;
		var r = new Rectangle(fb.x1*pixelsPerMeter, fb.y1*pixelsPerMeter, fb.x2*pixelsPerMeter, fb.y2*pixelsPerMeter);
		if (c[0] == 0) {
		    for (var cw = r.x1; cw < r.x2; cw += 40) {
		        dest.drawArrow(cw, (c[1] < 0)?r.y2:r.y1, cw, (c[1] < 0)?r.y1:r.y2);
		    }
		} else {
		    var m = c[1]/c[0];
		    var normal = fieldVector.getUnitVector().scale(40);
   		    var temp = normal.components[0];
   		    normal.components[0] = normal.components[1];
   		    normal.components[1] = -temp;
   		    var out;
   		    for (var i = 0.5; out = howLineTouch(r.x1 + normal.components[0]*i, r.y1 + normal.components[1]*i, m, r); i++) {
   		        if (c[0] > 0) {
   		            dest.drawArrow(out.x1, out.y1, out.x2, out.y2, 'gold');
   		        } else {
   		            dest.drawArrow(out.x2, out.y2, out.x1, out.y1, 'gold');
   		        }
   		    }
   		    for (var i = -0.5; out = howLineTouch(r.x1 + normal.components[0]*i, r.y1 + normal.components[1]*i, m, r); i--) {
   		        if (c[0] > 0) {
   		            dest.drawArrow(out.x1, out.y1, out.x2, out.y2, 'gold');
   		        } else {
   		            dest.drawArrow(out.x2, out.y2, out.x1, out.y1, 'gold');
   		        }
   		    }
		}
	});
}

function lingen(x, y, m) {
    return function (t) {
        return (m*t) - (m*x) + y;
    };
}

function howLineTouch(x0, y0, m, r) {
    var f = lingen(x0, y0, m);
    var y1 = f(r.x1);
    var y2 = f(r.x2);
    if ((y1 > r.y2 && y2 > r.y2) || (y1 < r.y1 && y2 < r.y1)) {
        return false;
    }
    var out = {x1: r.x1, y1: y1, x2: r.x2, y2: y2};
    if (m > 0) {
        if (y1 < r.y1) {
            out.y1 = r.y1;
            out.x1 = (r.y1-y0)/m + x0;
        }
        if (y2 > r.y2) {
            out.y2 = r.y2;
            out.x2 = (r.y2-y0)/m + x0;
        }
    } else {
        if (y1 > r.y2) {
            out.y1 = r.y2;
            out.x1 = (r.y2-y0)/m + x0;
        }
        if (y2 < r.y1) {
            out.y2 = r.y1;
            out.x2 = (r.y1-y0)/m + x0;
        }
    }
    return out;
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
	    var fb = this.bounds.normalize();
		for (var ch = fb.y1; ch < fb.y2; ch += 30/pixelsPerMeter) {
			for (var cw = fb.x1; cw < fb.x2; cw += 30/pixelsPerMeter) {
			    (strength>0)?(dest.drawX(cw*pixelsPerMeter, ch*pixelsPerMeter, 7, 'blue')):(dest.drawDot(cw*pixelsPerMeter, ch*pixelsPerMeter, 3, 'blue'));
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
Rectangle.prototype.normalize = function () {
    var r = new Rectangle(this.x1, this.y1, this.x2, this.y2);
    if (r.x1 > r.x2) {
        r.x1 = this.x2;
        r.x2 = this.x1;
    }
    if (r.y1 > r.y2) {
        r.y1 = this.y2;
        r.y2 = this.y1;
    }
    return r;
}

function addField(whichField) {
	fieldList[fieldList.length] = whichField;
	return whichField;
}
