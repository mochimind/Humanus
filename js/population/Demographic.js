var DemographicConst = {}

DemographicConst.PrimitiveType = "Primitive";
DemographicConst.TribalType = "Tribal";

function Demographic(count, population) {
	this.population = population;
	this.count = count;
	this.allocatedCount = 0;
	this.jobs = {};
}

Demographic.prototype.getAvailablePop = function(action, category) {
	if (this.getActions().includes(action)) {
		if (category != null) {
			if (ActionConst.MeetsCriteria(this, action, category)) {
				return this.count - this.allocatedCount;
			} else {
				return 0;
			}
		} else {
			return this.count - this.allocatedCount;
		}
	}
	return 0;
}

Demographic.prototype.getAllocatedPop = function(action, category) {
	console.log(this.jobs);
	if (this.jobs[action] != null) {
		if (category != null) {
			if (this.jobs[action][category] != null) {
				return this.jobs[action][category];
			}
		} else {
			return this.jobs[action].total;
		}
	}
	return 0;
}

Demographic.prototype.clearAllocatedPop = function() {
	for (const tok in Object.keys(this.jobs)) {
		this.allocatedCount += this.jobs[tok].total;
		delete this.jobs[tok];
	}
}

Demographic.prototype.removeAllocation = function(action, category) {
	if (this.jobs[action] != null) {
		if (category != null) {
			// remove just the category
			if (this.jobs[action][category] != null) {
				var removeAmount = this.jobs[action][category];
				this.jobs[action].total -= removeAmount;
				this.allocatedCount -= removeAmount;
				delete this.jobs[action][category];
			}
		} else {
			// remove everything
			this.allocatedCount -= this.jobs[action].total;
			delete this.jobs[action];
		}
	}
}

// note this is not cumulative, this function wipes out previous allocations
Demographic.prototype.allocatePop = function(workers, action, category) {
	var allocateAmount = Math.min(this.getAvailablePop(action, category) + this.getAllocatedPop(action, category), workers);

	this.removeAllocation(action, category);
	if (this.jobs[action] == null) {
		this.jobs[action] = {'total': 0};
	}
	this.jobs[action].total += allocateAmount;
	if (category != null) {
		this.jobs[action][category] = allocateAmount;
	}
	this.allocatedCount += allocateAmount;

	return allocateAmount;
}

Demographic.prototype.unallocatePop = function(workers, action, category) {
	var unallocateAmount = Math.min(this.getAllocatedPop(action, category), workers);
	console.log(unallocateAmount + "," + workers + "," + action + "," + category);

	if (unallocateAmount != 0) {
		// this means that we've done the checks already that action already exists and if applicable category also exists
		if (category != null) {
			this.jobs[action][category] -= unallocateAmount;
			// TODO: there can be a situation where we've unallocated the whole population, but the categories are not empty
		}
		this.jobs[action].total -= unallocateAmount;
		this.allocatedCount -= unallocateAmount;
	} else {
		return 0;
	}
}
