var particleList = [];
var fieldList = [];
var pixelsPerMeter = 4000;

var workplace;
var edirplace;
var killcode;
var running = false;

window.onload = function () {
    generateInterface();
	
	killcode = setInterval(function () {							//MAIN LOOP
		workplace.clear();
		settings.field.electrical.direction.draw();
		if (running) {
			step(1);
		}
		for (var i = 0; i < fieldList.length; i++) {
			fieldList[i].draw(workplace);
		}
		for (var i = 0; i < particleList.length; i++) {
			if (particleList[i].dragging && settings.particle.dragging === false) {
				particleList[i].dragging = false;
			}
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

function clearOffscreenParticles() {
    var newpart = [];
    var screen = new Rectangle(-workplace.origin.x/pixelsPerMeter, -workplace.origin.y/pixelsPerMeter, workplace.canvas.width/pixelsPerMeter, workplace.canvas.height/pixelsPerMeter, true);
    for (var i = 0; i < particleList.length; i++) {
        if (screen.hitPoint(particleList[i].x, particleList[i].y)) {
            newpart[newpart.length] = particleList[i];
			if (i === settings.particle.dragging) {
				settings.particle.dragging = newpart.length - 1;
			}
        }
    }
    particleList = newpart;
}

setInterval(clearOffscreenParticles, 250);

