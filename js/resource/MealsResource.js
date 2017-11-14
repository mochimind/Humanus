
function MealsResource(amount) {
	Resource.call(this, amount);
}

MealsResource.prototype = Object.create(Resource.prototype);
MealsResource.prototype.constructor = MealsResource;

MealsResource.prototype.processTurn = function() {
	// meals spoil at the end of every turn
	this.wastedThisTurn += this.amount;
	this.amount = 0;
}

MealsResource.prototype.getType = function() {
	return ResourceConst.mealsType;
}
