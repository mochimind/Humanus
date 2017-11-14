var ActionPanel = {};

ActionPanel.LoadUnit = function(unit) {
	$("#actionPanel").empty();
	var possibleActions = unit.getPossibleActions();
	for (var i=0 ; i<possibleActions.length ; i++) {
		var newBut = $("<button>" + possibleActions[i] + "</button>");

		// set the onclick action - we need to pass the right args to it
		newBut.on("click", {"unit": unit, "action": possibleActions[i]}, ActionPanel.LoadDetails);

		$("#actionPanel").append(newBut);
	}
}

ActionPanel.UnloadDetails = function() {
	$("#actionDetails").empty();
	$("#currentActions").show();	
}

ActionPanel.LoadDetails = function(e) {
	var unit = e.data.unit;
	var action = e.data.action;

	ActionPanel.UnloadDetails();
	$("#currentActions").hide();

	var executeBut = $("<button>Do it</button>");
	var cancelBut = $("<button>Cancel</button>");
	cancelBut.on("click", ActionPanel.UnloadDetails);
	var tile = unit.getTile();
	if (action == ActionConst.GatherAction) {
		GatherConst.ExpandDetails($("#actionDetails"), executeBut, cancelBut);
	} else if (action == ActionConst.HuntAction) {
		HuntConst.ExpandDetails($("#actionDetails"), executeBut, cancelBut);
	} else if (action == ActionConst.CookAction) {
		CookConst.ExpandDetails($("#actionDetails"), executeBut, cancelBut);
	} else if (action == ActionConst.EncampAction) {

	} else if (action == ActionConst.MoveAction) {
		MoveConst.ExpandDetails($("#actionDetails"), executeBut, cancelBut);
	}
}

ActionPanel.HandleCancel = function() {
	ActionPanel.UnloadDetails();
}

ActionPanel.HandleSubmit = function() {
	ActionPanel.UpdateCurrentActions(UnitConst.selectedUnit);
	ActionPanel.UnloadDetails();
}

ActionPanel.UpdateCurrentActions = function(unit) {
	$("#currentActions").empty();
	$("#currentActions").append("<div id='currentActionsHeader'>Current Actions</div>");
	var actions = ActionConst.GetActions(unit);
	for (var i=0 ; i<actions.length ; i++) {
		if (actions[i].type != ActionConst.MoveAction) {
			if (actions[i].args != 0) {
				$("#currentActions").append("<div>" + actions[i].type + ": " + actions[i].args + "</div>");				
			}
		} else {
			$("#currentActions").append("<div>" + actions[i].type + ": " + actions[i].args.length + " tiles</div>");
		}
	}
}

