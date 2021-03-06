var GatherConst = {};

function GatherAction(_unit, _args) {
	Action.call(this, _unit, _args);
}

GatherAction.prototype = Object.create(Action.prototype);
GatherAction.prototype.constructor = GatherAction;

GatherAction.prototype.resolveAction = function() {
	harvest = this.args/10;
	this.unit.resources.produce(ItemList.Food.id, harvest);
	this.unit.resources.produce(ItemList.Wood.id, harvest);
}

GatherAction.prototype.removeAction = function() {
	Action.prototype.removeAction.call(this);
	this.unit.population.removeAllocation(this.type);
}

GatherAction.prototype.getType = function() {
	return ActionConst.GatherAction;
}

GatherAction.prototype.newTurn = function() {
	var available = this.unit.population.getAvailablePop(ActionConst.GatherAction);
	this.args = Math.min(this.args, available);
	this.unit.population.allocatePop(this.args, ActionConst.GatherAction);
}


////////////////////////////////// static functions

GatherConst.ExpandDetails = function(parent, executeBut, cancelBut) {
	var unit = UnitConst.selectedUnit;
	var tile = unit.getTile();
	// prepopulate the number of gatherers
	var gatherers = unit.population.getAllocatedPop(ActionConst.GatherAction);
	var maxGatherers = tile.getMaxGatherers();

	parent.append("<p>" + "You have " + gatherers + " people gathering <br>You have " + unit.population.getAvailablePop(ActionConst.GatherAction) + " who can gather</p>");
	parent.append("<p>" + "How many would you like to gather here?</p>");

	parent.append("<textarea id='gatherInput' rows='1' cols='10' class='workerInput'>" + gatherers + "</textarea>");

	// here we calculate the effective max based on available population, and what the tile can support
	// note, we need to add the current gatherers to the allocatable to get the actual allocatable
	effectiveMaxGatherers = Math.min(maxGatherers, unit.population.getAvailablePop(ActionConst.GatherAction));
	parent.append("<span> / max: " + effectiveMaxGatherers + " given conditions</span>");
	parent.append("<br>");
	parent.append(executeBut);
	parent.append(cancelBut);
	parent.append("<p>Gathering yields a small amount of food and wood (1 of each per 10 people working)." + 
		" More people can gainfully work the land if the plant life is plentiful in the area. </p>");

	executeBut.on("click", GatherConst.HandleSubmit);
	cancelBut.on("click", ActionPanel.HandleCancel);
}

GatherConst.HandleSubmit = function() {
	var unit = UnitConst.selectedUnit;
	workers = $("#gatherInput").val();
	if (!unit.population.validateWorkers(workers, ActionConst.GatherAction)) {
		return;
	}

	// first make sure there are no movements going on - we can't have workers and movement
	MoveConst.RemoveMoveAction(unit);

	unit.population.allocatePop(workers, ActionConst.GatherAction);
	ActionConst.CreateAction(ActionConst.GatherAction, unit, workers);
	ActionPanel.HandleSubmit();
}

