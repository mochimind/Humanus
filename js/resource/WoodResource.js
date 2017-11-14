
function WoodResource(amount) {
	Resource.call(this, amount);
}

WoodResource.prototype = Object.create(Resource.prototype);
WoodResource.prototype.constructor = WoodResource;

WoodResource.prototype.getType = function() {
	return ResourceConst.woodType;
}

WoodResource.prototype.loadInfo = function() {
	$("#woodAmount").text(Math.floor(this.amount));
}
