UpgradeConst = {};

// Note: it is a design decision not to allow users to upgrade units themselves - units automatically upgrade
// Therefore, there are only static functions here

///////////////////////// static functions

UpgradeConst.ProcessTurn = function() {
	for (var i=0 ; i<UnitConst.units.length ; i++) {
		UpgradeConst.ProcessUnitTurn(UnitConst.units[i]);
	}
}

UpgradeConst.ProcessUnitTurn = function(unit) {
	for (var i=0 ; i<unit.population.data.length ; i++){
		// for now we just consider single upgrade chains as a simplification
		var processDemograph = unit.population.data[i];
		if (processDemograph.data.upgrades != null) {
			var canUpgrade = UpgradeConst.CanUpgradeCount(unit, processDemograph.data.id, processDemograph.data.upgrades);
			if (canUpgrade != 0) {
				UpgradeConst.ExecuteUpgrade(unit, processDemograph.data.id, processDemograph.data.upgrades, canUpgrade);
			}
		}
	}
}


// we assume that all error checking has already been done, so just execute the action
UpgradeConst.ExecuteUpgrade = function(unit, upgradeFrom, upgradeTo, amount) {
	var upgradeToDemograph = null;
	for (var i=0 ; i<unit.population.data.length ; i++) {
		var demograph = unit.population.data[i];
		if (demograph.data.id == upgradeFrom) {
			demograph.count -= amount;
		} else if (demograph.data.id == upgradeTo) {
			upgradeToDemograph = demograph;
		}
	}

	unit.population.addTurnSummary("Upgraded " + amount + " " + UnitList[upgradeFrom].name + " to " + UnitList[upgradeTo].name);

	if (upgradeToDemograph == null) {
		// TODO: this is not clean - population should be handling this functionality
		upgradeToDemograph = new Demographic(amount, unit.population, UnitList[upgradeTo]);
		unit.population.data.push(upgradeToDemograph);
	} else {
		upgradeToDemograph.count += amount;
	}
}

// returns the number that can be upgraded, or 0 on error
UpgradeConst.CanUpgradeCount = function(unit, upgradeFrom, upgradeTo) {
	// Assumption: the turn has been fully processed at this point, therefore, we don't need to check if the
	// resources or people we need are allocated - they should all have been unallocated
	var canUpgrade = null;

	var first = true;
	// first check how much resources we have available
	for (var i=0 ; i<UnitList[upgradeTo].upgradeReq.length ; i++) {
		var requirement = UnitList[upgradeTo].upgradeReq[i];
		var availableRes = unit.resources.getAvailable(requirement.type);

		// now, the unit needs to have a SURPLUS of x amount of each resource before their units can upgrade
		// therefore, if the unit already has say 3 of a demographic, and the demographic requires x resources
		// to upgrade, then the unit needs at least 3*x + x to upgrade a new unit. 
		for (var j=0 ; j<unit.population.data.length ; j++) {
			// iterate through all existing demographies
			var compareDemograph = unit.population.data[j];
			console.log(compareDemograph.data);
			if (compareDemograph.data.upgradeReq == null) {
				continue;
			}
			for (var k=0 ; k<compareDemograph.data.upgradeReq.length ; k++) {
				var compareReq = compareDemograph.data.upgradeReq[k];
				if (compareReq.type == requirement.type) {
					// if there's an upgrade requirement in this demography that shares the resource in question, note it
					availableRes -= compareDemograph.count * compareReq.amount;
				}
			}
		}

		if (canUpgrade == null) {
			canUpgrade = availableRes / requirement.amount;
		} else {
			canUpgrade = Math.min(canUpgrade, availableRes / requirement.amount);
		}
	}

	if (canUpgrade == null) {
		console.log("error: this is a corner case, should not happen");
		canUpgrade = 0;
	}

	// now, let's check how many people are actually available to be upgraded
	var containsDemograph = false;
	for (var i=0 ; i<unit.population.data.length ; i++) {
		var demograph = unit.population.data[i];
		if (demograph.data.id == upgradeFrom) {
			canUpgrade = Math.min(canUpgrade, demograph.count);			
			containsDemograph = true;
		}
	}
	if (!containsDemograph) {
		return 0;
	}

	return Math.floor(canUpgrade);
}


