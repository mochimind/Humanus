var TileConst = {};

TileConst.RichFertilityThreshold = 750;
TileConst.GoodFertilityThreshold = 500;
TileConst.DecentFertilityThreshold = 250;

function Tile(parent) {
	this.parent = parent;
	var imgObj = null;
	var typeInt = Math.floor(Math.random()*4);
	if (typeInt == 0) {
		this.terrain = "grassland";
		imgObj = $(("<img src='img/grass.jpg'>"));
	} else if (typeInt == 1) {
		this.terrain = "forest";
		imgObj = $(("<img src='img/forest.jpg'>"));
	} else if (typeInt == 2) {
		this.terrain = "mountain";
		imgObj = $(("<img src='img/mountain.png'>"));
	} else if (typeInt == 3) {
		this.terrain = "desert";
		imgObj = $(("<img src='img/desert.jpg'>"));
	} else {
		this.terrain = "water";
		imgObj = $(("<img src='img/water.jpg'>"));
	}
	imgObj.attr("class", "mapTile");
	parent.append(imgObj);

	this.plants = Math.round(Math.random() * 1000);
	this.animals = Math.round(Math.random() * 1000);
}
Tile.prototype.getExploredText = function() {
	return "0%";
}

Tile.prototype.getPlantLifeText = function() {
	if (this.plants > TileConst.RichFertilityThreshold) {
		return "rich";
	}
	if (this.plants > TileConst.GoodFertilityThreshold) {
		return "good";
	}
	if (this.plants > TileConst.DecentFertilityThreshold) {
		return "decent";
	}
	return "poor";		
}

Tile.prototype.getAnimalText = function() {
	if (this.animals > TileConst.RichFertilityThreshold) {
		return "rich";
	}
	if (this.animals > TileConst.GoodFertilityThreshold) {
		return "good";
	}
	if (this.animals > TileConst.DecentFertilityThreshold) {
		return "decent";
	}
	return "poor";	
}

Tile.prototype.updateAnimals = function(delta) {
	this.animals = Math.min(Math.max(0, this.animals+delta),1000);
	Map.UpdateTileInfo(this);
}

// creates a new icon and adds it to the appropriate container object
// NOTE: the new display object is not stored in the tile, but instead in the unit itself
Tile.prototype.addUnit = function(unit) {
	var charIcon = $("<img src='" + unit.getIconFName() + "' width='50' height='50'>");
	charIcon.attr("class", "characterTile");
	this.parent.append(charIcon);
	unit.charIcon = charIcon;
}

Tile.prototype.getMaxGatherers = function() {
	if (this.plants > TileConst.RichFertilityThreshold) {
		return 40;
	} else if (this.plants > TileConst.GoodFertilityThreshold) {
		return 30;
	} else if (this.plants > TileConst.DecentFertilityThreshold) {
		return 20;
	} else {
		return 10;
	}		
}

// hunting food is calculated as follows
// Every 100 fertility creates a random game on the tile. Each additional hunter increases the chance to catch
// one of the game and decrease the fertility of the tile by 100. The probability is 10% per hunter
// however, this means that each hunter has a 10% chance to catch something
// game values: small is 1, medium is 3, large is 10. Chance of getting small is 50%, medium is 35%, large is 15%
Tile.prototype.getMaxHuntingFood = function() {
	// the expected value is a bit more than 3 given the math above
	return Math.floor(this.animals / 100) * 3;
}

Tile.prototype.getAvailableAnimals = function() {
	return Math.floor(this.animals / 100);
}

// note takes as arguments: the tile to be modified, a url to the icon to show, and the callback if clicked
Tile.prototype.setupMoveMouseOver = function(icon, callback) {
	// setup the callback to listen for the hover
	this.parent.on("mouseenter", {"tile": this, "icon": icon}, this.handleMoveMouseOver);

	// setup other listeners - one for when tile loses focus, another for when user clicks
	this.parent.on("mouseleave", {"tile": this}, this.handleMoveMouseOut);
	this.parent.on("click", "*", {"tile": this, "callback": callback}, this.handleMoveMouseClick);		
}

// handles when the tile is hovered over. in this case, the icon is shown
Tile.prototype.handleMoveMouseOver = function(e) {
	var tile = e.data.tile;
	icon = e.data.icon;

	// TODO: use css classes to specify width & height
	tile.moveIcon = $("<img src='" + icon + "' width='50' height='50'>");
	tile.moveIcon.attr("class", "characterTile");
	tile.parent.append(tile.moveIcon);
}

Tile.prototype.handleMoveMouseOut = function(e) {
	var tile = e.data.tile;

	tile.moveIcon.remove();
	tile.moveIcon = null;
}

// removes ALL the move related mouse functions attached to the tile
Tile.prototype.removeMoveMouseOver = function(e) {
	var tile = e.data.tile;

	if (tile.moveIcon != null) {
		tile.handleMoveMouseOut({"data": {"tile": tile}});
	}

	// now remove all the event listeners we setup
	tile.parent.off("mouseenter", tile.handleMoveMouseOver);
	tile.parent.off("mouseleave", tile.handleMoveMouseOut);
	tile.parent.off("click", "*", tile.handleMoveMouseClick);		
}

Tile.prototype.handleMoveMouseClick = function(e) {
	var tile = e.data.tile;
	var callback = e.data.callback;

	tile.removeMoveMouseOver({"data": {"tile": tile}});
	callback(tile);	
}

Tile.prototype.addMoveIcon = function() {
	this.footprintIcon = $("<img src='img/footprint.png' width='50' height='50'>");
	this.footprintIcon.attr("class", "characterTile");
	this.parent.append(this.footprintIcon);
}

Tile.prototype.removeMoveIcon = function() {
	if (this.footprintIcon != null) {
		this.footprintIcon.remove();
		this.footprintIcon = null;
	}
}
