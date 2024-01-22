import { IngredientType } from "@/schemas/Ingredient/Ingredient.type";
import { IngredientTagsType } from "@/schemas/IngredientTag/IngredientTag.type";

export const addTagToIngredient = (ingredientsList: IngredientType[], ingredientId: number, tagToAdd: IngredientTagsType): IngredientType[] => (
  ingredientsList.map((ingredient) => {
    if(ingredient.id === ingredientId) {
      const changedIngredient = structuredClone(ingredient)
      changedIngredient.ingredientTags.push(tagToAdd)

      return changedIngredient
    }

    return ingredient
}))

export const removeTagFromIngredient = (ingredientsList: IngredientType[], ingredientId: number, ingredientTagId: number): IngredientType[] => (ingredientsList.map((ingredient) => {
  if(ingredient.id === ingredientId) {
    const changedIngredient = structuredClone(ingredient)
    const newIngredientTags = changedIngredient.ingredientTags.filter(({ id }) => id !== ingredientTagId)
    return {...changedIngredient, ingredientTags: newIngredientTags}
  }

  return ingredient
}))