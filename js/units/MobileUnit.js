
function MobileUnit(resources) {
	Unit.call(this, resources);
}

MobileUnit.prototype = Object.create(Unit.prototype);
MobileUnit.prototype.constructor = MobileUnit;

MobileUnit.prototype.getIconFName = function() {
	return "img/person.png";
}

MobileUnit.prototype.getType = function() {
	return UnitConst.mobileType;
}

MobileUnit.prototype.possibleActions = function() {
	return [ActionConst.MoveAction];
}

