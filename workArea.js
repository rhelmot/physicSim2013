function workArea(options, callbacks) {
	this.canvas = document.createElement('canvas');
	this.context = this.canvas.getContext('2d')
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
	this.tpoints = {};
	this.canvas.onmousedown = callbacks.onmousedown;
	this.canvas.onmousemove = callbacks.onmousemove;
	this.canvas.onmouseup = callbacks.onmouseup;
	this.canvas.addEventListener('touchstart', callbacks.ontouchdown, false);
	this.canvas.addEventListener('touchmove', callbacks.ontouchmove, false);
	this.canvas.addEventListener('touchend', callbacks.ontouchup, false);
	this.canvas.tabIndex = 1;
	this.canvas.onselectstart = function () { return false; };
	this.canvas.workArea = this;									//awwww yeah recursion
	document.body.appendChild(this.canvas);
}

workArea.prototype.clear = function () {
    this.context.clearRect(0,0,document.body.clientWidth,document.body.clientHeight);
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

workArea.prototype.drawArrow = function (fromx, fromy, tox, toy) {
    var headlen = 10;   // length of head in pixels
    var angle = Math.atan2(toy-fromy,tox-fromx);
    this.context.beginPath();
    this.context.moveTo(fromx, fromy);
    this.context.lineTo(tox, toy);
    this.context.lineTo(tox-headlen*Math.cos(angle-Math.PI/6),toy-headlen*Math.sin(angle-Math.PI/6));
    this.context.moveTo(tox, toy);
    this.context.lineTo(tox-headlen*Math.cos(angle+Math.PI/6),toy-headlen*Math.sin(angle+Math.PI/6));
    this.context.stroke();
}
