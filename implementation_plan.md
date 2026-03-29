# Overhaul Scaling Logic to Reverse Target Solving

We will modify the application architecture from 'forward scaling' to 'reverse target solving'. The application will now dynamically size components of recipes to automatically hit users' macro requirements.

## Proposed Changes

### 1. Schema Update (`src/data/cookbook.js`)
We will iterate through all meals in the `COOKBOOK` array and inject `isFlexible` and `targetMacro` options.
- Base ingredients/staples (Sweet Potato, Chicken, Shrimp, Rice) will receive `isFlexible: true` along with their designated `targetMacro` ('protein', 'carbs', or 'fat').
- Seasonings, oils, small veggies, and accents (Olive Oil, Butter, Spinach) will receive `isFlexible: false`.

#### [MODIFY] cookbook.js

### 2. The Math Engine (`src/utils/mathEngine.js`)
Create the new calculation utility.

#### [NEW] mathEngine.js
- `solveForMacros(recipe, userGoals)`
- The algorithm:
  1. Calculate the fixed macro baseline by summing macros of `isFlexible === false` ingredients.
  2. Compute macro deficits (`userGoals - fixedMacroBaseline`). Negative deficits default to 0.
  3. Loop through `isFlexible === true` ingredients. For each, apply the formula `Required Amount = (Deficit / Base Macro of Ingredient) * Base Amount`.
  4. Recalculate and scale the macros of these flexible ingredients accurately based on the new multiplier. 
  5. Return the new calculated ingredient array.

### 3. UI Integration (`src/App.jsx` & `src/components/RecipeModal.jsx`)

#### [MODIFY] App.jsx
- Pass the global `macroGoals` state down to `RecipeModal`.

#### [MODIFY] RecipeModal.jsx
- Remove manual `+` and `-` stepper buttons.
- Call the `solveForMacros` math engine on mount/render to generate `calculatedIngredients`.
- Update the UI to render the calculated amounts.

## Open Questions

> [!WARNING]
> By running the single-meal reverse target solver directly against the global `macroGoals` (e.g., 2100 Calories, 150g Protein), the calculated recipe size will attempt to fulfill the user's *entire daily macro target in a single meal*, meaning portions might be extremely large. Should I slice these global goals by standard meal portions (e.g. `userGoals.protein / 3` for 3 meals), or strictly scale to hit 100% of the daily targets per the original request instructions?

## Verification Plan

### Automated/Mathematical Verification
- Write logic to test resolving a standard recipe against specific targets. 
- Ensure negative deficit constraints successfully floor ingredients to `0` without causing crashes.

### Manual UI Verification
- Open the application and launch the `RecipeModal` on a meal.
- Observe that the calculation engine automatically displays the correct calculated values on UI pop without manual interventions.
- Inspect the calculated overall macros and ensure they align with the expected outputs.
