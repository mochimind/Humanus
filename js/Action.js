var Action = {};

Action.GatherAction = "Gather";
Action.HuntAction = "Hunt";
Action.CookAction = "Cook";
Action.EncampAction = "Encamp";

Action.HuntThreshold = 0.1;
Action.BigGameThreshold = 0.85;
Action.MediumGameThreshold = 0.5;

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

// note: this function doesn't check if the action is valid, it just resolves its effects
// it's assumed that before the action was added someone has done the checking to make sure it's valid
Action.ResolveAction = function(a) {
	var tile = Unit.GetTile(a.unit);
	if (a.action == Action.GatherAction) {
		a.unit.food += a.workers / 10;
		a.unit.wood += a.workers / 10;
		Turn.AddSummary(a.workers/10 + " food and wood gathered");
	} else if (a.action == Action.HuntAction) {
		var hasHunted = false;
		var animalAmount = Tile.GetAvailableAnimals(tile);
		if (animalAmount <= 0) {
			Turn.AddSummary("Hunters return home emptyhanded");
			return;
		}
		for (var j=0 ; j<a.workers ; j++) {
			var score = Math.random();
			if (score > Action.HuntThreshold) {
				hasHunted = true;
				animalAmount--;
				var animalTypeScore = Math.random();
				if (animalTypeScore >= Action.BigGameThreshold) {
					a.unit.food += 10;
					a.unit.hides += 10;
					Turn.AddSummary("10 food and hides were brought in by the hunters");
				} else if (animalTypeScore >= Action.MediumGameThreshold) {
					a.unit.food += 3;
					a.unit.hides += 3;
					Turn.AddSummary("3 food and hides were brought in by the hunters");
				} else {
					a.unit.food += 1;
					a.unit.hides += 1;
					Turn.AddSummary("1 food and hide was brought in by the hunters");
				}
				if (animalAmount <= 0) {
					return;
				}
			}
		}
		if (!hasHunted) {
			Turn.AddSummary("Hunters return home emptyhanded");
		}
	} else if (a.action == Action.CookAction) {
		a.unit.meals += a.workers / 2 * 15;
		a.unit.food -= a.workers / 2;
		a.unit.wood -= a.workers / 2;
		Turn.AddSummary(a.unit.meals + " meals were prepared by the cooks");

		// next turn we may not be able to have the same number of cooks due to resource constraints
		// assign the max possible
		a.workers = Math.min(a.workers, Math.floor(a.unit.food*2), Math.floor(a.unit.wood*2));
	}
}

// removes all actions for a specific unit
Action.ClearActions = function(unit) {
	// TODO: splice may be more efficient here
	var newArr = []
	while (Action.actions.length > 0) {
		var poppy = Action.actions.pop();
		if (poppy.unit != unit) {
			newArr.push(poppy);
		}
	}

	Action.actions = newArr;
}
