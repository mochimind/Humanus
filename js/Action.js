var Action = {};

Action.GatherAction = "Gather";
Action.HuntAction = "Hunt";
Action.CookAction = "Cook";
Action.EncampAction = "Encamp";

Action.actions = [];

Action.RegisterAction = function(unit, action, workers) {
	for (var i=0 ; i<Action.actions.length ; i++) {
		var iter = Action.actions[i]
		if (iter.unit == unit && unit.action == action) {
			iter.workers = workers;
			return;
		}
	}

	Action.actions.push({
		'unit': unit,
		'action': action,
		'workers': workers 
	});
}

Action.GetRegisteredActions = function(unit) {
	var outArr = [];
	for (var i=0 ; i<Action.actions.length ; i++) {
		var iter = Action.actions[i];
		if (iter.unit == unit) {
			outArr.push(iter);
		}
	}

	return outArr;
}
