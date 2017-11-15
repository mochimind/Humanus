ItemList = {};

// work is the amount of work required to produce a unit, components is the resources required to make it
// perish is what percentage of the resource will disappear each turn
ItemList.Food = {'id': 'Food', 'name': 'Food', 'icon': "img/food.png"};
ItemList.Wood = {'id': 'Wood', 'name': 'Wood', 'icon': "img/wood.png"};
ItemList.Hides = {'id': 'Hides', 'name': 'Hides', 'icon': 'img/hides.png'};
ItemList.Meals = {'id': 'Meals', 'name': 'Meals', 'perish': 1}
ItemList.BasicTool = {'id': 'BasicTool', 'name': 'Basic Tool', 'work': 1, 'components': [], 'icon': "img/basic_tool.jpg"};
ItemList.Tent = {'id': 'Tent', 'name': 'Tent', 'work': 20, 'components': [{'id': ItemList.Hides.id, 'amount': 5} , {'id': ItemList.Wood.id, 'amount': 3}], 'icon': "img/tent.png"};

