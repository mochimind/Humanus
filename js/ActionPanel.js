var ActionPanel = {};

ActionPanel.LoadUnit = function(unit) {
	$("#actionPanel").empty();
	for (var i=0 ; i<unit.actions.length ; i++) {
		var newBut = $("<button>" + unit.actions[i] + "</button>");

		// set the onclick action - we need to pass the right args to it
		newBut.on("click", {"unit": unit, "action": unit.actions[i]}, ActionPanel.LoadDetails);

		$("#actionPanel").append(newBut);
	}
}

ActionPanel.ClearDetails = function() {
	$("#actionDetails").empty();	
}

ActionPanel.LoadDetails = function(e) {
	var unit = e.data.unit;
	var action = e.data.action;

	ActionPanel.ClearDetails();
	var executeBut = $("<button>Do it</button>");
	var tile = Unit.GetTile(unit);
	if (action == Action.GatherAction) {

		// prepopulate the number of gatherers
		var gatherers = Unit.GetAllocatedPop(unit, Action.GatherAction);
		var maxGatherers = Tile.GetMaxGatherers(tile);

		// TODO: need to refactor these into separate files - maybe have a hunt file that creates a list of
		// elements which actionpanel then populates?
		$("#actionDetails").append("<p>Gathering yields a small amount of food and wood (1 of each per 10 people working)</p>");
		$("#actionDetails").append("<p>" + "Given the land fertility here, " + maxGatherers + " of people can gather here</p>");
		$("#actionDetails").append("<p>" + "You have " + gatherers + " people gathering</p>");
		$("#actionDetails").append("<p>" + "You have " + Unit.GetAvailablePop(unit) + " people free</p>");
		$("#actionDetails").append("<p>" + "How many would you like to gather here?</p>");

		$("#actionDetails").append("<textarea id='gatherInput' rows='1' cols='10'>" + gatherers + "</textarea>");

		// here we calculate the effective max based on available population, and what the tile can support
		// note, we need to add the current gatherers to the allocatable to get the actual allocatable
		var effectiveMaxGatherers = Math.min(maxGatherers, Unit.GetAvailablePop(unit) + gatherers);
		$("#actionDetails").append("<span> / " + effectiveMaxGatherers + "</span>");
		(function(_unit) {
			executeBut.click(function() {
				ActionPanel.HandleGather(_unit);
			})
		})(unit);
	} else if (action == Action.HuntAction) {
		var hunters = Unit.GetAllocatedPop(unit, Action.HuntAction);
		$("#actionDetails").append("<p>Hunting allows you to catch game that gives a lot of food and hides." + 
			"However, your hunters are not guaranteed to land a catch! Each hunter has a 10% chance to net a catch will net you on average 3 food & hides</p>");
		$("#actionDetails").append("<br>");
		$("#actionDetails").append("<p>" + "Given the animals here, you can expect to catch on average " + Tile.GetMaxHuntingFood(tile) + " food from this location </p>");
		$("#actionDetails").append("<p>" + "You have " + hunters + " people hunting</p>");
		$("#actionDetails").append("<p>" + "You have " + Unit.GetAvailablePop(unit) + " people free</p>");
		$("#actionDetails").append("<p>" + "How many would you like to hunt here?</p>");
		$("#actionDetails").append("<textarea id='huntInput' rows='1' cols='10'>0</textarea>");
		(function(_unit) {
			executeBut.click(function() {
				ActionPanel.HandleHunt(_unit);
			})
		})(unit);
	} else if (action == Action.CookAction) {
		var cooks = Unit.GetAllocatedPop(unit, Action.CookAction);
		$("#actionDetails").append("<p>Cooking allows you to process food into more nutritious meals. 1 Food is processed into 15 meals, which can feed" + 
			"15 people. This requires 2 population and 1 wood.</p>");
		$("#actionDetails").append("<br>");
		$("#actionDetails").append("<p>" + "Given the stockpiles that you have, you can commit " + Unit.GetMaxCooks(unit) + " to cooking </p>");
		$("#actionDetails").append("<p>" + "You have " + cooks + " people cooking</p>");
		$("#actionDetails").append("<p>" + "You have " + Unit.GetAvailablePop(unit) + " people free</p>");
		$("#actionDetails").append("<p>" + "How many would you like to cook?</p>");
		$("#actionDetails").append("<textarea id='cookInput' rows='1' cols='10'>0</textarea>");
		$("#actionDetails").append("<span> / " + Math.min(Unit.GetMaxCooks(unit), unit.population / 15) + "</span>");
		(function(_unit) {
			executeBut.click(function() {
				ActionPanel.HandleCook(_unit);
			})
		})(unit);
	} else if (action == Action.EncampAction) {

	} else if (action == Action.MoveAction) {
		$("#actionDetails").append("<p>Click on the tile you want to move to. Note: it will take 1 turn to move each tile and all your people will not be able " + 
			"to do anything else</p>");
		executeBut.text("Cancel");
		executeBut.on("click", ActionPanel.HandleMoveCancel);
		Map.EnableMoveMouseOver(Unit.GetIconFName(unit), ActionPanel.HandleMove);
	}
	$("#actionDetails").append("<br>");		
	$("#actionDetails").append(executeBut);

}

ActionPanel.HandleGather = function(unit) {
	var workers = $("#gatherInput").val();
	if (!ActionPanel.ValidateWorkers(workers, unit, Tile.GetMaxGatherers(Unit.GetTile(unit)))) {
		return;
	}

	ActionPanel.CommitWorkers(workers, unit, Action.GatherAction);
}

ActionPanel.HandleHunt = function(unit) {
	var workers = $("#huntInput").val();
	if (!ActionPanel.ValidateWorkers(workers, unit)) {
		return;
	}
	ActionPanel.CommitWorkers(workers, unit, Action.HuntAction);

}

ActionPanel.HandleCook = function(unit) {
	var workers = $("#cookInput").val();
	if (!ActionPanel.ValidateWorkers(workers, unit)) {
		return;
	}
	ActionPanel.CommitWorkers(workers, unit, Action.CookAction);

}

ActionPanel.HandleMove = function(tile) {
	alert("moving!!!");
}

ActionPanel.HandleMoveCancel = function() {
	Map.DisableMoveMouseOver();
	ActionPanel.ClearDetails();
}

// make sure they didn't input anything funky
ActionPanel.ValidateWorkers = function(workers, unit, maxWorkers) {
	console.log("validating: " + workers + "," + unit + "," + maxWorkers);
	if (isNaN(workers)) {
		alert("please input a valid number");
		return false;
	}

	if (workers < 0) {
		alert ("please input a positive number");
		return false;
	}

	if (workers > Unit.GetAvailablePop(unit)) {
		alert ("not enough population to allocate!");
		return false;
	}

	if (maxWorkers != null && workers > maxWorkers) {
		alert("can't have that many workers here!");
		return false;
	}

	return true;
}

// this does all the administrative work of registering an action
ActionPanel.CommitWorkers = function(_workers, unit, action) {
	// make sure we get rid of decimals
	var workers = Math.floor(_workers);

	Unit.AllocatePop(unit, workers, action);
	Action.RegisterAction(unit, action, workers);
	$("#actionDetails").empty();

	ActionPanel.UpdateCurrentActions(unit);

}

ActionPanel.UpdateCurrentActions = function(unit) {
	$("#currentActions").empty();
	var actions = Action.GetRegisteredActions(unit);
	for (var i=0 ; i<actions.length ; i++) {
		$("#currentActions").append("<div>" + actions[i].action + ": " + actions[i].workers);
	}
}

