var GatherConst = {};

function GatherAction(_unit, _args) {
	Action.call(this, ActionConst.GatherAction, _unit, _args);
}

GatherAction.prototype = Object.create(Action.prototype);
GatherAction.prototype.constructor = GatherAction;

GatherAction.prototype.resolveAction = function() {
	harvest = this.args/10;
	this.unit.food += harvest;
	this.unit.wood += harvest;
	this.unit.turnSummary.harvested.wood += harvest;
	this.unit.turnSummary.harvested.food += harvest;
}

GatherAction.prototype.removeAction = function() {
	Action.prototype.removeAction.call(this);
	this.unit.allocatePop(0, this.type);
}
