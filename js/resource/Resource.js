
function Resource(id, amount) {
	this.amount = amount;
	this.id = id;
	this.producedThisTurn = amount;
	this.consumedThisTurn = 0;
	this.wastedThisTurn = 0;
	this.claimed = {'total': 0};
}

Resource.prototype.consume = function(amount) {
	if (this.amount > amount) {
		this.amount -= amount;
		this.consumedThisTurn += amount;
		return amount;
	} else {
		const tmpAmount = this.amount;
		this.consumedThisTurn += tmpAmount;
		this.amount = 0;
		return tmpAmount;
	}
}

Resource.prototype.produce = function(amount) {
	this.amount += amount;
	this.producedThisTurn += amount;
}

// tries to claim a certain amount of resources - returs the amount that it was able to claim
// note: if the same category/action has already claimed resources, that quota is used to fulfill this request
// safe to call with 0 amounts to unclaim
Resource.prototype.claim = function(amount, action, category) {
	var catName = category;
	if (category == null) {
		catName = "__none__";
	}

	if (!this.claimed.hasOwnProperty(action)) {
		this.claimed[action] = {};
	}

	if (!this.claimed[action].hasOwnProperty(category)) {
		this.claimed[action][category] = 0;
	}

	// claim as much as available up to the required amount
	// note, we will internally deal with the 'delta', but we will return the total amount claimed
	var alreadyClaimed = this.claimed[action][category];
	var claimAmount = Math.min(this.claimable(amount, action, category), amount) - alreadyClaimed
	this.claimed.total += claimAmount;
	this.claimed[action][category] += claimAmount;

	return claimAmount + alreadyClaimed;
}

Resource.prototype.claimable = function(amount, action, category) {
	var alreadyClaimed = 0;
	var catName = category;
	if (category == null) {
		catName = "__none__";
	}

	if (this.claimed.hasOwnProperty(action) && this.claimed[action].hasOwnProperty(catName)) {
			alreadyClaimed = this.claimed[action][catName];
	}

	return Math.min(amount, this.amount - this.claimed.total + alreadyClaimed);
}

Resource.prototype.getMaxAvailable = function(action, category) {
	var catName = category;
	if (category == null) {
		catName = "__none__";
	}

	var claimed = 0;
	if (this.claimed[action] != null && this.claimed[action][category] != null) {
		claimed = this.claimed[action][category];
	}

	return this.amount - this.claimed.total + claimed;
}

Resource.prototype.getConsumedReport = function() {
	if (this.consumedThisTurn != 0) {
		return this.id + " " + this.consumedThisTurn.toFixed(1);		
	}

	return null;
}

Resource.prototype.getProducedReport = function() {
	if (this.producedThisTurn != 0) {
		return this.id + " " + this.producedThisTurn.toFixed(1);		
	}

	return null;
}

Resource.prototype.getWastedReport = function() {
	if (this.wastedThisTurn != 0) {
		return this.id + " " + this.wastedThisTurn.toFixed(1);		
	}

	return null;
}

Resource.prototype.newTurn = function() {
	this.wastedThisTurn = 0;
	this.consumedThisTurn = 0;
	this.producedThisTurn = 0;
	this.claimed = {'total': 0};
}
