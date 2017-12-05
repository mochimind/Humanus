
var CraftConst = {};

function CraftAction(_unit, item, _args) {
	this.item = item;
	Action.call(this, _unit, _args);
}

CraftAction.prototype = Object.create(Action.prototype);
CraftAction.prototype.constructor = CraftAction;

CraftAction.prototype.addOrReplaceAction = function() {
	if (this.args == 0) {
		for (var i=0 ; i<this.unit.actions.length ; i++) {
		var iter = this.unit.actions[i];
		if (iter.getType() == this.getType() && iter.item == this.item) {
				iter.removeAction();
			}
		}
		return;
	}
	for (var i=0 ; i<this.unit.actions.length ; i++) {
		var iter = this.unit.actions[i];
		if (iter.getType() == this.getType() && iter.item == this.item) {
			iter.args = this.args;
			return;
		}
	}
	this.unit.actions.push(this);
}

CraftAction.prototype.resolveAction = function() {
	var item = ItemList[this.item];
	var craftAmount = this.args / item.work;

	// at this stage everything that's needed for production has already been allocated, just produce the darn thing
	this.unit.resources.produce(item.id, craftAmount);
	if (item.components.length != 0) {
		for (var i=0 ; i<item.components.length ; i++) {
			this.unit.resources.consume(item.components[i].id, item.components[i].amount * craftAmount);
		}
	}
}

CraftAction.prototype.removeAction = function() {
	Action.prototype.removeAction.call(this);
	this.unit.population.removeAllocation(this.item);
}

CraftAction.prototype.newTurn = function() {
	var newRuns = -1;
	var curRuns = this.args / ItemList[this.item].work;
	var runnable;

	// now lets see how much we can reserve 
	for (var i=0 ; i<ItemList[this.item].components.length ; i++) {
		var requirement = ItemList[this.item].components[i];
		runnable = this.unit.resources.claimable(requirement.id, curRuns * requirement.amount, ActionConst.CraftAction, this.item) / requirement.amount;
		newRuns = newRuns == -1 ? runnable : Math.min(curRuns, newRuns, runnable);
	}
	runnable = this.unit.population.getAvailablePop(ActionConst.CraftAction, this.item) / ItemList[this.item].work;
	newRuns = Math.min(curRuns, newRuns, runnable);

	// now, let's reserve what we need
	for (var i=0 ; i<ItemList[this.item].components.length ; i++) {
		var requirement = ItemList[this.item].components[i];
		this.unit.resources.claim(requirement.id, newRuns * requirement.amount, ActionConst.CraftAction, this.item);
	}

	this.args = newRuns * ItemList[this.item].work;
	this.unit.population.allocatePop(this.args, ActionConst.CraftAction, this.item);
}

// TODO: not sure if this is the best way to do it, but the type of a craft action is a merge between
// the craft action type and the item type
CraftAction.prototype.getType = function() {
	return ActionConst.CraftAction;
}


////////////////////////////// static functions & data

CraftConst.ExpandDetails = function(parent, executeBut, cancelBut) {
	var unit = UnitConst.selectedUnit;
	var tile = unit.getTile();
	var canCraft = unit.getPossibleCrafts();

	parent.append("<p>You have " + " people that can craft. Select items to allocate your crafters to.</p>");
	parent.append(executeBut);
	parent.append(cancelBut);
	var containerTable = $("<table border='1px'></table>");
	var headerRow = $("<tr></tr>");
	headerRow.append("<th>Item</th>");
	headerRow.append("<th>Requirements</th>");
	headerRow.append("<th>Effort</th>");
	headerRow.append("<th>Allocate</th>");
	containerTable.append(headerRow);

	for (var i=0 ; i<canCraft.length ; i++) {
		var item = ItemList[canCraft[i]];
		var curCrafters = unit.population.getAllocatedPop(ActionConst.CraftAction, item.id);
		var maxCrafters = CraftConst.GetMaxProduceable(unit, item.id) * ItemList[item.id].work;

		var containerRow = $("<tr></tr>");
		var newCell = $("<td></td>");
		newCell.text(item.name);
		containerRow.append(newCell);

		newCell = $("<td></td>");
		newCell.append(CraftConst.CreateRequirementsTable(item.components));
		containerRow.append(newCell);

		newCell = $("<td></td>");
		newCell.append(item.work);
		containerRow.append(newCell);

		newCell = $("<td></td>");
		newCell.append("<textarea id='ci_" + item.id + "' rows='1' cols='3' class='workerInput'>" + curCrafters + "</textarea>");
		newCell.append("<span> / " + maxCrafters);
		containerRow.append(newCell);
		containerTable.append(containerRow);
	}
	parent.append(containerTable);
	parent.append("<br>");


	executeBut.on("click", CraftConst.HandleSubmit);
	cancelBut.on("click", ActionPanel.HandleCancel);
}

CraftConst.CreateRequirementsTable = function(resources) {
	if (resources.length > 0) {
		var newTable = $("<table></table>");
		var newRow = $("<tr></tr>");
		for (var i=0 ; i<resources.length ; i++) {
			var iconCol = $("<td class='resourceIcon'></td>");
			var resIcon = ItemList[resources[i].id].icon;
			iconCol.append("<img src=" + resIcon + " class='resourceIcon'>");
			newRow.append(iconCol);

			var numCol = $("<td class='resourceAmountShort'></td>");
			numCol.text(resources[i].amount);
			newRow.append(numCol);
		}
		newTable.append(newRow);

		return newTable;		
	} else {
		return $("<div>None</div>");
	}
}

CraftConst.HandleSubmit = function() {
	var unit = UnitConst.selectedUnit;
	var canCraft = unit.getPossibleCrafts();
	var valid = true;
	// allocation lis is the list of steps we need to undo in an error. completedList is the list of actions we create on success
	var allocationList = [];
	var completedList = [];

	// we will iterate through each craft item from the top of the list and try to allocate crafters to create the item
	for (var i=0 ; i<canCraft.length ; i++) {
		var item = ItemList[canCraft[i]];
		var workers = $("#ci_" + item.id).val();
		var maxRuns = CraftConst.GetMaxProduceable(unit, item.id);
		if (workers / item.work > maxRuns) {
			alert("Can't employ that many workers for " + item.name + ". Circumstances only allow for: " + maxRuns * workers);
			for (var j=0 ; j<allocationList.length ; j++) {
				unit.population.unallocatePop(allocationList[j][1], ActionConst.CraftAction, allocationList[j][0]);
			}
			return;
		} else {
			// we want to store how many additional people we allocated. this way if there's a problem, we can still
			// restore what the user had allocated last turn
			allocationList.push([item.id, workers - unit.population.getAllocatedPop(ActionConst.CraftAction, item.id)]);
			unit.population.allocatePop(workers, ActionConst.CraftAction, item.id);
			completedList.push([item.id, workers]);
		}
	}

	// first make sure there are no movements going on - we can't have workers and movement
	MoveConst.RemoveMoveAction(unit);
	for (var i=0 ; i<completedList.length ; i++) {
		new CraftAction(unit, completedList[i][0], completedList[i][1]);
	}
	ActionPanel.HandleSubmit();
}

CraftConst.MeetsCriteria = function(demographic, item) {
	if (demographic.canCraft().includes(item)) {
		return true;
	}

	return false;
}

CraftConst.GetMaxProduceable = function(unit, item) {
	var newWorkers =  unit.population.getAvailablePop(ActionConst.CraftAction, item);

	if (ItemList[item].hasOwnProperty("components") && ItemList[item].components.length != 0) {
		var maxAvailable = 0;
		for (var i=0 ; i<ItemList[item].components.length ; i++) {
			var requestItem = ItemList[item].components[i];
			if (maxAvailable == 0) {
				maxAvailable = unit.resources.getMaxAvailable(requestItem.id, ActionConst.CraftAction, item) / requestItem.amount;
			} else {
				maxAvailable = Math.min(maxAvailable, unit.resources.getMaxAvailable(requestItem.id, ActionConst.CraftAction, item) / requestItem.amount);
			}
		}
		var haveMatsWorkers = Math.floor(maxAvailable * ItemList[item].work);
		newWorkers = Math.min(newWorkers, haveMatsWorkers);
	}

	return newWorkers / ItemList[item].work;
}

// returns the max number that can be manufactured. Returns null if there are no requirements for this item
CraftConst.GetMaxAvailableMaterials = function(bundle, item) {

	return maxAvailable;
}



