export const COOKBOOK = [
  {
    id: "meal_001",
    title: "Classic Chicken & Rice Bowl",
    emoji: "🍗",
    time: "20 min",
    difficulty: "Easy",
    tag: "High Protein",
    description: "The gold standard of fitness meals. Clean, easily digestible, and highly scalable.",
    ingredients: [
      { name: "Chicken Breast", amount: 200, unit: "g", macros: { cals: 330, p: 62, c: 0, f: 7 }, step: 50, isFlexible: true, targetMacro: 'protein' },
      { name: "White Rice", amount: 150, unit: "g", macros: { cals: 195, p: 4, c: 42, f: 0 }, step: 50, isFlexible: true, targetMacro: 'carbs' },
      { name: "Broccoli", amount: 100, unit: "g", macros: { cals: 35, p: 3, c: 7, f: 0 }, step: 50, isFlexible: false, targetMacro: null },
      { name: "Olive Oil", amount: 5, unit: "ml", macros: { cals: 40, p: 0, c: 0, f: 4.5 }, step: 5, isFlexible: false, targetMacro: null }
    ]
  },
  {
    id: "meal_002",
    title: "Overnight Pro-Oats",
    emoji: "🥣",
    time: "5 min",
    difficulty: "Easy",
    tag: "Balanced",
    description: "Prepare this the night before for a fast, high-protein morning meal.",
    ingredients: [
      { name: "Rolled Oats", amount: 50, unit: "g", macros: { cals: 190, p: 7, c: 34, f: 3.5 }, step: 10, isFlexible: true, targetMacro: 'carbs' },
      { name: "Whey Protein", amount: 30, unit: "g", macros: { cals: 120, p: 24, c: 3, f: 1 }, step: 15, isFlexible: true, targetMacro: 'protein' },
      { name: "Almond Milk", amount: 150, unit: "ml", macros: { cals: 20, p: 1, c: 1, f: 1.5 }, step: 50, isFlexible: false, targetMacro: null },
      { name: "Chia Seeds", amount: 10, unit: "g", macros: { cals: 48, p: 2, c: 4, f: 3 }, step: 5, isFlexible: true, targetMacro: 'fat' },
      { name: "Blueberries", amount: 50, unit: "g", macros: { cals: 29, p: 0, c: 7, f: 0 }, step: 25, isFlexible: false, targetMacro: null }
    ]
  },
  {
    id: "meal_003",
    title: "Steak & Sweet Potato Mash",
    emoji: "🥩",
    time: "25 min",
    difficulty: "Medium",
    tag: "High Protein",
    description: "A nutrient-dense dinner rich in iron and complex carbohydrates.",
    ingredients: [
      { name: "Lean Sirloin Steak", amount: 180, unit: "g", macros: { cals: 330, p: 39, c: 0, f: 18 }, step: 30, isFlexible: true, targetMacro: 'protein' },
      { name: "Sweet Potato", amount: 200, unit: "g", macros: { cals: 172, p: 3, c: 40, f: 0 }, step: 50, isFlexible: true, targetMacro: 'carbs' },
      { name: "Asparagus", amount: 85, unit: "g", macros: { cals: 17, p: 2, c: 3, f: 0 }, step: 25, isFlexible: false, targetMacro: null },
      { name: "Butter", amount: 7, unit: "g", macros: { cals: 50, p: 0, c: 0, f: 6 }, step: 7, isFlexible: false, targetMacro: null }
    ]
  },
  {
    id: "meal_004",
    title: "Turkey Quinoa Peppers",
    emoji: "🫑",
    time: "35 min",
    difficulty: "Medium",
    tag: "Balanced",
    description: "Bell peppers loaded with lean ground turkey, tri-color quinoa, and black beans.",
    ingredients: [
      { name: "Ground Turkey (93%)", amount: 150, unit: "g", macros: { cals: 225, p: 28, c: 0, f: 12 }, step: 50, isFlexible: true, targetMacro: 'protein' },
      { name: "Cooked Quinoa", amount: 100, unit: "g", macros: { cals: 120, p: 4, c: 21, f: 2 }, step: 50, isFlexible: true, targetMacro: 'carbs' },
      { name: "Bell Pepper", amount: 2, unit: "pcs", macros: { cals: 48, p: 2, c: 11, f: 0 }, step: 1, isFlexible: false, targetMacro: null },
      { name: "Black Beans", amount: 50, unit: "g", macros: { cals: 65, p: 4, c: 12, f: 0 }, step: 25, isFlexible: false, targetMacro: null }
    ]
  },
  {
    id: "meal_005",
    title: "Shrimp Zucchini Pasta",
    emoji: "🍤",
    time: "15 min",
    difficulty: "Easy",
    tag: "Low Carb",
    description: "Spiralized zucchini tossed with garlic shrimp and a light olive oil drizzle.",
    ingredients: [
      { name: "Shrimp", amount: 150, unit: "g", macros: { cals: 128, p: 30, c: 0, f: 1 }, step: 50, isFlexible: true, targetMacro: 'protein' },
      { name: "Zucchini", amount: 200, unit: "g", macros: { cals: 34, p: 2, c: 6, f: 1 }, step: 50, isFlexible: false, targetMacro: null },
      { name: "Olive Oil", amount: 10, unit: "ml", macros: { cals: 80, p: 0, c: 0, f: 9 }, step: 5, isFlexible: false, targetMacro: null },
      { name: "Cherry Tomatoes", amount: 50, unit: "g", macros: { cals: 9, p: 0, c: 2, f: 0 }, step: 25, isFlexible: false, targetMacro: null }
    ]
  },
  {
    id: "meal_006",
    title: "Beef & Broccoli Stir Fry",
    emoji: "🥢",
    time: "20 min",
    difficulty: "Medium",
    tag: "Low Carb",
    description: "Tender sirloin strips with crispy broccoli florets over cauliflower rice.",
    ingredients: [
      { name: "Lean Sirloin Steak", amount: 150, unit: "g", macros: { cals: 270, p: 33, c: 0, f: 15 }, step: 50, isFlexible: true, targetMacro: 'protein' },
      { name: "Broccoli", amount: 150, unit: "g", macros: { cals: 52, p: 4, c: 10, f: 0 }, step: 50, isFlexible: false, targetMacro: null },
      { name: "Soy Sauce", amount: 15, unit: "ml", macros: { cals: 8, p: 1, c: 1, f: 0 }, step: 5, isFlexible: false, targetMacro: null },
      { name: "Cauliflower Rice", amount: 150, unit: "g", macros: { cals: 35, p: 3, c: 7, f: 0 }, step: 50, isFlexible: false, targetMacro: null }
    ]
  },
  {
    id: "meal_007",
    title: "Tuna Avocado Wraps",
    emoji: "🥬",
    time: "10 min",
    difficulty: "Easy",
    tag: "Low Carb",
    description: "Crisp butter lettuce cups filled with tuna, mashed avocado, and spicy mayo.",
    ingredients: [
      { name: "Canned Tuna", amount: 120, unit: "g", macros: { cals: 110, p: 25, c: 0, f: 1 }, step: 30, isFlexible: true, targetMacro: 'protein' },
      { name: "Avocado", amount: 50, unit: "g", macros: { cals: 80, p: 1, c: 4, f: 7 }, step: 25, isFlexible: true, targetMacro: 'fat' },
      { name: "Butter Lettuce", amount: 4, unit: "pcs", macros: { cals: 10, p: 1, c: 2, f: 0 }, step: 2, isFlexible: false, targetMacro: null },
      { name: "Sriracha Mayo", amount: 15, unit: "g", macros: { cals: 50, p: 0, c: 1, f: 5 }, step: 5, isFlexible: false, targetMacro: null }
    ]
  },
  {
    id: "meal_008",
    title: "Tofu & Edamame Power Bowl",
    emoji: "🥗",
    time: "20 min",
    difficulty: "Easy",
    tag: "High Carb",
    description: "A plant-based powerhouse featuring crispy tofu, edamame, and jasmine rice.",
    ingredients: [
      { name: "Firm Tofu", amount: 200, unit: "g", macros: { cals: 288, p: 32, c: 6, f: 18 }, step: 50, isFlexible: true, targetMacro: 'protein' },
      { name: "Edamame", amount: 100, unit: "g", macros: { cals: 121, p: 12, c: 10, f: 5 }, step: 50, isFlexible: false, targetMacro: null },
      { name: "White Rice", amount: 100, unit: "g", macros: { cals: 130, p: 3, c: 28, f: 0 }, step: 50, isFlexible: true, targetMacro: 'carbs' },
      { name: "Sesame Seeds", amount: 5, unit: "g", macros: { cals: 29, p: 1, c: 1, f: 2 }, step: 5, isFlexible: false, targetMacro: null }
    ]
  },
  {
    id: "meal_009",
    title: "Cottage Cheese & Berries",
    emoji: "🍓",
    time: "2 min",
    difficulty: "Easy",
    tag: "High Protein",
    description: "The ultimate quick, high-protein snack for busy days.",
    ingredients: [
      { name: "Cottage Cheese (Low Fat)", amount: 200, unit: "g", macros: { cals: 160, p: 22, c: 8, f: 3 }, step: 50, isFlexible: true, targetMacro: 'protein' },
      { name: "Blueberries", amount: 100, unit: "g", macros: { cals: 50, p: 1, c: 12, f: 0 }, step: 50, isFlexible: true, targetMacro: 'carbs' },
      { name: "Almonds", amount: 15, unit: "g", macros: { cals: 86, p: 3, c: 3, f: 7 }, step: 5, isFlexible: true, targetMacro: 'fat' },
      { name: "Honey", amount: 10, unit: "g", macros: { cals: 30, p: 0, c: 8, f: 0 }, step: 5, isFlexible: false, targetMacro: null }
    ]
  },
  {
    id: "meal_010",
    title: "Lemon Herb Salmon",
    emoji: "🍋",
    time: "20 min",
    difficulty: "Medium",
    tag: "High Protein",
    description: "A fresh, zesty salmon fillet baked alongside crisp asparagus spears.",
    ingredients: [
      { name: "Salmon Fillet", amount: 180, unit: "g", macros: { cals: 374, p: 36, c: 0, f: 23 }, step: 30, isFlexible: true, targetMacro: 'protein' },
      { name: "Asparagus", amount: 150, unit: "g", macros: { cals: 30, p: 3, c: 6, f: 0 }, step: 50, isFlexible: false, targetMacro: null },
      { name: "Lemon", amount: 0.5, unit: "pcs", macros: { cals: 6, p: 0, c: 2, f: 0 }, step: 0.5, isFlexible: false, targetMacro: null },
      { name: "Olive Oil", amount: 5, unit: "ml", macros: { cals: 40, p: 0, c: 0, f: 4.5 }, step: 5, isFlexible: false, targetMacro: null }
    ]
  }
];