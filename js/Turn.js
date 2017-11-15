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

	UnitPanel.UpdatePopulation(Math.floor(UnitConst.selectedUnit.population.getTotalPop()));
	UnitPanel.UpdateResources(UnitConst.selectedUnit.resources);
}

Turn.PopulateSummary = function(unit) {
	var summary = unit.getTurnSummary();
	for (var i=0 ; i<summary.length ; i++) {
		Turn.AddSummary(summary[i]);
	}
}

Turn.AddSummary = function(summary) {
	$("#turnSummary").append("<li>" + summary + "</li>");
}
