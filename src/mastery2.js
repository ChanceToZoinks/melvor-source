"use strict";
const masteryCheckpoints = [10, 25, 50, 95];
function sortRecipesByCategoryAndLevel(recipes, categories) {
  const categoryOrder = new Map();
  categories.forEach((category, i) => categoryOrder.set(category, i));
  recipes.sort((a, b) => {
    if (a.category === b.category) {
      return a.level - b.level;
    } else {
      return categoryOrder.get(a.category) - categoryOrder.get(b.category);
    }
  });
  return recipes;
}
class MasteryAction extends NamespacedObject {}
class DummyMasteryAction extends MasteryAction {
  get name() {
    return `ERROR: INVALID MASTERY`;
  }
  get media() {
    return cdnMedia("assets/media/main/question.svg");
  }
  constructor(namespace, id) {
    super(namespace, id);
  }
}
