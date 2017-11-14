var PopConst = {};

PopConst.defaultGrowthRate = 0.01;
PopConst.defaultMortalityRate = 0.006;

function Population(unit) {
	this.data = [];
	this.unit = unit;
	this.growthRate = PopConst.defaultGrowthRate;
	this.mortalityRate = PopConst.defaultMortalityRate;
	this.turnSummary = [];
}

Population.prototype.addPopulation = function(type, count) {
	// check if this type of population already exists
	for (var i=0 ; i<this.data.length ; i++) {
		if (this.data[i].getType() == type) {
			this.data[i].count += count;
			return;
		}
	}

	// this type of population doesn't exist, create new
	if (type == DemographicConst.PrimitiveType) {
		this.data.push(new PrimitivePop(count, this));

		// we want to make sure that the lowest tech levels are always on the left - they die first :x
		this.turnSummary.sort(function(a,b) {
			return a.getTechLevel() - b.getTechLevel();
		});
	}
}

Population.prototype.processTurn = function() {
	// check if all people's needs were satisfied
	// Note: the assumption here is that units can only be downgrade once - that is a level 10 scientis that runs out of 
	// food won't die immediately, it'll take him 10 turns to downgrade to a primitive and then die
	for (var i=0 ; i<this.data.length ; i++) {
		var curPop = this.data[i];
		var downgrades = curPop.consumeResources(this.unit.resources);
		if (downgrades != 0) {
			curPop.population -= downgrades;
			if (curPop.getDowngradeType() != null) {
				this.addPopulation(curPop.getDowngradeType(), downgrades);
				this.addTurnSummary(downgrades + " people didn't get what they need and became " + curPop.getDowngradeType());
			} else {
				this.addTurnSummary(downgrades + " people died from starvation");
			}
		}
	}

	// grow the population & age the population - newborns always start as primitives
	var curPop = this.getTotalPop();
	var newPeopleCount = curPop * (this.growthRate - this.mortalityRate);
	var visibleChange = Math.floor(curPop + newPeopleCount) - Math.floor(curPop)
	if (visibleChange != 0) {
		this.addTurnSummary("Population changed by " + visibleChange + " due to natural causes");
	}
	this.addPopulation(DemographicConst.PrimitiveType, newPeopleCount);
	var reportCount = newPeopleCount.toFixed(1);
}

Population.prototype.newTurn = function() {
	this.turnSummary = [];
}

Population.prototype.getTotalPop = function() {
	total = 0;
	for (var i=0 ; i<this.data.length ; i++) {
		total += this.data[i].count;
	}

	return total;
}

Population.prototype.loadInfo = function() {
	$("#population").text(Math.floor(this.getTotalPop()));
}

Population.prototype.addTurnSummary = function(summary) {
	this.turnSummary.push(summary);
}

Population.prototype.getTurnSummary = function() {
	return this.turnSummary;
}

Population.prototype.clearAllocatedPop = function() {
	for(var i=0 ; i<this.data.length ; i++) {
		this.data[i].clearAllocatedPop();
	}
}

// returns the number of people available to do the specific task
// note, people that are currently performing the action should be considered as available to do it
Population.prototype.getAvailablePop = function(action) {
	availablePop = 0;
	for (var i=0 ; i<this.data.length ; i++) {
		availablePop += this.data[i].getAvailablePop(action) + this.data[i].getAllocatedPop(action);
	}

	return Math.floor(availablePop);
}

Population.prototype.getAllocatedPop = function(type) {
	var allocatedPop = 0;
	for (var i=0 ; i<this.data.length ; i++) {
		allocatedPop += this.data[i].getAllocatedPop(type);
	}

	return Math.floor(allocatedPop)
}

Population.prototype.allocatePop = function(workers, action) {
	toAllocate = Math.floor(workers);
	for (var i=0 ; i<this.data.length ; i++) {
		toAllocate -= this.data[i].allocatePop(workers, action);
		if (toAllocate == 0) {
			return;
		}
	}
}

Population.prototype.unallocatePop = function(action) {
	for (var i=0 ; i<this.data.length ; i++) {
		this.data[i].removeAllocation(action);
	}
}

Population.prototype.validateWorkers = function(workers, action) {
	curWorkers = this.getAllocatedPop(action);
	if (isNaN(workers)) {
		alert("please input a valid number");
		return false;
	}

	if (workers < 0) {
		alert ("please input a positive number");
		return false;
	}

	if (action != ActionConst.MoveAction && workers > this.getAvailablePop(action)) {
		alert ("not enough free eligible workers to allocate!");
		return false;
	}

	return true;

}

Population.prototype.getPossibleActions = function() {
	var actionList = [];
	for (var i=0; i<this.data.length ; i++) {
		var processActions = this.data[i].getActions();
		for (const tok in processActions) {
			if (!actionList.includes(processActions[tok])) {
				actionList.push(processActions[tok]);
			}
		}
	}

	return actionList;
}

