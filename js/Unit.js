var Unit = {};

Unit.units = [];
Unit.selectedUnit = null;
Unit.growthRate = 0.01;
Unit.mortalityRate = 0.006;

Unit.CreateUnit = function(type, population, resources) {
	var newUnit = {};
	newUnit.population = population;
	newUnit.food = resources.food != null ? resources.food : 0;
	newUnit.wood = resources.wood != null ? resources.wood : 0;
	newUnit.hides = resources.hides != null ? resources.hides : 0;
	newUnit.meals = 0;
	newUnit.type = type;
	newUnit.x = 0;
	newUnit.y = 0;
	newUnit.allocatedPop = 0;
	newUnit.employed = {};

	if (type == "tribal") {
		newUnit.actions = [Action.MoveAction, Action.GatherAction, Action.HuntAction, Action.CookAction, Action.EncampAction];
	}

	Unit.units.push(newUnit);

	return newUnit;
}

Unit.SelectUnit = function(unit) {
	Unit.selectedUnit = unit;
	ActionPanel.LoadUnit(unit);
	Unit.LoadInfo(unit);

}

Unit.GetIconFName = function(unit) {
	if (unit.type == "tribal") {
		return "img/person.png";
	}
}

// displays information about the unit on the GUI
Unit.LoadInfo = function(unit) {
	$("#unit").text(unit.type);
	$("#population").text(Math.floor(unit.population));
	$("#food").text(Math.floor(unit.food));
	$("#wood").text(Math.floor(unit.wood));
}

Unit.MoveUnit = function(unit, x, y) {
	unit.x = x,
	unit.y = y;

	var tileInfo = Map.tileInfos[x][y];

	// remove the existing icon
	if (unit.charIcon != null) {
		unit.charIcon.remove();
	}

	// add a new icon
	Tile.AddUnit(tileInfo, unit);
}

Unit.ProcessTurn = function() {
	// each person needs to eat 0.1 food a turn
	for (var i=0 ; i<Unit.units.length ; i++) {
		var curUnit = Unit.units[i];
		var hungryPeople = curUnit.population;

		// try to feed them with meals
		hungryPeople -= curUnit.meals;
		Turn.AddSummary(Math.min(hungryPeople, curUnit.meals) + " meals were consumed");

		// now feed the remainder with raw food
		if (hungryPeople > 0) {
			curUnit.food -= hungryPeople/10;
			Turn.AddSummary(Math.min(hungryPeople/10, curUnit.food) + " food was consumed");
		}

		// if there are any people that went hungry, they die from starvation
		if (curUnit.food < 0) {
			curUnit.population += curUnit.food;
			Turn.AddSummary(Math.floor(curUnit.food * -1) + " people died from starvation");
		}

		// we now need to factor in spoilage
		// meals spoil immediately if not consumed
		curUnit.meals = 0;

		// process population growth
		if (curUnit.food >= 0) {
			curUnit.population += curUnit.population * Unit.growthRate;
			Turn.AddSummary(Math.floor(curUnit.population * Unit.growthRate) + " people were born");
		}
		// process population death. Note: population death happens regardless of food situation
		curUnit.population -= curUnit.population * Unit.mortalityRate;
		Turn.AddSummary(Math.floor(curUnit.population * Unit.mortalityRate) + " people passed away naturally");

		// we are using food as a counter to measure starvation
		// however, it needs to be reset at the end of the turn
		if (curUnit.food < 0) {
			curUnit.food = 0;			
		}
	}

	Unit.LoadInfo(Unit.selectedUnit);
}

Unit.GetTile = function(unit) {
	return Map.tileInfos[unit.x][unit.y];
}

Unit.GetAvailablePop = function(unit) {
	return Math.floor(unit.population - unit.allocatedPop);
}

Unit.AllocatePop = function(unit, pop, type) {
	if (unit.employed[type] != null) {
		unit.allocatedPop += pop - unit.employed[type];
	} else {
		unit.allocatedPop += pop;
	}
	unit.employed[type] = pop;
}

Unit.ClearAllocatedPop = function(unit) {
	unit.employed = {};
}

Unit.GetAllocatedPop = function(unit, type) {
	if (unit.employed[type] != null) {
		return unit.employed[type];
	}
	return 0;
}

// TODO: this likely is better in its own "Cooking" document so as not to clutter unit code
Unit.GetMaxCooks = function(unit) {
	var maxNeeded = Math.floor(unit.population / 15);
	return Math.min(maxNeeded, Math.floor(unit.food), Math.floor(unit.wood)) * 2;
}
