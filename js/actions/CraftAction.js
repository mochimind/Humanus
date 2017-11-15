
var CraftConst = {};

function CraftAction(_unit, item, _args) {
	this.item = item;
	Action.call(this, _unit, _args);
}

CraftAction.prototype = Object.create(Action.prototype);
CraftAction.prototype.constructor = CraftAction;

CraftAction.prototype.resolveAction = function() {
	var item = ItemList[this.item];
	var craftAmount = args / item.work;
	if (item.components.length != 0){
		for (var i=0 ; i<item.components.length ; i++) {
			craftAmount = Math.min(craftAmount, this.unit.resources.isAvailable(item.components[i].type, 
				item.components[i].amount * craftAmount) / item.components[i].amount);
		}
	}
	this.unit.resources.produce(item, canCraft);
	if (item.components.length != 0) {
		for (var i=0 ; i<item.components.length ; i++) {
			this.unit.resources.consume(item.components[i].amount * craftAmount);
		}
	}
}

CraftAction.prototype.removeAction = function() {
	Action.prototype.removeAction.call(this);
	this.unit.population.removeAllocation(this.item);
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
		var maxCrafters = unit.population.getAvailablePop(ActionConst.CraftAction, item.id);

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
	parent.append("<br>");

	parent.append(executeBut);
	parent.append(cancelBut);

	executeBut.on("click", CraftConst.HandleSubmit);
	cancelBut.on("click", ActionPanel.HandleCancel);
}

CraftConst.CreateRequirementsTable = function(resources) {
	if (resources.length > 0) {
		var newTable = $("<table></table>");
		var newRow = $("<tr></tr>");
		for (var i=0 ; i<resources.length ; i++) {
			var iconCol = $("<td class='resourceIcon'></td>");
			var resIcon = ResourceConst.GetIcon(resources[i].type);
			iconCol.append("<img src=" + resIcon + ">");
			newRow.append(iconCol);

			var numCol = $("<td class='resourceAmount'></td>");
			numCol.text = resources[i].amount;
			newRow.append(numCol);
		}

		return newTable;		
	} else {
		return $("<div>None</div>");
	}
}

CraftConst.HandleSubmit = function() {
	var canCraft = unit.getPossibleCrafts();
	var unit = UnitConst.selectedUnit;
	var valid = true;
	var allocationList = [];

	// we will iterate through each craft item from the top of the list and try to allocate crafters to create the item
	for (var i=0 ; i<canCraft.length ; i++) {
		var item = ItemList[canCraft[i]];
		var workers = $("#ci_" + item.id).val();
		var allocatable = unit.population.validateCrafters(workers, item.id);
		if (workers != allocatable) {
			$("#ci_" + item.id).val(allocatable);
			alert("Can't allocate enough workers for " + item.name);
			for (var j=0 ; j<allocationList.length ; j++) {

			}
			return;
		} else {
			// we want to store how many additional people we allocated. this way if there's a problem, we can still
			// restore what the user had allocated last turn
			allocationList.push([workers - unit.population.getAllocatedPop(CraftConst.GenerateTypeKey(canCraft[i])), item.id]);
			unit.population.allocatePop(workers, CraftConst.GenerateTypeKey(item.id));
		}
	}

}

CraftConst.GenerateTypeKey = function(item) {
	return ActionConst.CraftAction + this.item;
}

CraftConst.MeetsCriteria = function(demographic, item) {
	if (demographic.canCraft().includes(item)) {
		return true;
	}

	return false;
}


