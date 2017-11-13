var Turn = {};

Turn.Init = function() {
	$("#endTurn").click(Turn.EndTurn);
}

Turn.EndTurn = function() {
	$("#turnSummary").empty();
	ActionPanel.ClearDetails();
	for (var i=0 ; i<Action.actions.length ; i++) {
		var pAct = Action.actions[i];
		Action.ResolveAction(pAct);
	}
	Unit.ProcessTurn();
	ActionPanel.UpdateCurrentActions(Unit.selectedUnit);
}

Turn.AddSummary = function(summary) {
	$("#turnSummary").append("<li>" + summary + "</li>");
}
