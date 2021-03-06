var TILE_WIDTH  = settings.spriteSize[0];
var TILE_HEIGHT = settings.spriteSize[1];

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function FadeTransition() {
	this.transitionCount  = 0;
	this.img = assets.ditherFondu;
	this.onFinishCallback = null;
}

module.exports = FadeTransition;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
FadeTransition.prototype.start = function (options, cb) {
	options = options || {};
	this.img = options.img || assets.ditherFondu;
	this.onFinishCallback = cb;
	this.transitionCount = -30;
	return this;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** return true if it continues and false when ended */
FadeTransition.prototype.update = function () {
	camera(0, 0);
	draw(this.img, 0, this.transitionCount * TILE_HEIGHT);
	if (++this.transitionCount > 0) {
		// this.loadLevel(nextLevel, nextDoor, nextSide);
		this.onFinishCallback && this.onFinishCallback();
		this.onFinishCallback = null;
		return false;
	}
	return true;
};
