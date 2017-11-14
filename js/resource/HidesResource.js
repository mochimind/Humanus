
function HidesResource(amount) {
	Resource.call(this, amount);
}

HidesResource.prototype = Object.create(Resource.prototype);
HidesResource.prototype.constructor = HidesResource;

HidesResource.prototype.getType = function() {
	return ResourceConst.hidesType;
}

HidesResource.prototype.loadInfo = function() {
	$("#hidesAmount").text(Math.floor(this.amount));
}
