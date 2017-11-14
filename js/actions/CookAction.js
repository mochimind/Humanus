var CookConst = {};

function CookAction(_unit, _args) {
	Action.call(this, ActionConst.CookAction, _unit, _args);
}

CookAction.prototype = Object.create(Action.prototype);
CookAction.prototype.constructor = CookAction;

CookAction.prototype.resolveAction = function() {
	harvest = this.args / 2
	this.unit.meals += harvest * 15;
	this.unit.food -= harvest;
	this.unit.wood -= harvest;
	this.unit.turnSummary.harvested.meals += harvest*15;
	this.unit.turnSummary.consumed.food += harvest;
	this.unit.turnSummary.consumed.wood += harvest;

	// next turn we may not be able to have the same number of cooks due to resource constraints
	// assign the max possible
	this.args = Math.min(this.args, Math.floor(this.unit.food*2), Math.floor(this.unit.wood*2));
}

CookAction.prototype.removeAction = function() {
	Action.prototype.removeAction.call(this);
	this.unit.allocatePop(0, this.type);
}

