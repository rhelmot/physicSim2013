function workArea(options, callbacks) {
	this.canvas = document.createElement('canvas');
	this.context = this.canvas.getContext('2d');
	this.canvas.style.position = 'absolute';
	var props = {
        left: {bounds:document.body.clientWidth, default: 0, dest: this.canvas.style},
        top: {bounds:document.body.clientHeight, default: 0, dest: this.canvas.style},
        width: {bounds:document.body.clientWidth, default: 650, dest: this.canvas},
        height: {bounds:document.body.clientHeight, default: 450, dest: this.canvas}
    };
	for (var i in props) {
	    var val = options[i];
	    if (typeof val == 'undefined') {
	        val = props[i].default;
	    } else if (typeof val == 'string' && val[val.length-1] == '%') {
	        val = props[i].bounds * 100 / parseInt(val);
	    }
	    props[i].dest[i] = val;
	}
	document.body.appendChild(this.canvas);
}

workArea.prototype.clear = function () {
    this.context.clearRect(0,0,1855,968);
};

workArea.prototype.transform = function (options) {
    this.context.save();
    this.context.transform(options.scaleX, options.skewX, options.skewY, options.scaleY, options.x, options.y);
    this.context.transform(cos(options.rot), -sin(options.rot), sin(options.rot), cos(options.rot), 0, 1);
    this.context.globalAlpha *= options.alpha;
};

workArea.prototype.unTransform = function () {
    this.context.restore();
};
