var Turn = {};

Turn.Init = function() {
	$("#endTurn").click(Turn.EndTurn);
}

Turn.EndTurn = function() {
	$("#turnSummary").empty();
	ActionPanel.UnloadDetails();

	UnitConst.ProcessTurn();
	ActionPanel.UpdateCurrentActions(UnitConst.selectedUnit);
	UpgradeConst.ProcessTurn();
	Turn.PopulateSummary(UnitConst.selectedUnit);

	UnitPanel.UpdatePopulation(UnitConst.selectedUnit.population);
	UnitPanel.UpdateResources(UnitConst.selectedUnit.resources);

	UnitConst.NewTurn();
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
