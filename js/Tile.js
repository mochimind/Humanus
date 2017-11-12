var Tile = {};

Tile.RichFertilityThreshold = 750;
Tile.GoodFertilityThreshold = 500;
Tile.DecentFertilityThreshold = 250;

Tile.NewRandom = function(parent) {
	var outObj = {};
	outObj.parent = parent;
	var typeInt = Math.round(Math.random() * 4);
	var imgObj = null;
	if (typeInt == 0) {
		outObj.terrain = "grassland";
		imgObj = $(("<img src='img/grass.jpg'>"));
	} else if (typeInt == 1) {
		outObj.terrain = "forest";
		imgObj = $(("<img src='img/forest.jpg'>"));
	} else if (typeInt == 2) {
		outObj.terrain = "mountain";
		imgObj = $(("<img src='img/mountain.png'>"));
	} else if (typeInt == 3) {
		outObj.terrain = "desert";
		imgObj = $(("<img src='img/desert.jpg'>"));
	} else {
		outObj.terrain = "water";
		imgObj = $(("<img src='img/water.jpg'>"));
	}
	imgObj.attr("class", "mapTile");
	parent.append(imgObj);

	outObj.plants = Math.round(Math.random() * 1000);
	outObj.animals = Math.round(Math.random() * 1000);

	return outObj;
}

Tile.GetExploredText = function (tile) {
	return "0%";
}

Tile.GetPlantLifeText = function (tile) {
	if (tile.plants > Tile.RichFertilityThreshold) {
		return "rich";
	}
	if (tile.plants > Tile.GoodFertilityThreshold) {
		return "good";
	}
	if (tile.plants > Tile.DecentFertilityThreshold) {
		return "decent";
	}
	return "poor";
}

Tile.GetAnimalText = function(tile) {
	if (tile.animals > Tile.RichFertilityThreshold) {
		return "rich";
	}
	if (tile.animals > Tile.GoodFertilityThreshold) {
		return "good";
	}
	if (tile.animals > Tile.DecentFertilityThreshold) {
		return "decent";
	}
	return "poor";
}

// creates a new icon and adds it to the appropriate container object
// NOTE: the new display object is not stored in the tile, but instead in the unit itself
Tile.AddUnit = function(tile, unit) {
	var charIcon = $("<img src='" + Unit.GetIconFName(unit) + "' width='50' height='50'>");
	charIcon.attr("class", "characterTile");
	tile.parent.append(charIcon);
	unit.charIcon = charIcon;
}

Tile.GetMaxGatherers = function(tile) {
	console.log(tile);
	if (tile.plants > Tile.RichFertilityThreshold) {
		return 40;
	} else if (tile.plants > Tile.GoodFertilityThreshold) {
		return 30;
	} else if (tile.plants > Tile.DecentFertilityThreshold) {
		return 20;
	} else {
		return 10;
	}
}
