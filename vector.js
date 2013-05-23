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