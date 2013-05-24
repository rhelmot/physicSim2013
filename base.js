var particleList = [];
var fieldList = [];
var pixelsPerMeter = 4000;

var workplace;
var edirplace;
var killcode;
var running = false;

window.onload = function () {
	settings.field.direction = new vector([0, -1, 0]);
	workplace = new workArea({width: '100%', height: '100%'}, {onmousedown: mouseDown, onmousemove: mouseMove, onmouseup: mouseUp, ontouchdown: touchDown, ontouchmove: touchMove, ontouchup: touchUp});
	workplace.canvas.id = 'workplace';
	edirplace = new workArea({width: 150, height: 150}, {onmousedown: mouseDownE, onmousemove: mouseMoveE, onmouseup: mouseUpE, ontouchdown: touchDownE, ontouchmove: touchMoveE, ontouchup: touchUpE}, document.getElementById('eDirectionDiv'));
	edirplace.canvas.style.border = "2px solid black";
	killcode = setInterval(function () {							//MAIN LOOP
		workplace.clear();
		edirplace.clear();
		edirplace.drawArrow(75,75,75+settings.field.direction.components[0]*70,75+settings.field.direction.components[1]*70);
		if (running) {
			step(1);
		}
		for (var i = 0; i < fieldList.length; i++) {
			fieldList[i].draw(workplace);
		}
		for (var i = 0; i < particleList.length; i++) {
			particleList[i].draw(workplace);
		}
		if (settings.particle.dragging !== false) {
		    workplace.drawArrow(settings.particle.dropX, settings.particle.dropY, particleList[settings.particle.dragging].x*pixelsPerMeter, particleList[settings.particle.dragging].y*pixelsPerMeter);
		}
	}, 16);
};


function step(frames) {
	for (var i = 0; i < fieldList.length; i++) {
		for (var j = 0; j < particleList.length; j++) {
			if (fieldList[i].bounds.hitPoint(particleList[j].x, particleList[j].y)) {
				fieldList[i].process(particleList[j]);
			}
		}
	}
	for (var i = 0; i < particleList.length; i++) {
		for (var j = i + 1; j < particleList.length; j++) {
			particleList[i].interact(particleList[j]);
		}
		particleList[i].process(frames*0.016);
	}
}

function kill() {
	clearInterval(killcode);
}
