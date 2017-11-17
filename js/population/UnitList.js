UnitList = {}; 

UnitList.HG = {
	'id': 'HG',
	'name': "Hunter Gatherers",
	'consumeResources': [
		[{'type': ItemList.Meals.id, 'amount': 1}, {'type': ItemList.Food.id, 'amount': 0.1}]],
	'tech': 1,
	'actions': [ActionConst.GatherAction, ActionConst.HuntAction, ActionConst.CookAction, ActionConst.CraftAction],
	'crafts': [ItemList.BasicTool.id, ItemList.Tent.id],
};

UnitList.tribal = {
	'id': 'tribal',
	'name': "Tribal",
	'consumeResources': [
		[{'type': ItemList.Meals.id, 'amount': 1}, {'type': ItemList.Food.id, 'amount': 0.1}], 
		[{'type': ItemList.BasicTool.id, 'amount': 0.1}]
	],
	'tech': 2,
	'actions': [ActionConst.GatherAction, ActionConst.HuntAction, ActionConst.CookAction, ActionConst.CraftAction, ActionConst.EncampAction],
	'crafts': [ItemList.BasicTool.id, ItemList.Tent.id],
	'upgradeReq': [{'type': ItemList.BasicTool.id, 'amount': 1}, {'type': ItemList.Tent.id, 'amount': 1}]
};

UnitList.HG.upgrades = UnitList.tribal.id;
