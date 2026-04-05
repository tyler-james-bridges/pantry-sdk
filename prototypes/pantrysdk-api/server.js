require('dotenv').config();

const express = require('express');
const fs = require('fs');
const path = require('path');
let paymentMiddleware = null;
try {
  ({ paymentMiddleware } = require('x402-express'));
} catch {
  // x402 optional during local dev until dependency is installed
}

const app = express();
app.use(express.json());

const recipes = JSON.parse(fs.readFileSync(path.join(__dirname, 'recipes.json'), 'utf8'));

const x402Enabled = Boolean(paymentMiddleware && process.env.X402_PAY_TO);
const botOnlyMode = String(process.env.BOT_ONLY_MODE || 'false').toLowerCase() === 'true';

function isLikelyBotRequest(req) {
  const ua = String(req.headers['user-agent'] || '').toLowerCase();
  const botHints = [
    'bot', 'crawler', 'spider', 'gpt', 'openai', 'claude', 'anthropic',
    'perplexity', 'bytespider', 'facebookexternalhit', 'slurp', 'bingpreview'
  ];
  return botHints.some(h => ua.includes(h));
}

if (x402Enabled) {
  const x402Gate = paymentMiddleware({
    network: process.env.X402_NETWORK || 'base-sepolia',
    payTo: process.env.X402_PAY_TO,
    resources: [
      {
        path: '/shopping-list',
        method: 'POST',
        price: '$0.01',
        name: 'PantrySDK Shopping List',
        description: 'Aggregate ingredients across selected recipes'
      },
      {
        path: '/substitute',
        method: 'POST',
        price: '$0.01',
        name: 'PantrySDK Substitute',
        description: 'Ingredient substitutions with profile-aware options'
      },
      {
        path: '/plan-meal',
        method: 'POST',
        price: '$0.03',
        name: 'PantrySDK Meal Planner',
        description: 'Build meal plan + combined shopping list'
      },
      {
        path: '/recipe/:id/transform',
        method: 'POST',
        price: '$0.02',
        name: 'PantrySDK Recipe Transform',
        description: 'Transform recipe for dietary profile and constraints'
      },
      {
        path: '/pantry-match',
        method: 'POST',
        price: '$0.02',
        name: 'PantrySDK Pantry Match',
        description: 'Match pantry ingredients to best recipes'
      },
      {
        path: '/leftovers-remix',
        method: 'POST',
        price: '$0.02',
        name: 'PantrySDK Leftovers Remix',
        description: 'Remix leftovers into recommended meal ideas'
      },
      {
        path: '/batch-prep',
        method: 'POST',
        price: '$0.04',
        name: 'PantrySDK Batch Prep',
        description: 'Generate batch-prep schedule and prep blocks'
      }
    ]
  });

  app.use((req, res, next) => {
    if (!botOnlyMode) return x402Gate(req, res, next);
    if (isLikelyBotRequest(req)) return x402Gate(req, res, next);
    return next();
  });
}

app.get('/', (_req, res) => {
  res.json({
    name: 'PantrySDK MVP',
    status: 'ok',
    x402: {
      enabled: x402Enabled,
      network: process.env.X402_NETWORK || 'base-sepolia',
      botOnlyMode
    },
    endpoints: [
      'GET /recipes',
      'GET /recipe/:id',
      'POST /scale-recipe',
      'POST /shopping-list (paid when x402 enabled)',
      'POST /substitute (paid when x402 enabled)',
      'POST /plan-meal (paid when x402 enabled)',
      'POST /recipe/:id/transform (paid when x402 enabled)',
      'POST /pantry-match (paid when x402 enabled)',
      'POST /leftovers-remix (paid when x402 enabled)',
      'POST /batch-prep (paid when x402 enabled)'
    ]
  });
});

const substitutions = {
  egg: ['1 tbsp ground flax + 3 tbsp water', '1/4 cup unsweetened applesauce'],
  butter: ['1:1 coconut oil', '1:1 vegan butter'],
  sugar: ['0.75x honey', '1:1 coconut sugar'],
  milk: ['1:1 oat milk', '1:1 almond milk']
};

function error(res, code, message) {
  return res.status(code).json({ error: { message } });
}

function findRecipe(id) {
  const recipe = recipes.find(r => r.id === id);
  return recipe || null;
}

function scaleRecipe(recipeId, targetServings) {
  const recipe = findRecipe(recipeId);
  if (!recipe) throw new Error(`Recipe not found: ${recipeId}`);
  const factor = targetServings / recipe.servings;
  return {
    recipeId,
    recipeName: recipe.name,
    originalServings: recipe.servings,
    targetServings,
    factor: Number(factor.toFixed(4)),
    ingredients: recipe.ingredients.map(i => ({
      name: i.name,
      amount: Number((i.amount * factor).toFixed(3)),
      unit: i.unit
    }))
  };
}

function toBaseUnit(amount, unit) {
  const u = String(unit || '').toLowerCase().trim();
  // Normalize tablespoon into cups so mixed butter/flour entries can merge.
  // Keep teaspoons as-is to avoid unreadable tiny cup decimals.
  if (u === 'tbsp') return { amount: amount / 16, unit: 'cup' };
  return { amount, unit };
}

function shoppingList(recipeIds) {
  const bucket = new Map();
  for (const id of recipeIds) {
    const r = findRecipe(id);
    if (!r) throw new Error(`Recipe not found: ${id}`);
    for (const i of r.ingredients) {
      const base = toBaseUnit(i.amount, i.unit);
      const key = `${i.name}::${base.unit}`;
      bucket.set(key, (bucket.get(key) || 0) + base.amount);
    }
  }

  const items = Array.from(bucket.entries()).map(([key, amount]) => {
    const [name, unit] = key.split('::');
    return { name, amount: Number(amount.toFixed(3)), unit };
  }).sort((a, b) => a.name.localeCompare(b.name));

  return { recipeIds, items };
}

function planMeal(recipeTargets) {
  const scaled = recipeTargets.map(({ recipeId, servings }) => {
    if (!recipeId || !servings || typeof servings !== 'number' || servings <= 0) {
      throw new Error(`Invalid recipe target: ${JSON.stringify({ recipeId, servings })}`);
    }
    return scaleRecipe(recipeId, servings);
  });

  const recipeIds = scaled.map(r => r.recipeId);
  const shopping = shoppingList(recipeIds);

  return {
    mealPlan: scaled.map(r => ({
      recipeId: r.recipeId,
      recipeName: r.recipeName,
      servings: r.targetServings
    })),
    shoppingList: shopping.items,
    prepSummary: {
      recipeCount: scaled.length,
      totalUniqueIngredients: shopping.items.length
    }
  };
}

function transformRecipe(recipeId, opts = {}) {
  const recipe = findRecipe(recipeId);
  if (!recipe) throw new Error(`Recipe not found: ${recipeId}`);

  const servings = Number(opts.servings || recipe.servings);
  const scaled = scaleRecipe(recipeId, servings);

  const profile = String(opts.dietaryProfile || '').toLowerCase();
  const maxSugarCup = typeof opts.maxSugarCup === 'number' ? opts.maxSugarCup : null;

  const transformedIngredients = [];
  const substitutionsApplied = [];

  for (const i of scaled.ingredients) {
    const name = i.name.toLowerCase();
    let ingredient = { ...i };

    if ((profile === 'dairy-free' || profile === 'vegan') && name.includes('butter')) {
      substitutionsApplied.push({ from: i.name, to: 'coconut oil', reason: profile });
      ingredient.name = 'coconut oil';
    }

    if (profile === 'egg-free' || profile === 'vegan') {
      if (name === 'egg' || name.includes('egg')) {
        substitutionsApplied.push({ from: i.name, to: 'flax egg', reason: profile });
        ingredient = { name: 'flax egg (1 tbsp flax + 3 tbsp water)', amount: i.amount, unit: 'count' };
      }
    }

    if (maxSugarCup !== null && name.includes('sugar')) {
      const reduced = Math.min(ingredient.amount, maxSugarCup);
      if (reduced < ingredient.amount) {
        substitutionsApplied.push({ from: i.name, to: `${reduced} cup sugar`, reason: 'maxSugarCup' });
        ingredient.amount = Number(reduced.toFixed(3));
      }
    }

    transformedIngredients.push(ingredient);
  }

  return {
    recipeId,
    recipeName: recipe.name,
    targetServings: servings,
    dietaryProfile: profile || 'none',
    substitutionsApplied,
    ingredients: transformedIngredients,
    notes: recipe.notes || [],
    steps: recipe.steps || []
  };
}

function pantryMatch(pantryItems, limit = 5) {
  const pantry = new Set(pantryItems.map(x => String(x).toLowerCase().trim()));

  const scored = recipes.map(r => {
    const needed = r.ingredients.map(i => i.name.toLowerCase());
    const have = needed.filter(n => pantry.has(n));
    const missing = needed.filter(n => !pantry.has(n));
    const score = needed.length ? have.length / needed.length : 0;

    return {
      recipeId: r.id,
      recipeName: r.name,
      matchScore: Number(score.toFixed(3)),
      haveCount: have.length,
      totalNeeded: needed.length,
      missingIngredients: [...new Set(missing)]
    };
  });

  return scored
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
}

function leftoversRemix(leftovers = [], pantry = []) {
  const items = [...leftovers, ...pantry].map(x => String(x).toLowerCase().trim());
  const matches = pantryMatch(items, 3);

  const quickIdeas = [];
  if (items.includes('rice')) quickIdeas.push('fried rice remix with any leftover protein + vegetables');
  if (items.includes('chicken')) quickIdeas.push('quick chicken salad wrap');
  if (items.includes('bread')) quickIdeas.push('savory bread pudding / strata');
  if (items.includes('egg')) quickIdeas.push('frittata cleanup meal');

  return {
    input: { leftovers, pantry },
    recommendedRecipes: matches,
    quickIdeas: quickIdeas.length ? quickIdeas : ['combine leftovers into a grain bowl with dressing and herbs']
  };
}

function batchPrep(recipeTargets, days = 3) {
  const meal = planMeal(recipeTargets);
  return {
    days,
    mealPlan: meal.mealPlan,
    shoppingList: meal.shoppingList,
    prepBlocks: [
      {
        block: 'Block 1 (30-45 min)',
        tasks: ['wash + pre-chop produce', 'measure dry ingredients', 'preheat oven and prep pans']
      },
      {
        block: 'Block 2 (45-75 min)',
        tasks: ['cook bake-ready recipes in parallel', 'cool and portion into containers']
      },
      {
        block: 'Block 3 (15-20 min)',
        tasks: ['label portions by day', 'store fridge/freezer', 'set reheat notes']
      }
    ]
  };
}

app.get('/recipes', (_req, res) => {
  res.json({ recipes: recipes.map(r => ({ id: r.id, name: r.name, servings: r.servings })) });
});

app.get('/recipe/:id', (req, res) => {
  const recipe = findRecipe(req.params.id);
  if (!recipe) return error(res, 404, 'recipe not found');
  return res.json(recipe);
});

app.post('/scale-recipe', (req, res) => {
  const { recipeId, targetServings } = req.body || {};
  if (!recipeId) return error(res, 400, 'recipeId is required');
  if (!targetServings || typeof targetServings !== 'number' || targetServings <= 0) {
    return error(res, 400, 'targetServings must be a positive number');
  }

  try {
    return res.json(scaleRecipe(recipeId, targetServings));
  } catch (e) {
    return error(res, 404, e.message);
  }
});

app.post('/shopping-list', (req, res) => {
  const { recipeIds } = req.body || {};
  if (!Array.isArray(recipeIds) || recipeIds.length === 0) {
    return error(res, 400, 'recipeIds must be a non-empty array');
  }

  try {
    return res.json(shoppingList(recipeIds));
  } catch (e) {
    return error(res, 404, e.message);
  }
});

app.post('/substitute', (req, res) => {
  const { ingredient } = req.body || {};
  if (!ingredient || typeof ingredient !== 'string') {
    return error(res, 400, 'ingredient is required');
  }

  const key = ingredient.toLowerCase().trim();
  return res.json({ ingredient: key, substitutions: substitutions[key] || [] });
});

app.post('/plan-meal', (req, res) => {
  const { recipes } = req.body || {};
  if (!Array.isArray(recipes) || recipes.length === 0) {
    return error(res, 400, 'recipes must be a non-empty array of { recipeId, servings }');
  }

  try {
    return res.json(planMeal(recipes));
  } catch (e) {
    return error(res, 400, e.message);
  }
});

app.post('/recipe/:id/transform', (req, res) => {
  try {
    return res.json(transformRecipe(req.params.id, req.body || {}));
  } catch (e) {
    return error(res, 400, e.message);
  }
});

app.post('/pantry-match', (req, res) => {
  const { pantryItems, limit } = req.body || {};
  if (!Array.isArray(pantryItems) || pantryItems.length === 0) {
    return error(res, 400, 'pantryItems must be a non-empty array');
  }

  return res.json({ matches: pantryMatch(pantryItems, Number(limit) || 5) });
});

app.post('/leftovers-remix', (req, res) => {
  const { leftovers = [], pantry = [] } = req.body || {};
  if (!Array.isArray(leftovers) || !Array.isArray(pantry)) {
    return error(res, 400, 'leftovers and pantry must be arrays');
  }
  return res.json(leftoversRemix(leftovers, pantry));
});

app.post('/batch-prep', (req, res) => {
  const { recipes, days } = req.body || {};
  if (!Array.isArray(recipes) || recipes.length === 0) {
    return error(res, 400, 'recipes must be a non-empty array of { recipeId, servings }');
  }

  try {
    return res.json(batchPrep(recipes, Number(days) || 3));
  } catch (e) {
    return error(res, 400, e.message);
  }
});

const port = process.env.PORT || 8787;
app.listen(port, () => {
  console.log(`PantrySDK MVP running on http://localhost:${port}`);
});
