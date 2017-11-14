
function MobileUnit(resources) {
	Unit.call(this, resources);

	this.possibleActions = [ActionConst.MoveAction, ActionConst.EncampAction];
}

MobileUnit.prototype = Object.create(Unit.prototype);
MobileUnit.prototype.constructor = MobileUnit;

MobileUnit.prototype.getIconFName = function() {
	return "img/person.png";
}

MobileUnit.prototype.getType = function() {
	return UnitConst.mobileType;
}