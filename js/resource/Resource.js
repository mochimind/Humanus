
function Resource(amount) {
	this.amount = amount;
	this.producedThisTurn = amount;
	this.consumedThisTurn = 0;
	this.wastedThisTurn = 0;
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

Resource.prototype.getType = function() {
	console.log("error: resource not implemented!");
}

Resource.prototype.produce = function(amount) {
	this.amount += amount;
	this.producedThisTurn += amount;
}

Resource.prototype.getConsumedReport = function() {
	if (this.consumedThisTurn != 0) {
		return this.getType() + " " + this.consumedThisTurn.toFixed(1);		
	}

	return null;
}

Resource.prototype.getProducedReport = function() {
	if (this.producedThisTurn != 0) {
		return this.getType() + " " + this.producedThisTurn.toFixed(1);		
	}

	return null;
}

Resource.prototype.getWastedReport = function() {
	if (this.wastedThisTurn != 0) {
		return this.getType() + " " + this.wastedThisTurn.toFixed(1);		
	}

	return null;
}

Resource.prototype.processTurn = function() {
	// resources by default do nothing
}

Resource.prototype.loadInfo = function() {
	// resources by default don't show anything
}

Resource.prototype.newTurn = function() {
	this.wastedThisTurn = 0;
	this.consumedThisTurn = 0;
	this.producedThisTurn = 0;
}
