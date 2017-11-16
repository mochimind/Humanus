var DemographicConst = {}

DemographicConst.PrimitiveType = "Primitive";
DemographicConst.TribalType = "Tribal";

function Demographic(count, parent, typeObj) {
	this.parent = parent;
	this.count = count;
	this.data = typeObj;
	this.jobs = {'total': 0};
}

Demographic.prototype.getAvailablePop = function(action, category) {
	if (!this.data.actions.includes(action)) {
		return 0;
	}
	var catName = DemographicConst.GetCategoryUseName(category);

	var allocated = 0;
	if (this.jobs.hasOwnProperty(action) && this.jobs[action].hasOwnProperty(catName)) {
		allocated = this.jobs[action][catName];
	}

	return this.count - this.jobs.total + allocated;
}

Demographic.prototype.getAllocatedPop = function(action, category) {
	var catName = DemographicConst.GetCategoryUseName(category);

	if (this.jobs.hasOwnProperty(action) && this.jobs[action].hasOwnProperty(catName)) {
		return this.jobs[action][catName];
	}

	return 0;
}

Demographic.prototype.clearAllocatedPop = function() {
	for (const tok in Object.keys(this.jobs)) {
		this.jobs[tok].total += this.jobs[tok];
		delete this.jobs[tok];
	}
}

// note this is not cumulative, this function wipes out previous allocations
Demographic.prototype.allocatePop = function(workers, action, category) {
	var catName = DemographicConst.GetCategoryUseName(category);
	// make sure the data structure is setup and ready to use
	if (!this.jobs.hasOwnProperty(action)) {
		this.jobs[action] = {};
	}

	if (!this.jobs[action].hasOwnProperty(catName)) {
		this.jobs[action][catName] = 0;
	}

	var allocated = this.jobs[action][catName];
	var newAmount = Math.min(workers, this.getAvailablePop(action, catName)) - allocated;
	this.jobs.total += newAmount;
	this.jobs[action][catName] += newAmount;

	return newAmount + allocated;
}

// unallocates up to the amount workers, or the maximum that has been allocated
// returns the amount that was unallocated
Demographic.prototype.unallocatePop = function(workers, action, category) {
	var catName = DemographicConst.GetCategoryUseName(category);

	if (this.jobs.hasOwnProperty(action) && this.jobs[action].hasOwnProperty(catName)) {
		var allocated = this.jobs[action][catName];
		var unallocateAmount = Math.min(workers, allocated);
		this.jobs[action][catName] -= unallocateAmount;
		this.total -= unallocateAmount;

		return unallocateAmount;
	} else {
		return 0;
	}
}

Demographic.prototype.removeAllocation = function(action, category) {
	if (this.jobs.hasOwnProperty(action) && this.jobs[action].hasOwnProperty(category)) {
		this.jobs.total -= this.jobs[action][category];
		this.jobs[action][category] = 0;
	}
}

Demographic.prototype.consumeResources = function() {
	var unsatisfied = 0;
	for(var i=0 ; i<this.data.consumeResources.length ; i++) {
		var satisfied = 0;
		var criteria = this.data.consumeResources[i];
		// note all criterias are an array, this handles the 'or' relationship
		for (var j=0 ; j<criteria.length ; j++) {
			satisfied += this.parent.unit.resources.consume(criteria[j].type, criteria[j].amount * (this.count - satisfied)) / criteria[j].amount;
		}
		unsatisfied = Math.max(unsatisfied, this.count - satisfied);
	}

	return unsatisfied;
}

/////////////////////////////////// static functions

DemographicConst.GetCategoryUseName = function(category) {
	if (category == null) {
		return "__none__";
	}
	return category;
}


