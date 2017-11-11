var Util = {};

Util.Init = function() {
	Util.blinking = false
	Util.blinkTile = $("<img src='img/gray.jpg'>");

	$(document).keydown(Util.HandleKeyPress);
}

Util.HandleBlink = function() {
	if (Util.blinking) {
		Util.blinkTile.remove();
		Map.curTile.children().show();
		Util.blinking = false;
	} else {
		Map.curTile.children().hide();
		Map.curTile.append(Util.blinkTile);
		Util.blinking = true;
	}
}

Util.StopBlink = function() {
	clearInterval(Util.blinkInterval);
	Util.BlinkInterval = null;

	// make sure we're not showing the grayed out square but the actual tile images
	if (Util.blinking) {
		Util.HandleBlink();
	}
}

Util.StartBlink = function() {
	Util.HandleBlink();
	if (Util.blinkInterval != null) {
		Util.StopBlink();
	}
	Util.blinkInterval = window.setInterval(Util.HandleBlink, 1000);
}

Util.HandleKeyPress = function (e) {
	if(e.keyCode == 37) {
		// up button
		Map.NavigateUp();
	} else if (e.keyCode == 38) {
		// up button
		Map.NavigateLeft();
	} else if (e.keyCode == 39) {
		// down button
		Map.NavigateDown();
	} else if (e.keyCode == 40) {
		// right button
		Map.NavigateRight();
	}
}

