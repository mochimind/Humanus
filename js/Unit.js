var Unit = {};

Unit.units = [];
Unit.selectedUnit = null;
Unit.growthRate = 0.01;
Unit.mortalityRate = 0.006;

Unit.CreateUnit = function(type) {
	var newUnit = {};
	newUnit.population = 100;
	newUnit.food = 100;
	newUnit.wood = 0;
	newUnit.type = type;

	Unit.units.push(newUnit);

	return newUnit;
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

Unit.ProcessTurn = function() {
	// each person needs to eat 0.1 food a turn
	for (var i=0 ; i<Unit.units.length ; i++) {
		var curUnit = Unit.units[i];
		curUnit.food -= curUnit.population/10;
		if (curUnit.food < 0) {
			curUnit.population += curUnit.food;
		}
			// process population growth
		if (curUnit.food >= 0) {
			curUnit.population += curUnit.population * Unit.growthRate;
		}
		// process population death. Note: population death happens regardless of food situation
		curUnit.population -= curUnit.population * Unit.mortalityRate;

		// we are using food as a counter to measure starvation
		// however, it needs to be reset at the end of the turn
		if (curUnit.food < 0) {
		curUnit.food = 0;			
		}
	}

	Unit.LoadInfo(Unit.selectedUnit);
}
