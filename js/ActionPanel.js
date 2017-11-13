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
	var tile = Unit.GetTile(unit);
	if (action == Action.GatherAction) {

		// prepopulate the number of gatherers
		var gatherers = Unit.GetAllocatedPop(unit, Action.GatherAction);
		var maxGatherers = Tile.GetMaxGatherers(tile);

		// TODO: need to refactor these into separate files - maybe have a hunt file that creates a list of
		// elements which actionpanel then populates?
		$("#actionDetails").append("<p>" + "You have " + gatherers + " people gathering <br>You have " + Unit.GetAvailablePop(unit) + " people free</p>");
		$("#actionDetails").append("<p>" + "How many would you like to gather here?</p>");

		$("#actionDetails").append("<textarea id='gatherInput' rows='1' cols='10' class='workerInput'>" + gatherers + "</textarea>");

		// here we calculate the effective max based on available population, and what the tile can support
		// note, we need to add the current gatherers to the allocatable to get the actual allocatable
		var effectiveMaxGatherers = Math.min(maxGatherers, Unit.GetAvailablePop(unit) + gatherers);
		$("#actionDetails").append("<span> / max: " + effectiveMaxGatherers + " given conditions</span>");
		$("#actionDetails").append(executeBut);
		$("#actionDetails").append(cancelBut);
		$("#actionDetails").append("<p>Gathering yields a small amount of food and wood (1 of each per 10 people working)." + 
			" More people can gainfully work the land if the plant life is plentiful in the area. </p>");
		(function(_unit) {
			executeBut.click(function() {
				ActionPanel.HandleGather(_unit);
			})
		})(unit);
	} else if (action == Action.HuntAction) {
		var hunters = Unit.GetAllocatedPop(unit, Action.HuntAction);
		$("#actionDetails").append("<p>" + "Given the animals here, you can expect to catch on average " + Tile.GetMaxHuntingFood(tile) + " food from this location </p>");
		$("#actionDetails").append("<p>" + "You have " + hunters + " people hunting<br>You have " + Unit.GetAvailablePop(unit) + " people free</p>");
		$("#actionDetails").append("<p>" + "How many would you like to hunt here?</p>");
		$("#actionDetails").append("<textarea id='huntInput' rows='1' cols='10' class='workerInput'>0</textarea>");
		$("#actionDetails").append("<br>");
		$("#actionDetails").append(executeBut);
		$("#actionDetails").append(cancelBut);
		$("#actionDetails").append("<p>Hunting allows you to catch game that gives a lot of food and hides." + 
			"However, your hunters are not guaranteed to land a catch! Each hunter has a 10% chance to net a catch will net you on average 3 food & hides</p>");
		(function(_unit) {
			executeBut.click(function() {
				ActionPanel.HandleHunt(_unit);
			})
		})(unit);
	} else if (action == Action.CookAction) {
		var cooks = Unit.GetAllocatedPop(unit, Action.CookAction);
		$("#actionDetails").append("<p>" + "You have " + cooks + " people cooking<br>You have " + Unit.GetAvailablePop(unit) + " people free</p>");
		$("#actionDetails").append("<p>" + "How many would you like to cook?</p>");
		$("#actionDetails").append("<textarea id='cookInput' rows='1' cols='10' class='workerInput'>0</textarea>");
		$("#actionDetails").append("<span> / max: " + Math.min(Unit.GetMaxCooks(unit), unit.population / 15) + " given conditions</span>");
		$("#actionDetails").append(executeBut);
		$("#actionDetails").append(cancelBut);
		$("#actionDetails").append("<p>Cooking allows you to process food into more nutritious meals. 1 Food is processed into 15 meals, which can feed" + 
			"15 people. This requires 2 population and 1 wood.</p>");
		(function(_unit) {
			executeBut.click(function() {
				ActionPanel.HandleCook(_unit);
			})
		})(unit);
	} else if (action == Action.EncampAction) {

	} else if (action == Action.MoveAction) {
		$("#actionDetails").append("<p>Click on the tile you want to move to. Note: it will take 1 turn to move each tile and all your people will not be able " + 
			"to do anything else</p>");
		$("#actionDetails").append(executeBut);
		executeBut.text("Cancel");
		executeBut.on("click", ActionPanel.HandleMoveCancel);
		Map.EnableMoveMouseOver(Unit.GetIconFName(unit), ActionPanel.HandleMove);
	}
}

ActionPanel.HandleGather = function(unit) {
	var workers = $("#gatherInput").val();
	if (!ActionPanel.ValidateWorkers(workers, unit, Tile.GetMaxGatherers(Unit.GetTile(unit)))) {
		return;
	}

	ActionPanel.CommitWorkers(workers, unit, Action.GatherAction);
	ActionPanel.UnloadDetails();
}

ActionPanel.HandleHunt = function(unit) {
	var workers = $("#huntInput").val();
	if (!ActionPanel.ValidateWorkers(workers, unit)) {
		return;
	}
	ActionPanel.CommitWorkers(workers, unit, Action.HuntAction);
	ActionPanel.UnloadDetails();
}

ActionPanel.HandleCook = function(unit) {
	var workers = $("#cookInput").val();
	if (!ActionPanel.ValidateWorkers(workers, unit)) {
		return;
	}
	ActionPanel.CommitWorkers(workers, unit, Action.CookAction);
	ActionPanel.UnloadDetails();
}

// TODO: handleMove doesn't accept arg unit like other actionpanel handlers - make things consistent please
ActionPanel.HandleMove = function(tile) {
	var tCoords = Map.GetTileCoords(tile);
	var unit = Unit.selectedUnit;
	if (tCoords[0] == unit.x && tCoords == unit.y) {
		// user clicked on their current location, but let's continue to allow them to navigate
		alert("you're already there!");
		Map.EnableMoveMouseOver(Unit.GetIconFName(unit), ActionPanel.HandleMove);
		return;
	}

	Action.RegisterMoveAction(unit, tCoords);
	ActionPanel.UnloadDetails();
	ActionPanel.UpdateCurrentActions(unit);
}

ActionPanel.HandleMoveCancel = function() {
	Map.DisableMoveMouseOver();
	ActionPanel.UnloadDetails();
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
	// first make sure there are no movements going on - we can't have workers and movement
	Action.RemoveMoveAction(unit);

	// make sure we get rid of decimals
	var workers = Math.floor(_workers);

	Unit.AllocatePop(unit, workers, action);
	Action.RegisterAction(unit, action, workers);
	$("#actionDetails").empty();

	ActionPanel.UpdateCurrentActions(unit);

}

ActionPanel.UpdateCurrentActions = function(unit) {
	$("#currentActions").empty();
	$("#currentActions").append("<div id='currentActionsHeader'>Current Actions</div>");
	var actions = Action.GetRegisteredActions(unit);
	for (var i=0 ; i<actions.length ; i++) {
		if (actions[i].action != Action.MoveAction) {
			$("#currentActions").append("<div>" + actions[i].action + ": " + actions[i].workers + "</div>");
		} else {
			$("#currentActions").append("<div>" + actions[i].action + ": " + actions[i].args.length + " tiles</div>");
		}
	}
}

