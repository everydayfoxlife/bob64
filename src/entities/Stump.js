var Entity        = require('./Entity.js');
var Spit          = require('./Spit.js');
var AABBcollision = require('../AABBcollision.js');

var a = assets.entities.stump;
var WALK_ANIM = [a.walk0, a.walk1, a.walk2, a.walk3, a.walk4, a.walk5];
var SPIT_ANIM = [a.spit0, a.spit1, a.spit2, a.spit3, a.spit4];
var HIT_IMG   = a.hit;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function Stump() {
	Entity.call(this);

	// properties
	this.isAttackable = true;

	// physic
	this.gravity    = 0.12;
	this.maxGravity = 1;

	// stump properties
	this.speed      = 0.10;
	this.direction  = 1;
	this.isHit      = false;
	this.hitCounter = 0;
	this.lifePoints = 3;

	// rendering & animation
	this.flipH     = false;
	this.frame     = 0;
	this.animSpeed = 0.12;
	this.anim      = WALK_ANIM;

	// state
	this.attackCounter = 0;
	this.hasSpit = false;
}
inherits(Stump, Entity);

module.exports = Stump;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/* return true if entity needs to check collision with level */
Stump.prototype.move = function (level, bob) {

	if (!this.isHit && bob.isAttackable && AABBcollision(this, bob)) {
		// collision with Bob detected
		bob.hit(this);
	}

	// keep in bounds
	if (level.getTileAt(this.x + 4 + this.direction * 6, this.y + 4).isEntityLimit) {
		// turn around
		this.direction *= -1;
		this.flipH = this.direction === -1;
		this.sx = 0;
	}

	// states
	if (this.isHit) {
		if (this.hitCounter++ > 16) {
			// hit end
			this.lifePoints -= 1;
			if (this.lifePoints <= 0) return this.explode();
			this.isHit = false;
			this.isAttackable = true;
		}
	} else if (this.grounded && this.attackCounter++ > 180) {
		this.attackCounter = 0;
		this.anim = SPIT_ANIM;
		this.frame = 0;
		this.sx = 0;
		// TODO
		return true
	}

	// walking
	if (this.grounded) {
		if (this.anim !== SPIT_ANIM) {
			this.sx = this.speed * this.direction;
			// test next front ground
			if (level.getTileAt(this.x + 4 + this.direction * 2, this.y + 10).isEmpty) {
				// turn around
				this.direction *= -1;
				this.flipH = this.direction === -1;
			}
		}
	} else {
		this.fall();
	}
	return true;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Stump.prototype.collideFront = function (direction) {
	if (this.direction !== direction) return;
	// make entity turn around
	this.sx = 0;
	this.direction *= -1;
	this.flipH = this.direction === -1;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Stump.prototype.animate = function () {
	if (this.isHit) {
		draw(HIT_IMG, this.x, this.y - 8, this.flipH);
		return;
	}
	this.frame += this.animSpeed;
	if (this.anim === SPIT_ANIM) {
		if (!this.hasSpit && this.frame >= 4) {
			this.hasSpit = true;
			this.spit();
		}
		if (this.frame >= this.anim.length) {
			this.anim = WALK_ANIM;
			this.frame = 0;
			this.hasSpit = false;
		}
	}
	if (this.frame >= this.anim.length) this.frame = 0;
	var img = this.anim[~~this.frame];
	draw(img, this.x - 1, this.y - 8, this.flipH);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Stump.prototype.setDirection = function (direction) {
	this.direction = direction;
	this.flipH = this.direction === -1;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Stump.prototype.hit = function (attacker) {
	// from where do hit comes from ?
	this.grounded = false;
	this.attackCounter = 0;
	if (attacker.x < this.x) {
		this.direction = -1;
		this.flipH = true;
		this.sx = 1;
	} else {
		this.direction = 1;
		this.flipH = false;
		this.sx = -1;
	}
	this.isHit = true;
	this.hitCounter = 0;
	this.isAttackable = false;
	this.sy = -2;
	this.anim = WALK_ANIM;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Stump.prototype.spit = function () {
	var spit = new Spit();
	spit.setDirection(this.direction).setPosition(this.x, this.y + 3);
	this.controller.addEntity(spit);
};