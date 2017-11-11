var Tile = {};

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
	if (tile.plants > 750) {
		return "rich";
	}
	if (tile.plants > 500) {
		return "good";
	}
	if (tile.plants > 250) {
		return "decent";
	}
	return "poor";
}

Tile.GetAnimalText = function(tile) {
	if (tile.animals > 750) {
		return "rich";
	}
	if (tile.animals > 500) {
		return "good";
	}
	if (tile.animals > 250) {
		return "decent";
	}
	return "poor";
}

Tile.AddTribal = function(tile) {
	tile.charIcon = $("<img src='img/person.png' width='50' height='50'>");
	tile.charIcon.attr("class", "characterTile");
	tile.parent.append(tile.charIcon);
}
