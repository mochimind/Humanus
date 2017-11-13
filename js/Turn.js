var Turn = {};

Turn.Init = function() {
	$("#endTurn").click(Turn.EndTurn);
}

Turn.EndTurn = function() {
	$("#turnSummary").empty();
	ActionPanel.UnloadDetails();
	Unit.ClearTurnSummaries();
	for (var i=0 ; i<Action.actions.length ; i++) {
		var pAct = Action.actions[i];
		Action.ResolveAction(pAct);
	}
	Unit.ProcessTurn();
	ActionPanel.UpdateCurrentActions(Unit.selectedUnit);
	Turn.PopulateSummary(Unit.selectedUnit);
}

Turn.PopulateSummary = function(unit) {
	var summary = unit.turnSummary;
	harvestStr = "harvested: ";
	isFirst = true;
	for (var tok in Unit.resources) {
		var resource = Unit.resources[tok];
		if (Math.round(summary.harvested[resource]) != 0) {
			if (isFirst) {
				isFirst = false;
			} else {
				harvestStr += ", ";
			}
			harvestStr += Math.round(summary.harvested[resource]) + " " + resource;
		}
	}
	if (!isFirst) {
		// this means there were actually entries
		Turn.AddSummary(harvestStr);		
	}

	isFirst = true;
	consumedStr = "consumed: ";
	for (var tok in Unit.resources) {
		var resource = Unit.resources[tok];
		if (Math.round(summary.consumed[resource]) != 0) {
			if (isFirst) {
				isFirst = false;
			} else {
				consumedStr += ", ";
			}
			consumedStr += Math.round(summary.consumed[resource]) + " " + resource;
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
