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
	if (action == Action.GatherAction) {
		var tile = Unit.GetTile(unit);

		// prepopulate the number of gatherers
		var gatherers = Unit.GetAllocatedPop(unit, Action.GatherAction);

		$("#actionDetails").append("<div>Gathering yields a small amount of food and wood (1 of each per 10 people working)</div>");
		$("#actionDetails").append("<div>" + "Given the land fertility here, " + Tile.GetMaxGatherers(tile) + " of people can gather here</div>");
		$("#actionDetails").append("<div>" + "You have " + gatherers + " people gathering</div>");
		$("#actionDetails").append("<div>" + "You have " + Unit.GetAvailablePop(unit) + " people free</div>");
		$("#actionDetails").append("<div>" + "How many would you like to gather here?</div>");

		$("#actionDetails").append("<textarea id='gatherInput' rows='1' cols='10'>" + gatherers + "</textarea>");
		$("#actionDetails").append("<br>");		
		(function(_unit) {
			executeBut.click(function() {
				ActionPanel.HandleGather(_unit);
			})
		})(unit);
	} else if (action == Action.HuntAction) {

	} else if (action == Action.CookAction) {

	} else if (action == ACtion.EncampAction) {

	}
	$("#actionDetails").append(executeBut);

}

ActionPanel.HandleGather = function(unit) {
	var workers = $("#gatherInput").val();
	// make sure they didn't input anything funky
	console.log(workers);
	if (isNaN(workers)) {
		alert("please input a valid number");
		return;
	}

	// make sure we get rid of decimals
	workers = Math.floor(workers);

	if (workers > Unit.GetAvailablePop(unit)) {
		alert ("not enough population to allocate!");
		return;
	}

	if (workers > Tile.GetMaxGatherers(Unit.GetTile(unit))) {
		alert("can't have that many gatherers!");
		return;
	}

	Unit.AllocatePop(unit, workers, Action.GatherAction);
	Action.RegisterAction(unit, Action.GatherAction, workers);
	$("#actionDetails").empty();
}

