var CookConst = {};

function CookAction(_unit, _args) {
	Action.call(this, _unit, _args);
}

CookAction.prototype = Object.create(Action.prototype);
CookAction.prototype.constructor = CookAction;

CookAction.prototype.resolveAction = function() {
	harvest = this.args / 2
	this.unit.resources.produce(ResourceConst.mealsType, harvest * 15);
	this.unit.resources.consume(ResourceConst.foodType, harvest);
	this.unit.resources.consume(ResourceConst.woodType, harvest);

	// next turn we may not be able to have the same number of cooks due to resource constraints
	// assign the max possible
	this.args = Math.min(this.args, CookConst.GetMaxCooks(this.unit));
}

CookAction.prototype.removeAction = function() {
	Action.prototype.removeAction.call(this);
	this.unit.population.removeAllocation(this.type);
}

CookAction.prototype.getType = function() {
	return ActionConst.CookAction;
}

////////////////////////////// static functions

CookConst.ExpandDetails = function(parent, executeBut, cancelBut) {
	var unit = UnitConst.selectedUnit;
	var tile = unit.getTile();

	var cooks = unit.population.getAllocatedPop(ActionConst.CookAction);
	parent.append("<p>" + "You have " + cooks + " people cooking<br>You have " + CookConst.GetMaxCooks(unit) + " people who can cook</p>");
	parent.append("<p>" + "How many would you like to cook?</p>");
	parent.append("<textarea id='cookInput' rows='1' cols='10' class='workerInput'>" + cooks + "</textarea>");
	parent.append("<span> / max: " + CookConst.GetMaxCooks(unit) + " given conditions</span>");
	parent.append("<br>");
	parent.append(executeBut);
	parent.append(cancelBut);
	parent.append("<p>Cooking allows you to process food into more nutritious meals. 1 Food is processed into 15 meals, which can feed" + 
		"15 people. This requires 2 population and 1 wood.</p>");

	executeBut.on("click", CookConst.HandleSubmit);
	cancelBut.on("click", ActionPanel.HandleCancel);
}

CookConst.HandleSubmit = function() {
	var unit = UnitConst.selectedUnit;
	workers = $("#cookInput").val();
	if (!unit.population.validateWorkers(workers, ActionConst.CookAction)) {
		return;
	}

	// first make sure there are no movements going on - we can't have workers and movement
	MoveConst.RemoveMoveAction(unit);

	unit.population.allocatePop(workers, ActionConst.CookAction);
	ActionConst.CreateAction(ActionConst.CookAction, unit, workers);
	ActionPanel.HandleSubmit();
}

// TODO: this likely is better in its own "Cooking" document so as not to clutter unit code
CookConst.GetMaxCooks = function(unit) {
	var maxNeeded = Math.floor(unit.population.getTotalPop() / 15);
	return Math.min(maxNeeded, Math.floor(unit.resources.getAvailable(ResourceConst.foodType))*2, 
		Math.floor(unit.resources.getAvailable(ResourceConst.woodType))) * 2;		
}

