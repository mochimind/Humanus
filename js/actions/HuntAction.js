var HuntConst = {};
HuntConst.HuntThreshold = 0.9;
HuntConst.BigGameThreshold = 0.85;
HuntConst.MediumGameThreshold = 0.5;

function HuntAction(_unit, _args) {
	Action.call(this, _unit, _args);
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
				this.unit.resources.produce(ResourceConst.foodType,10);
				this.unit.resources.produce(ResourceConst.hidesType, 10);
				tile.updateAnimals(-100);
			} else if (animalTypeScore >= HuntConst.MediumGameThreshold) {
				this.unit.resources.produce(ResourceConst.foodType,3);
				this.unit.resources.produce(ResourceConst.hidesType, 3);
				tile.updateAnimals(-50);
			} else {
				this.unit.resources.produce(ResourceConst.foodType,1);
				this.unit.resources.produce(ResourceConst.hidesType, 1);
			}
			if (animalAmount <= 0) {
				return;
			}
		}
	}
}

// TODO: change type to be a function, rather than an argument
HuntAction.prototype.removeAction = function() {
	Action.prototype.removeAction.call(this);
	this.unit.population.unallocatePop(this.type);
}

HuntAction.prototype.getType = function() {
	return ActionConst.HuntAction;
}



///////////////////////////// static functions

HuntConst.ExpandDetails = function(parent, executeBut, cancelBut) {
	var unit = UnitConst.selectedUnit;
	var tile = unit.getTile();

	hunters = unit.population.getAllocatedPop(ActionConst.HuntAction);
	parent.append("<p>" + "You have " + hunters + " people hunting<br>You have " + unit.population.getAvailablePop(ActionConst.HuntAction) + " who can hunt</p>");
	parent.append("<p>" + "How many would you like to hunt here?</p>");
	parent.append("<textarea id='huntInput' rows='1' cols='10' class='workerInput'>" + hunters + "</textarea>");
	parent.append("<br>");
	parent.append(executeBut);
	parent.append(cancelBut);
	parent.append("<p>Hunting allows you to catch game that gives a lot of food and hides." + 
		"However, your hunters are not guaranteed to land a catch! Each hunter has a 10% chance to net a catch will net you on average 3 food & hides." + 
		" Remember, constant hunting in a certain area will deplete the stocks of animals in that area. </p>");

	executeBut.on("click", HuntConst.HandleSubmit);
	cancelBut.on("click", ActionPanel.HandleCancel);
}

HuntConst.HandleSubmit = function() {
	var unit = UnitConst.selectedUnit;
	workers = $("#huntInput").val();
	if (!unit.population.validateWorkers(workers, ActionConst.HuntAction)) {
		return;
	}

	// first make sure there are no movements going on - we can't have workers and movement
	MoveConst.RemoveMoveAction(unit);

	unit.population.allocatePop(workers, ActionConst.HuntAction);
	ActionConst.CreateAction(ActionConst.HuntAction, unit, workers);
	ActionPanel.HandleSubmit();
}
