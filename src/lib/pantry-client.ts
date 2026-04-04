const BASE = (import.meta.env.PANTRY_API_URL || "http://localhost:8787").replace(/\/$/, "");

async function pantryFetch<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: body ? "POST" : "GET",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let msg = `${res.status} ${res.statusText}`;
    try {
      const data = await res.json();
      msg = data?.error?.message || msg;
    } catch {}
    throw new Error(`PantrySDK error: ${msg}`);
  }

  return res.json() as Promise<T>;
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

export interface RecipeSummary {
  id: string;
  name: string;
  servings: number;
}

export interface RecipeDetail extends RecipeSummary {
  notes?: string[];
  steps?: string[];
  ingredients: Ingredient[];
}

export interface ScaledRecipe {
  recipeId: string;
  recipeName: string;
  originalServings: number;
  targetServings: number;
  factor: number;
  ingredients: Ingredient[];
}

export interface ShoppingListResult {
  recipeIds: string[];
  items: Ingredient[];
}

export interface SubstituteResult {
  ingredient: string;
  substitutions: string[];
}

export interface MealPlanResult {
  mealPlan: { recipeId: string; recipeName: string; servings: number }[];
  shoppingList: Ingredient[];
  prepSummary: { recipeCount: number; totalUniqueIngredients: number };
}

export const listRecipes = () => pantryFetch<{ recipes: RecipeSummary[] }>("/recipes");
export const getRecipe = (id: string) => pantryFetch<RecipeDetail>(`/recipe/${id}`);
export const scaleRecipe = (recipeId: string, targetServings: number) =>
  pantryFetch<ScaledRecipe>("/scale-recipe", { recipeId, targetServings });
export const shoppingList = (recipeIds: string[]) =>
  pantryFetch<ShoppingListResult>("/shopping-list", { recipeIds });
export const substitute = (ingredient: string) =>
  pantryFetch<SubstituteResult>("/substitute", { ingredient });
export const planMeal = (recipes: { recipeId: string; servings: number }[]) =>
  pantryFetch<MealPlanResult>("/plan-meal", { recipes });
