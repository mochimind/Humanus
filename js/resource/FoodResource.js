
function FoodResource(amount) {
	Resource.call(this, amount);
}

FoodResource.prototype = Object.create(Resource.prototype);
FoodResource.prototype.constructor = FoodResource;

FoodResource.prototype.getType = function() {
	return ResourceConst.foodType;
}

FoodResource.prototype.loadInfo = function() {
	$("#foodAmount").text(Math.floor(this.amount));
}
