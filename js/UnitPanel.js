UnitPanel = {};

UnitPanel.ColumnsPerRow = 5;

UnitPanel.UpdatePopulation = function(newPop) {
	$("#population").val(newPop);
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
			console.log("hit!");
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

	// we don't want to double append. the only time that the above code appends a row is if modulus is 0
	// however, the row is incremented at the end of the loop so it would come out as '1'
	if (rowCount % UnitPanel.ColumnsPerRow != 1) {
		$("#unitResources").append(rowObj);
	}
}
