var ResourceConst = {};

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
		this.resources[type] = new Resource(type, amount);
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

// tries to claim a certain amount of an item. Returns the actual amount claimed
ResourceBundle.prototype.claim = function(item, amount, action, category) {
	for (var tok in this.resources) {
		if (this.resources[tok].id == item) {
			return this.resources[tok].claim(amount, action, category);
		}
	}
	return 0;
}

ResourceBundle.prototype.claimable = function(item, amount, action, category) {
	for (var tok in this.resources) {
		if (this.resources[tok].id == item) {
			return this.resources[tok].claimable(amount, action, category);
		}
	}
	return 0;
}

ResourceBundle.prototype.loadInfo = function(){

}

ResourceBundle.prototype.processTurn = function() {
	// should implement spoilage here
}

ResourceBundle.prototype.newTurn = function() {
	for (const tok in this.resources) {
		this.resources[tok].newTurn();
	}
}

ResourceBundle.prototype.getMaxAvailable = function(item, action, category) {
	if (this.resources[item] != null) {
		return this.resources[item].getMaxAvailable(action, category);
	} else {
		return 0;
	}
}

