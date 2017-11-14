var MoveConst = {};

// move actions are quite different from production actions - they also cancel all other actions
// destination is a coord in the format [x,y]
function MoveAction(_unit, _args) {
	// clear all other actions for this unit - move requires everyone in the tribe
	ActionConst.ClearActions(_unit);

	Action.call(this, ActionConst.MoveAction, _unit, _args);

	// create a path to move to the destination coordinate from the unit's current coordinate
	// for each stop on the path, create an icon and add the tile to the args list
	var curCoords = [this.unit.x, this.unit.y];
	var destination = this.args;
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
		tile.addMoveIcon(tile);
		traverseList.push([curCoords[0], curCoords[1]]);
	}
	this.args = traverseList;
}

MoveAction.prototype = Object.create(Action.prototype);
MoveAction.prototype.constructor = MoveAction;

MoveAction.prototype.removeAction = function() {
	console.log("removing action");
	// remove all the footprints
	for (var i=0 ; i<this.args.length ; i++) {
		var coord = this.args[i];
		Map.tileInfos[coord[0]][coord[1]].removeMoveIcon();
	}

	Action.prototype.removeAction.call(this);
}

MoveAction.prototype.resolveAction = function() {
	var dest = this.args.shift();
	this.unit.moved = true;

	Map.tileInfos[dest[0]][dest[1]].removeMoveIcon();
	Map.NavigateTo(dest[0], dest[1]);

	if (this.args.length == 0) {
		this.removeAction();
		return;
	}
}


MoveConst.ExpandDetails = function(parent, executeBut, cancelBut) {
	var unit = UnitConst.selectedUnit;
	parent.append("<p>Click on the tile you want to move to. Note: it will take 1 turn to move each tile and all your people will not be able " + 
		"to do anything else</p>");
	parent.append(cancelBut);
	cancelBut.on("click", MoveConst.HandleCancelClick);
	Map.EnableMoveMouseOver(unit.getIconFName(), MoveConst.HandleMoveClick);
}

MoveConst.HandleCancelClick = function() {
	Map.DisableMoveMouseOver();
}

// TODO: handleMove doesn't accept arg unit like other actionpanel handlers - make things consistent please
MoveConst.HandleMoveClick = function(tile) {
	var tCoords = Map.GetTileCoords(tile);
	var unit = UnitConst.selectedUnit;
	if (tCoords[0] == unit.x && tCoords == unit.y) {
		// user clicked on their current location, but let's continue to allow them to navigate
		alert("you're already there!");
		Map.EnableMoveMouseOver(unit.getIconFName(), ActionPanel.HandleMove);
		return;
	}

	new MoveAction(unit, tCoords);
	ActionPanel.UnloadDetails();
	ActionPanel.UpdateCurrentActions(unit);
}

MoveConst.RemoveMoveAction = function(unit) {
	for (var i=0 ; i<unit.actions.length ; i++) {
		if (unit.actions[i].type == ActionConst.MoveAction) {
			unit.actions[i].removeAction();
		}
	}
}
