var DemographicConst = {}

DemographicConst.PrimitiveType = "Primitive";
DemographicConst.TribalType = "Tribal";

function Demographic(count, population) {
	this.population = population;
	this.count = count;
	this.allocatedCount = 0;
	this.jobs = {};
}

Demographic.prototype.getAvailablePop = function(action) {
	if (this.getActions().includes(action)) {
		return this.count - this.allocatedCount;
	}
	return 0;
}

Demographic.prototype.getAllocatedPop = function(action) {
	if (this.jobs[action] != null) {
		return this.jobs[action];
	}
	return 0;
}

Demographic.prototype.clearAllocatedPop = function() {
	for (const tok in Object.keys(this.jobs)) {
		this.allocatedCount += this.jobs[tok];
		delete this.jobs.tok;
	}
}

Demographic.prototype.removeAllocation = function(action) {
	if (this.jobs[action] != null) {
		this.allocatedCount -= this.jobs[action];
	}
	delete this.jobs.action;
}

// note this is not cumulative, this function wipes out previous allocations
Demographic.prototype.allocatePop = function(workers, action) {
	allocateAmount = Math.min(this.getAvailablePop(action) + this.getAllocatedPop(action), workers);

	this.removeAllocation(action);
	this.jobs[action] = allocateAmount;
	this.allocatedCount += allocateAmount;

	return allocateAmount;
}
