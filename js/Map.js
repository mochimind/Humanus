var Map = {};
Map.MAX_WIDTH = 15;
Map.MAX_HEIGHT = 15;

Map.GenerateMap = function() {
	Map.tileInfos = [];
	for (var i=0 ; i<Map.MAX_WIDTH ; i++) {
		var rowObj = $("<tr></tr>");
		var rowInfos = [];
		$("#map").append(rowObj);
		for (var j=0 ; j<Map.MAX_HEIGHT ; j++) {
			var cellObj = $("<td class='mapCell'></td>");
			cellObj.attr("id", "" + i + "x" + j);
			rowObj.append(cellObj);
			var tileInfo = Tile.NewRandom(cellObj);

			if (i == 8 && j == 8) {
				Map.curX = i;
				Map.curY = j;

				var newUnit = Unit.CreateUnit("tribal", 20, {"food": 100});
				Unit.SelectUnit(newUnit);
			}
			rowInfos.push(tileInfo);
		}
		Map.tileInfos.push(rowInfos);
	}
	Map.NavigateTo(Map.curX,Map.curY);
}

Map.UpdateTileInfo = function(tile) {
	$("#explored").text(Tile.GetExploredText(tile));
	$("#plants").text(Tile.GetPlantLifeText(tile));
	$("#animals").text(Tile.GetAnimalText(tile));
}

Map.NavigateUp = function() {
	if (Map.curY != 0) {
		Map.NavigateTo(Map.curX, Map.curY - 1);
	}
}

Map.NavigateDown = function() {
	if (Map.curY < Map.tileInfos[0].length-1) {
		Map.NavigateTo(Map.curX, Map.curY + 1);
	}
}

Map.NavigateLeft = function() {
	if (Map.curX != 0) {
		Map.NavigateTo(Map.curX - 1, Map.curY);
	}
}

Map.NavigateRight = function() {
	if (Map.curX < Map.tileInfos.length-1) {
		Map.NavigateTo(Map.curX + 1, Map.curY);
	}
}

Map.NavigateTo = function(x, y) {
	Util.StopBlink();

	var ti = Map.tileInfos[Map.curX][Map.curY];

	Map.curTile = Map.tileInfos[x][y].parent;
	Map.curX = x;
	Map.curY = y;
	Map.UpdateTileInfo(Map.tileInfos[x][y]);
	Unit.MoveUnit(Unit.selectedUnit, x, y);

	Util.StartBlink();

	Unit.ProcessTurn();
}

// sets mode so that whenever a map tile is moused over, "icon" is displayed
// When the user clicks on any tile, callback is called
// callback must take argument of tile object
Map.EnableMoveMouseOver = function(icon, callback) {
	for (var i=0 ; i<Map.tileInfos.length ; i++) {
		for (var j=0 ; j<Map.tileInfos[i].length ; j++) {
			var tile = Map.tileInfos[i][j];
			Tile.SetupMoveMouseOver(tile, icon, function(_tile) {
				callback(_tile);
				Map.DisableMoveMouseOver();
			});
		}
	}
}

Map.DisableMoveMouseOver = function() {
	for (var i=0 ; i<Map.tileInfos.length ; i++) {
		for (var j=0 ; j<Map.tileInfos.length ; j++) {
			var tile = Map.tileInfos[i][j];
			Tile.RemoveMoveMouseOver({"data": {"tile": tile}});
		}
	}
}

// returns coords in an array [x,y]
Map.GetTileCoords = function(tile) {
	for (var i=0 ; i<Map.tileInfos.length ; i++) {
		for (var j=0 ; j<Map.tileInfos[i].length ; j++) {
			if (Map.tileInfos[i][j] == tile) {
				return [i,j];
			}
		}
	}

	return null;
}



