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


GatherConst.ExpandDetails = function(parent, executeBut, cancelBut) {
	var unit = UnitConst.selectedUnit;
	var tile = unit.getTile();
	// prepopulate the number of gatherers
	gatherers = unit.getAllocatedPop(ActionConst.GatherAction);
	maxGatherers = tile.getMaxGatherers();

	parent.append("<p>" + "You have " + gatherers + " people gathering <br>You have " + unit.getAvailablePop() + " people free</p>");
	parent.append("<p>" + "How many would you like to gather here?</p>");

	parent.append("<textarea id='gatherInput' rows='1' cols='10' class='workerInput'>" + gatherers + "</textarea>");

	// here we calculate the effective max based on available population, and what the tile can support
	// note, we need to add the current gatherers to the allocatable to get the actual allocatable
	effectiveMaxGatherers = Math.min(maxGatherers, unit.getAvailablePop() + gatherers);
	parent.append("<span> / max: " + effectiveMaxGatherers + " given conditions</span>");
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
	if (!unit.validateWorkers(workers, ActionConst.GatherAction, unit.getTile().getMaxGatherers())) {
		return;
	}

	// first make sure there are no movements going on - we can't have workers and movement
	MoveConst.RemoveMoveAction(unit);

	unit.commitWorkers(workers, ActionConst.GatherAction);
	ActionConst.CreateAction(ActionConst.GatherAction, unit, workers);
	ActionPanel.HandleSubmit();
}

