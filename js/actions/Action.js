var ActionConst = {};

ActionConst.GatherAction = "Gather";
ActionConst.HuntAction = "Hunt";
ActionConst.CookAction = "Cook";
ActionConst.EncampAction = "Encamp";
ActionConst.MoveAction = "Move";
ActionConst.CraftAction = "Craft";

function Action(_unit, _args) {
	this.unit = _unit;
	this.args = _args;
	if (_unit.actions == null) {
		_unit.actions = [];
	}

	this.addOrReplaceAction();
}

Action.prototype.addOrReplaceAction = function() {
	for (var i=0 ; i<this.unit.actions.length ; i++) {
		var iter = this.unit.actions[i];
		if (iter.type == this.getType()) {
			iter.args = this.args;
			return;
		}
	}
	this.unit.actions.push(this);
}

// this is inefficient - we are again looping through the list of actions
// however, programmatically this is cleaner
Action.prototype.removeAction = function() {
	for (var i=0 ; i<this.unit.actions.length ; i++) {
		if (this.unit.actions[i] == this) {
			this.unit.actions.splice(i,1);
		}
	}
}

// note: this function doesn't check if the action is valid, it just resolves its effects
// it's assumed that before the action was added someone has done the checking to make sure it's valid
// this function is overriden by specific actions that inherit from Action
Action.prototype.resolveAction = function(){
	console.log("error: resolve action isn't implemented for type: " + this.getType());
}

Action.prototype.getType = function(){
	console.log("error: action does not have valid type");
}

Action.prototype.expandDetails = function(parent) {
	this.parent = parent;
}

Action.prototype.newTurn = function() {
	
}

ActionConst.CreateAction = function(_type, _unit, _args) {
	if (_type == ActionConst.GatherAction) {
		return new GatherAction(_unit, _args);
	} else if (_type == ActionConst.HuntAction) {
		return new HuntAction(_unit, _args);
	} else if (_type == ActionConst.CookAction) {
		return new CookAction(_unit, _args);
	} else if (_type == ActionConst.EncampAction) {
		return new EncampAction(_unit, _args);
	} else if (_type == ActionConst.MoveAction) {
		return new MoveAction(_unit, _args);
	} else if (_type == ActionConst.CraftAction) {
		return new CraftAction(_unit, _args);
	} else {
		return new Action(_type, _unit, _args);
	}
}

ActionConst.GetActions = function(unit) {
	return unit.actions;
}

// removes all actions for a specific unit
ActionConst.ClearActions = function(unit) {
	// TODO: splice may be more efficient here
	var newArr = []
	while (unit.actions.length > 0) {
		var poppy = unit.actions.pop();
		poppy.removeAction();
	}
}

ActionConst.ProcessActions = function(unit) {
	for (var i=0 ; i<unit.actions.length ; i++) {
		var action = unit.actions[i];
		action.resolveAction();
	}
}

ActionConst.MeetsCriteria = function(demographic, action, criteria) {
	if (action == ActionConst.CraftAction) {
		return CraftConst.MeetsCriteria(demographic, criteria);
	}
}
