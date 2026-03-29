export function solveForMacros(recipe, userGoals) {
  // 1. Sum fixed ingredients
  const fixedMacros = { calories: 0, protein: 0, carbs: 0, fat: 0 };
  
  recipe.ingredients.forEach(ing => {
    if (!ing.isFlexible) {
      fixedMacros.calories += ing.macros.cals || 0;
      fixedMacros.protein += ing.macros.p || 0;
      fixedMacros.carbs += ing.macros.c || 0;
      fixedMacros.fat += ing.macros.f || 0;
    }
  });

  // 2. Subtract from userGoals to get deficits
  const deficits = {
    protein: userGoals.protein - fixedMacros.protein,
    carbs: userGoals.carbs - fixedMacros.carbs,
    fat: userGoals.fat - fixedMacros.fat,
  };

  // 3. Loop through flexible ingredients
  const calculatedIngredients = recipe.ingredients.map(ing => {
    if (!ing.isFlexible || !ing.targetMacro) {
      // Return fixed as is
      return { 
        ...ing, 
        amount: ing.amount || ing.baseAmount || 0,
        calculatedMacros: { ...ing.macros }
      };
    }

    // Flexible ingredient
    const targetMacroType = ing.targetMacro; // 'protein', 'carbs', or 'fat'
    let deficit = deficits[targetMacroType] || 0;
    
    // Failsafe: if deficit is negative, floor at 0
    if (deficit < 0) deficit = 0;

    const baseMacroKey = targetMacroType === 'protein' ? 'p' : targetMacroType === 'carbs' ? 'c' : 'f';
    const baseMacroValue = ing.macros[baseMacroKey] || 1;
    
    // Failsafe against division by zero
    const safeBaseMacro = baseMacroValue > 0 ? baseMacroValue : 1; 

    const baseAmount = ing.amount || ing.baseAmount || 1;

    // Calculate exact amount
    const requiredAmount = (deficit / safeBaseMacro) * baseAmount;

    // Failsafe floor
    const finalAmount = Math.max(0, requiredAmount);
    
    // Calculate new macros
    const multiplier = finalAmount / baseAmount;
    const newMacros = {
      cals: (ing.macros.cals || 0) * multiplier,
      p: (ing.macros.p || 0) * multiplier,
      c: (ing.macros.c || 0) * multiplier,
      f: (ing.macros.f || 0) * multiplier,
    };

    return {
      ...ing,
      amount: Math.round(finalAmount),
      rawAmount: finalAmount, // keep precision
      calculatedMacros: newMacros
    };
  });

  return calculatedIngredients;
}
