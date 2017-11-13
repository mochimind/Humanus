var Action = {};

Action.GatherAction = "Gather";
Action.HuntAction = "Hunt";
Action.CookAction = "Cook";
Action.EncampAction = "Encamp";
Action.MoveAction = "Move";

Action.HuntThreshold = 0.9;
Action.BigGameThreshold = 0.85;
Action.MediumGameThreshold = 0.5;

Action.actions = [];


// move actions are quite different from production actions - they also cancel all other actions
// destination is a coord in the format [x,y]
Action.RegisterMoveAction = function (unit, destination) {
	// clear all other actions for this unit
	Action.ClearActions(unit);

	// create a path to move to the destination coordinate from the unit's current coordinate
	// for each stop on the path, create an icon and add the tile to the args list
	var curCoords = [unit.x, unit.y];
	var traverseList = [];
	while (curCoords[0] != destination[0] || curCoords[1] != destination[1]) {
		// try to move 1 tile closer to the destination on both the x and y coordinate
		if (curCoords[0] > destination[0]) {
			curCoords[0]--;
		}
		if (curCoords[0] < destination[0]) {
			curCoords[0]++;
		}
		if (curCoords[1] > destination[1]) {
			curCoords[1]--;
		}
		if (curCoords[1] < destination[1]) {
			curCoords[1]++;
		}

		// now, try to add a footprint to the tile on the path
		var tile = Map.tileInfos[curCoords[0]][curCoords[1]];
		Tile.AddMoveIcon(tile);
		traverseList.push([curCoords[0], curCoords[1]]);
	}

	Action.actions.push({
		'unit': unit,
		'action': Action.MoveAction,
		'args': traverseList
	});

}

Action.ClearMoveAction = function(action) {
	// remove all the footprints
	for (var i=0 ; i<action.args.length ; i++) {
		var coord = action.args[i];
		Tile.RemoveMoveIcon(Map.tileInfos[coord[0]][coord[1]]);
	}
}

Action.RemoveMoveAction = function(unit) {
	for (var i=0 ; i<Action.actions.length ; i++) {
		var act = Action.actions[i];
		if (act.unit == unit && act.action == Action.MoveAction) {
			Action.ClearMoveAction(act);
			Action.actions.splice(i,1);
			// there should only be one so we can optimize away the rest of this loop
			return;
		}
	}
}

Action.RegisterAction = function(unit, action, workers) {
	for (var i=0 ; i<Action.actions.length ; i++) {
		var iter = Action.actions[i]
		if (iter.unit == unit && iter.action == action) {
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
	var summary = a.unit.turnSummary;
	if (a.action == Action.GatherAction) {
		harvest = a.workers/10;
		a.unit.food += harvest;
		a.unit.wood += harvest;
		summary.harvested.wood += harvest;
		summary.harvested.food += harvest;
	} else if (a.action == Action.HuntAction) {
		animalAmount = Tile.GetAvailableAnimals(tile);
		if (animalAmount <= 0) {
			return;
		}
		for (var j=0 ; j<a.workers ; j++) {
			score = Math.random();
			if (score > Action.HuntThreshold) {
				animalAmount--;
				animalTypeScore = Math.random();
				if (animalTypeScore >= Action.BigGameThreshold) {
					a.unit.food += 10;
					a.unit.hides += 10;
					summary.harvested.food += 10;
					summary.harvested.hides += 10;
					Tile.UpdateAnimals(tile, -100);
				} else if (animalTypeScore >= Action.MediumGameThreshold) {
					a.unit.food += 3;
					a.unit.hides += 3;
					summary.harvested.food += 3;
					summary.harvested.hides += 3;
					Tile.UpdateAnimals(tile, -50);
				} else {
					a.unit.food += 1;
					a.unit.hides += 1;
					summary.harvested.food += 1;
					summary.harvested.hides += 1;
				}
				if (animalAmount <= 0) {
					return;
				}
			}
		}
	} else if (a.action == Action.CookAction) {
		harvest = a.workers / 2
		a.unit.meals += harvest * 15;
		a.unit.food -= harvest;
		a.unit.wood -= harvest;
		summary.harvested.meals += harvest*15;
		summary.consumed.food += harvest;
		summary.consumed.wood += harvest;

		// next turn we may not be able to have the same number of cooks due to resource constraints
		// assign the max possible
		a.workers = Math.min(a.workers, Math.floor(a.unit.food*2), Math.floor(a.unit.wood*2));
	} else if (a.action == Action.MoveAction) {
		var dest = a.args.shift();
		summary.moved = true;

		Tile.RemoveMoveIcon(Map.tileInfos[dest[0]][dest[1]]);
		Map.NavigateTo(dest[0], dest[1]);

		if (a.args.length == 0) {
			Action.RemoveMoveAction(a.unit);
			return;
		}
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
		} else {
			// all non-movement actions don't need special treatment - they just won't be run
			// for movements, we need to clear footprints
			if (poppy.action == Action.MoveAction) {
				Action.ClearMoveAction(poppy);
			}	
		}
	}

	Action.actions = newArr;
	Unit.ClearAllocatedPop(unit);
}
