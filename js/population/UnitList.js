UnitList = {}; 

UnitList.HG = {
	'id': 'HG',
	'name': "Hunter Gatherers",
	'consumeResources': [
		[{'type': ItemList.Meals.id, 'amount': 1}, {'type': ItemList.Food.id, 'amount': 0.1}]],
	'tech': 1,
	'actions': [ActionConst.GatherAction, ActionConst.HuntAction, ActionConst.CookAction, ActionConst.CraftAction],
	'crafts': [ItemList.BasicTool.id, ItemList.Tent.id]
};

