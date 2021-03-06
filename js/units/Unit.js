var UnitConst = {};

UnitConst.units = [];
UnitConst.mobileType = "Nomadic";
UnitConst.settlementType = "Settlement";
UnitConst.selectedUnit = null;

function Unit(resources) {
	this.population = new Population(this);
	this.resources = resources;
	this.actions = [];
	this.x = 0;
	this.y = 0;

	UnitConst.units.push(this);
}

Unit.prototype.selectUnit = function() {
	UnitConst.selectedUnit = this;
	ActionPanel.LoadUnit(this);
	this.loadInfo();
	UnitPanel.UpdatePopulation(this.population);
	UnitPanel.UpdateResources(this.resources);

}

Unit.prototype.getIconFName = function() {
	console.log("error: icon not implemented for type " + this.type);
}

// displays information about the unit on the GUI
Unit.prototype.loadInfo = function() {
	this.population.loadInfo();
	this.resources.loadInfo();
}

Unit.prototype.getType = function() {
	console.log("error: unit does not have type");
}

Unit.prototype.moveUnit = function(x, y) {
	this.x = x,
	this.y = y;

	var tileInfo = Map.tileInfos[x][y];

	// remove the existing icon
	if (this.charIcon != null) {
		this.charIcon.remove();
	}

	// add a new icon
	tileInfo.addUnit(this);
}

Unit.prototype.getTile = function() {
	return Map.tileInfos[this.x][this.y];
}

Unit.prototype.newTurn = function() {
	this.moved = false;
	this.population.newTurn();
	this.resources.newTurn();
	ActionConst.NewTurn(this);
}

Unit.prototype.getTurnSummary = function() {
	var outArr = [];
	var tempArr = this.population.getTurnSummary();
	for (const tok in tempArr) {
		outArr.push(tempArr[tok]);
	}
	tempArr = this.resources.getTurnSummary();
	for (const tok in tempArr) {
		outArr.push(tempArr[tok]);
	}

	if (this.moved) {
		outArr.push("moved 1 tile");
	}

	return outArr;
}

Unit.prototype.possibleActions = function() {
	return [];
}

Unit.prototype.getPossibleActions = function() {
	var actionList = [];
	for (var i=0; i<this.population.data.length ; i++) {
		var processActions = this.population.data[i].data.actions;
		for (const tok in processActions) {
			if (!actionList.includes(processActions[tok])) {
				actionList.push(processActions[tok]);
			}
		}
	}
	var processActions = this.possibleActions();

	for (var i=0 ; i<processActions.length ; i++) {
		if (!actionList.includes(processActions[i])) {
			actionList.push(processActions[i]);
		}
	}

	return actionList;
}

Unit.prototype.canCraft = function() {
	return [];
}

Unit.prototype.getPossibleCrafts = function() {
	var canCraftList = [];
	for (var i=0 ; i<this.population.data.length ; i++) {
		var processItems = this.population.data[i].data.crafts;
		for (var j=0 ; j<processItems.length ; j++) {
			if (!canCraftList.includes(processItems[j])) {
				canCraftList.push(processItems[j]);
			}
		}
	}

	var processItems = this.canCraft();
	for (var i=0 ; i<processItems.length ; i++) {
		if (!canCraftList.includes(processItems[i])) {
			canCraftList.push(processItems[j]);
		}
	}

	return canCraftList;
}

Unit.prototype.processTurn = function() {
	this.population.processTurn();
	this.resources.processTurn();
}



////////////////////////// Global functions

UnitConst.NewTurn = function() {
	for (var i=0 ; i<UnitConst.units.length ; i++) {
		UnitConst.units[i].newTurn();
	}
}

UnitConst.ProcessTurn = function() {
	// each person needs to eat 0.1 food a turn
	for (var i=0 ; i<UnitConst.units.length ; i++) {
		ActionConst.ProcessActions(UnitConst.units[i]);
		UnitConst.units[i].processTurn();
	}

	UnitConst.selectedUnit.loadInfo();
}

