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

var capMouseDown = function (e) {
	this.workArea.tpoints[0] = {x: e.pageX-e.target.offsetLeft, y: e.pageY-e.target.offsetTop, frame: true};
};
var capMouseMove = function (e) {
	if (this.workArea.tpoints[0])
		this.workArea.tpoints[0] = {x: e.pageX-e.target.offsetLeft, y: e.pageY-e.target.offsetTop, frame: false};
};
var capMouseUp = function (e) {
	this.workArea.tpoints[0] = false;
};

var capTouchStart = function (e) {
	e.preventDefault();
	for (var i = 0; i < e.changedTouches.length; i++)
	{
		var t = e.changedTouches[i];
		this.workArea.tpoints[t.identifier+1] = {x:t.pageX-e.target.offsetLeft, y:t.pageY-e.target.offsetTop, frame:true};
	}
};
var capTouchMove = function (e) {
	e.preventDefault();
	for (var i = 0; i < e.changedTouches.length; i++)
	{
		var t = e.changedTouches[i];
		this.workArea.tpoints[t.identifier+1] = {x:t.pageX-e.target.offsetLeft, y:t.pageY-e.target.offsetTop, frame:false};
	}
};
var capTouchEnd = function (e) {
	e.preventDefault();
	for (var i = 0; i < e.changedTouches.length; i++)
	{
		this.workArea.tpoints[e.changedTouches[i].identifier+1] = false;
	}
};


workArea.prototype.endProcess = function () {
	for (var i in this.tpoints)
	{
		if (typeof this.tpoints[i] == 'object')
		{
			this.tpoints[i].frame = false;
			this.tpoints[i].used = false;
		}
	}
};
workArea.prototype.isTouch = function (rect, isframe, finger) {
	if (typeof isframe != 'boolean')
		isframe = true;
	if (!finger)
		finger = false;
	var n = g.controls.istouchfinger(rect, isframe, finger);
	if (n >= 0)
		return true;
	return false;
};
workArea.prototype.isTouchFinger = function (rect, isframe, finger) {
	if (typeof isframe != 'boolean')
		isframe = true;
	for (var i in this.tpoints)
	{
		if (finger)
			i = finger;
		if (this.tpoints[i] && !this.tpoints[i].used && (!isframe || this.tpoints[i].frame) && rect.hitPoint(this.tpoints[i].x, this.tpoints[i].y))
		{
			this.tpoints[i].used = true;
			return i;
		}
		if (finger)
			return -1;
	}
	return -1;
};