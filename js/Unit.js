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
	console.log(this);

	if (type == "tribal") {
		this.actions = [Action.MoveAction, Action.GatherAction, Action.HuntAction, Action.CookAction, Action.EncampAction];
	}

	UnitConst.units.push(this);

	this.selectUnit = function() {
		UnitConst.selectedUnit = this;
		ActionPanel.LoadUnit(this);
		this.loadInfo();
	}

	this.getIconFName = function() {
		if (this.type == "tribal") {
			return "img/person.png";
		}
	}

	// displays information about the unit on the GUI
	this.loadInfo = function() {
		$("#unit").text(this.type);
		$("#population").text(Math.floor(this.population));
		$("#foodAmount").text(Math.floor(this.food));
		$("#woodAmount").text(Math.floor(this.wood));
		$("#hidesAmount").text(Math.floor(this.hides));
	}

	this.moveUnit = function(x, y) {
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

	this.getTile = function() {
		return Map.tileInfos[this.x][this.y];
	}

	this.getAvailablePop = function() {
		return Math.floor(this.population - this.allocatedPop);
	}

	this.allocatePop = function(pop, type) {
		if (this.employed[type] != null) {
			this.allocatedPop += pop - this.employed[type];
		} else {
			this.allocatedPop += pop;
		}
		this.employed[type] = pop;		
	}

	this.clearAllocatedPop = function() {
		this.employed = {};
	}

	this.getAllocatedPop = function(type) {
		if (this.employed[type] != null) {
			return this.employed[type];
		}
		return 0;		
	}

	// TODO: this likely is better in its own "Cooking" document so as not to clutter unit code
	this.getMaxCooks = function() {
		maxNeeded = Math.floor(this.population / 15);
		return Math.min(maxNeeded, Math.floor(this.food), Math.floor(this.wood)) * 2;		
	}

	this.clearTurnSummary = function() {
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

	this.processTurn = function() {
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
}


UnitConst.ClearTurnSummaries = function() {
	for (var i=0 ; i<UnitConst.units.length ; i++) {
		UnitConst.units[i].clearTurnSummary();
	}
}

UnitConst.ProcessTurn = function() {
	// each person needs to eat 0.1 food a turn
	for (var i=0 ; i<UnitConst.units.length ; i++) {
		UnitConst.units[i].processTurn();
	}

	UnitConst.selectedUnit.loadInfo();
}
