var ActionPanel = {};

ActionPanel.LoadUnit = function(unit) {
	$("#actionPanel").empty();
	for (var i=0 ; i<unit.actions.length ; i++) {
		var newBut = $("<button>" + unit.actions[i] + "</button>");

		// set the onclick action - we need to pass the right args to it
		(function(_unit, _action) {
			newBut.click(function() {
				ActionPanel.LoadDetails(_unit, _action);
			})
		})(unit, unit.actions[i]);

		$("#actionPanel").append(newBut);
	}
}

ActionPanel.LoadDetails = function(unit, action) {
	$("#actionDetails").empty();
	var executeBut = $("<button>Do it</button>");
	var tile = Unit.GetTile(unit);
	if (action == Action.GatherAction) {

		// prepopulate the number of gatherers
		var gatherers = Unit.GetAllocatedPop(unit, Action.GatherAction);
		var maxGatherers = Tile.GetMaxGatherers(tile);

		$("#actionDetails").append("<div>Gathering yields a small amount of food and wood (1 of each per 10 people working)</div>");
		$("#actionDetails").append("<div>" + "Given the land fertility here, " + maxGatherers + " of people can gather here</div>");
		$("#actionDetails").append("<div>" + "You have " + gatherers + " people gathering</div>");
		$("#actionDetails").append("<div>" + "You have " + Unit.GetAvailablePop(unit) + " people free</div>");
		$("#actionDetails").append("<div>" + "How many would you like to gather here?</div>");

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
		$("#actionDetails").append("<div>Hunting allows you to catch game that gives a lot of food and hides." + 
			"However, your hunters are not guaranteed to land a catch! Each hunter has a 10% chance to net a catch will net you on average 3 food & hides</div>");
		$("#actionDetails").append("<br>");
		$("#actionDetails").append("<div>" + "Given the animals here, you can expect to catch on average " + Tile.GetMaxHuntingFood(tile) + " food from this location </div>");
		$("#actionDetails").append("<div>" + "You have " + hunters + " people hunting</div>");
		$("#actionDetails").append("<div>" + "You have " + Unit.GetAvailablePop(unit) + " people free</div>");
		$("#actionDetails").append("<div>" + "How many would you like to hunt here?</div>");
		$("#actionDetails").append("<textarea id='huntInput' rows='1' cols='10'>0</textarea>");
		(function(_unit) {
			executeBut.click(function() {
				ActionPanel.HandleHunt(_unit);
			})
		})(unit);
	} else if (action == Action.CookAction) {

	} else if (action == Action.EncampAction) {

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

