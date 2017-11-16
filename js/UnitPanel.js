UnitPanel = {};

UnitPanel.ColumnsPerRow = 5;

UnitPanel.Init = function() {
	$("#collapsePopulation").hide();
	$("#unitPopulation").hide();
	$("#expandPopulation").on("click", UnitPanel.ExpandPopulation);
	$("#collapsePopulation").on("click", UnitPanel.CollapsePopulation);
}

UnitPanel.ExpandPopulation = function() {
	$("#collapsePopulation").show();
	$("#unitPopulation").show();
	$("#expandPopulation").hide();
}

UnitPanel.CollapsePopulation = function() {
	$("#collapsePopulation").hide();
	$("#unitPopulation").hide();
	$("#expandPopulation").show();
}

UnitPanel.UpdatePopulation = function(pop) {
	$("#population").val(pop.getTotalPop());
	$("#unitPopulation").empty();
	for (var i=0 ; i<pop.data.length ; i++) {
		var newRow = $("<tr></tr>");
		newRow.append("<td>" + pop.data[i].data.name + "</td>");
		newRow.append("<td>" + Math.floor(pop.data[i].count) + "</td>");
		$("#unitPopulation").append(newRow);
	}
}

UnitPanel.UpdateResources = function(bundle) {
	$("#unitResources").empty();

	// every set number of columns, we need a new row
	var rowCount = 0;
	var rowObj = $("<tr></tr>");
	for (var tok in bundle.resources) {
		var resource = bundle.resources[tok];

		if (ItemList[resource.id].icon == null) {
			// we are assuming if there's no icon, we don't want to display the resource - this may not be true in the future
			continue;
		}
		if (rowCount > 0 && rowCount % UnitPanel.ColumnsPerRow == 0) {
			$("#unitResources").append(rowObj);
			rowObj = $("<tr></tr>");
		}

		var iconCell = $("<td class='resourceIcon'></td>");
		iconCell.append("<img src='" + ItemList[resource.id].icon + "' class='resourceIcon'>");
		rowObj.append(iconCell);

		var countCell = $("<td class='resourceAmountLong'></td>");
		countCell.text(resource.amount.toFixed(1));
		rowObj.append(countCell);

		rowCount++;
	}

	$("#unitResources").append(rowObj);
}
