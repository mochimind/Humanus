
function PrimitivePop(count, population) {
	Demographic.call(this, count, population);
}

PrimitivePop.prototype = Object.create(Demographic.prototype);
PrimitivePop.prototype.constructor = PrimitivePop;

// tries to consume required resources from the resource bundle
// returns the number to downgrade in the event that resources could not be consumed
PrimitivePop.prototype.consumeResources = function(resource) {
	hungryPeople = this.population.getTotalPop();

	// try to feed them with meals first
	hungryPeople -= resource.consume(ResourceConst.mealsType, hungryPeople);
	if (hungryPeople > 0) {
		// try to feed them with food
		hungryPeople -= resource.consume(ResourceConst.foodType, hungryPeople / 10) * 10;
	}

	// there wasn't enough food to feed everyone, they need to be downgraded
	if (hungryPeople > 0) {
		return hungryPeople;
	}
	return 0;
}

PrimitivePop.prototype.getDowngradeType = function() {
	return null;
}

PrimitivePop.prototype.getTechLevel = function() {
	return 1;
}

PrimitivePop.prototype.getType = function() {
	return DemographicConst.PrimitiveType;
}

PrimitivePop.prototype.getActions = function() {
	return [ActionConst.GatherAction, ActionConst.HuntAction, ActionConst.CookAction, ActionConst.CraftAction];
}

PrimitivePop.prototype.canCraft = function() {
	return[ItemList.BasicTool.id];
}

