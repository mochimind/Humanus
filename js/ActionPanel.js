var ActionPanel = {};

ActionPanel.LoadUnit = function(unit) {
	$("#actionPanel").empty();
	for (var i=0 ; i<unit.actions.length ; i++) {
		var newBut = $("<button>" + unit.actions[i] + "</button>");
		$("#actionPanel").append(newBut);
	}
}
