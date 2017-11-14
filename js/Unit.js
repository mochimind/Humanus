var UnitConst = {};

UnitConst.units = [];
UnitConst.resources = ["food", "wood", "hides", "meals"];
UnitConst.selectedUnit = null;
UnitConst.growthRate = 0.01;
UnitConst.mortalityRate = 0.006;

function Unit(type, population, resources) {
	this.population = population;
	this.food = resources.food != null ? resources.food : 0;
	this.wood = resources.wood != null ? resources.wood : 0;
	this.hides = resources.hides != null ? resources.hides : 0;
	this.meals = 0;
	this.type = type;
	this.x = 0;
	this.y = 0;
	this.allocatedPop = 0;
	this.employed = {};
	this.actions = [];

	if (type == "tribal") {
		this.possibleActions = [ActionConst.MoveAction, ActionConst.GatherAction, ActionConst.HuntAction, ActionConst.CookAction, ActionConst.EncampAction];
	}

	UnitConst.units.push(this);

}

Unit.prototype.selectUnit = function() {
	UnitConst.selectedUnit = this;
	ActionPanel.LoadUnit(this);
	this.loadInfo();
}

Unit.prototype.getIconFName = function() {
	if (this.type == "tribal") {
		return "img/person.png";
	}
}

// displays information about the unit on the GUI
Unit.prototype.loadInfo = function() {
	$("#unit").text(this.type);
	$("#population").text(Math.floor(this.population));
	$("#foodAmount").text(Math.floor(this.food));
	$("#woodAmount").text(Math.floor(this.wood));
	$("#hidesAmount").text(Math.floor(this.hides));
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

Unit.prototype.getAvailablePop = function() {
	return Math.floor(this.population - this.allocatedPop);
}

Unit.prototype.allocatePop = function(pop, type) {
	if (this.employed[type] != null) {
		this.allocatedPop += pop - this.employed[type];
	} else {
		this.allocatedPop += pop;
	}
	this.employed[type] = pop;		
}

Unit.prototype.clearAllocatedPop = function() {
	this.employed = {};
}

Unit.prototype.getAllocatedPop = function(type) {
	if (this.employed[type] != null) {
		return this.employed[type];
	}
	return 0;		
}

Unit.prototype.clearTurnSummary = function() {
	this.turnSummary = {
		'harvested': {}, 
		'consumed': {}, 
		'population': 0, 
		'moved': false
	};
	for (var j=0 ; j<UnitConst.resources.length ; j++) {
		this.turnSummary.harvested[UnitConst.resources[j]] = 0;
		this.turnSummary.consumed[UnitConst.resources[j]] = 0;
	}
}

Unit.prototype.processTurn = function() {
	oldPopulation = this.population;
	hungryPeople = this.population;
	var summary = this.turnSummary;

	// try to feed them with meals
	hungryPeople -= this.meals;
	summary.consumed.meals += this.meals;

	// now feed the remainder with raw food
	if (hungryPeople > 0) {
		summary.consumed.food += Math.min(hungryPeople/10, this.food);
		this.food -= hungryPeople/10;
	}

	// if there are any people that went hungry, they die from starvation
	if (this.food < 0) {
		this.population += this.food;
	}

	// we now need to factor in spoilage
	// meals spoil immediately if not consumed
	this.meals = 0;

	// process population growth
	if (this.food >= 0) {
		this.population += this.population * UnitConst.growthRate;
	}
	// process population death. Note: population death happens regardless of food situation
	this.population -= this.population * UnitConst.mortalityRate;

	// we are using food as a counter to measure starvation
	// however, it needs to be reset at the end of the turn
	if (this.food < 0) {
		this.food = 0;			
	}
	if (Math.floor(oldPopulation) != Math.floor(this.population)) {
		summary.population = Math.floor(this.population) - Math.floor(oldPopulation);
	}
}

Unit.prototype.validateWorkers = function(workers, action, maxPossible) {
	var curWorkers = this.getAllocatedPop(action);
	if (isNaN(workers)) {
		alert("please input a valid number");
		return false;
	}

	if (workers < 0) {
		alert ("please input a positive number");
		return false;
	}

	if (action != ActionConst.MoveAction && workers-curWorkers > this.getAvailablePop()) {
		alert ("not enough population to allocate!");
		return false;
	}

	if (maxPossible != null && workers > maxPossible) {
		alert("can't have that many workers here!");
		return false;
	}

	return true;
}

Unit.prototype.commitWorkers = function(_workers, action) {
	// make sure we get rid of decimals
	workers = Math.floor(_workers);

	this.allocatePop(workers, action);
}


UnitConst.ClearTurnSummaries = function() {
	for (var i=0 ; i<UnitConst.units.length ; i++) {
		UnitConst.units[i].clearTurnSummary();
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

