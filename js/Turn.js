var Turn = {};

Turn.Init = function() {
	$("#endTurn").click(Turn.EndTurn);
}

Turn.EndTurn = function() {
	$("#turnSummary").empty();
	ActionPanel.UnloadDetails();
	UnitConst.ClearTurnSummaries();

	UnitConst.ProcessTurn();
	ActionPanel.UpdateCurrentActions(UnitConst.selectedUnit);
	Turn.PopulateSummary(UnitConst.selectedUnit);
}

Turn.PopulateSummary = function(unit) {
	var summary = unit.turnSummary;
	harvestStr = "harvested: ";
	isFirst = true;
	for (var tok in UnitConst.resources) {
		var resource = UnitConst.resources[tok];
		if (summary.harvested[resource] != 0) {
			if (isFirst) {
				isFirst = false;
			} else {
				harvestStr += ", ";
			}
			harvestStr += summary.harvested[resource].toFixed(1) + " " + resource;
		}
	}
	if (!isFirst) {
		// this means there were actually entries
		Turn.AddSummary(harvestStr);		
	}

	isFirst = true;
	consumedStr = "consumed: ";
	for (var tok in UnitConst.resources) {
		var resource = UnitConst.resources[tok];
		if (summary.consumed[resource] != 0) {
			if (isFirst) {
				isFirst = false;
			} else {
				consumedStr += ", ";
			}
			consumedStr += summary.consumed[resource].toFixed(1) + " " + resource;
		}
	}
	if (!isFirst) {
		Turn.AddSummary(consumedStr);
	}

	if (summary.population != 0) {
		Turn.AddSummary("population changed by: " + summary.population);
	}
	if (summary.moved) {
		Turn.AddSummary("moved 1 tile");
	}
}

Turn.AddSummary = function(summary) {
	$("#turnSummary").append("<li>" + summary + "</li>");
}
