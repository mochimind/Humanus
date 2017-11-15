var ResourceConst = {};

ResourceConst.mealsType = "Meal";
ResourceConst.foodType = "Food";
ResourceConst.woodType = "Wood";
ResourceConst.hidesType = "Hides";

function ResourceBundle() {
	this.resources = {};
	this.summary = [];
}

ResourceBundle.prototype.getAvailable = function(type) {
	if (this.resources[type] != null) {
		return this.resources[type].amount;
	} else {
		return 0;
	}
}

// checks the stores to determine how much of a resource is available
// returns amount if all is available, or some number between 0 and amount if only a portion is available
ResourceBundle.prototype.isAvailable = function(type, amount) {
	if (this.resources[type] != null) {
		return Math.min(amount, this.resources[type].amount);
	} else {
		return 0;
	}
}

ResourceBundle.prototype.consume = function(type, amount) {
	if (this.resources[type] != null) {
		return this.resources[type].consume(amount);
	} else {
		return 0;
	}
}

// TODO: need to implement storage capacity - if a resource weighs too much, it should be discarded
// after all consumption is met
ResourceBundle.prototype.produce = function(type, amount) {
	if (this.resources[type] != null) {
		this.resources[type].produce(amount);
	} else {
		this.resources[type] = ResourceConst.CreateResource(type, amount);
	}
}

// returns the produced, consumed, and wasted resources
ResourceBundle.prototype.getTurnSummary = function() {
	var consumedStr = "Consumed: ";
	var producedStr = "Produced: ";
	var wasteStr = "";
	var outArr = [];

	firstConsumed = true;
	firstProduced = true;
	firstWasted = true;
	for (const tok in this.resources) {
		tmpConsumed = this.resources[tok].getConsumedReport();
		tmpProduced = this.resources[tok].getProducedReport();
		tmpWasted = this.resources[tok].getWastedReport();

		if (tmpConsumed != null) {
			if (firstConsumed) {
				firstConsumed = false;
			} else {
				consumedStr += ", "
			}
			consumedStr += tmpConsumed;
		}

		if (tmpProduced != null) {
			if (firstProduced) {
				firstProduced = false;
			} else {
				producedStr += ", ";
			}
			producedStr += tmpProduced;
		}
		if (tmpWasted != null) {
			if (firstWasted) {
				firstWasted = false;
			} else {
				wasteStr += ", ";
			}
			wasteStr += tmpWasted;
		}
	}
	if (!firstProduced) {
		outArr.push(producedStr);
	}
	if (!firstConsumed) {
		outArr.push(consumedStr);
	}
	if (!firstWasted) {
		wasteStr += " went to waste";
		outArr.push(wasteStr);
	}

	return outArr;
}

ResourceBundle.prototype.loadInfo = function(){
	for (const tok in this.resources) {
		this.resources[tok].loadInfo();
	}
}

ResourceBundle.prototype.processTurn = function() {
	for (const tok in this.resource) {
		this.resources[tok].processTurn();
	}
}

ResourceBundle.prototype.newTurn = function() {
	for (const tok in this.resources) {
		this.resources[tok].newTurn();
	}
}

ResourceConst.CreateResource = function(type, amount) {
	if (type == ResourceConst.mealsType) {
		return new MealsResource(amount);
	} else if (type == ResourceConst.foodType) {
		return new FoodResource(amount);
	} else if (type == ResourceConst.woodType) {
		return new WoodResource(amount);
	} else if (type == ResourceConst.hidesType) {
		return new HidesResource(amount);
	}

	console.log("error: undefined resource type: " + type);
	return null;
}

ResourceConst.GetIcon = function(type) {
 if (type == ResourceConst.foodType) {
		return "img/food.png";
	} else if (type == ResourceConst.woodType) {
		return "img/wood.png";
	} else if (type == ResourceConst.hidesType) {
		return "img/hides.png";
	}

	return "";
}
