var HuntConst = {};
HuntConst.HuntThreshold = 0.9;
HuntConst.BigGameThreshold = 0.85;
HuntConst.MediumGameThreshold = 0.5;

function HuntAction(_unit, _args) {
	Action.call(this, ActionConst.HuntAction, _unit, _args);
}

HuntAction.prototype = Object.create(Action.prototype);
HuntAction.prototype.constructor = HuntAction;

HuntAction.prototype.resolveAction = function() {
	var tile = this.unit.getTile()
	animalAmount = tile.getAvailableAnimals();
	if (animalAmount <= 0) {
		return;
	}
	for (var j=0 ; j<this.args ; j++) {
		score = Math.random();
		if (score > HuntConst.HuntThreshold) {
			animalAmount--;
			animalTypeScore = Math.random();
			if (animalTypeScore >= HuntConst.BigGameThreshold) {
				this.unit.food += 10;
				this.unit.hides += 10;
				this.unit.turnSummary.harvested.food += 10;
				this.unit.turnSmmary.harvested.hides += 10;
				tile.updateAnimals(-100);
			} else if (animalTypeScore >= HuntConst.MediumGameThreshold) {
				this.unit.food += 3;
				this.unit.hides += 3;
				this.unit.turnSummary.harvested.food += 3;
				this.unit.turnSummary.harvested.hides += 3;
				tile.updateAnimals(-50);
			} else {
				this.unit.food += 1;
				this.unit.hides += 1;
				this.unit.turnSummary.harvested.food += 1;
				this.unit.turnSummary.harvested.hides += 1;
			}
			if (animalAmount <= 0) {
				return;
			}
		}
	}
}

HuntAction.prototype.removeAction = function() {
	Action.prototype.removeAction.call(this);
	this.unit.allocatePop(0, this.type);
}
