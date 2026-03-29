const APP_ID = import.meta.env.VITE_EDAMAM_APP_ID;
const APP_KEY = import.meta.env.VITE_EDAMAM_APP_KEY;
const BASE_URL = "https://api.edamam.com/api/recipes/v2?type=public";

export const fetchEdamamRecipes = async (query = "healthy", count = 5) => {
  try {
    console.log(`Fetching from Edamam with query: ${query}...`);
    
    const response = await fetch(
      `${BASE_URL}&q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}&random=true`,
      {
        // NEW: We are passing the required header to bypass the 401 error
        headers: {
          "Accept": "application/json",
          "Edamam-Account-User": "SouringEguls" // You can replace this with your Edamam account email if you prefer
        }
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error(`Edamam Error ${response.status}:`, errText);
      throw new Error(`Edamam API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Success! Raw Edamam Data received:", data);

    if (!data.hits || data.hits.length === 0) {
      console.warn("Edamam returned empty hits array. Check your search query.");
      return null;
    }

    const parsedRecipes = data.hits.slice(0, count).map(hit => mapEdamamRecipe(hit.recipe));
    console.log("Successfully mapped recipes for UI:", parsedRecipes);
    
    return parsedRecipes;
    
  } catch (error) {
    console.error("Fetch function caught an error:", error);
    return null; 
  }
};

const mapEdamamRecipe = (recipe) => {
  // Defensive math: default to 1 serving if yield is 0 or missing
  const servings = recipe.yield > 0 ? recipe.yield : 1; 
  
  // Aggressive optional chaining (?.) prevents crashes if a nutrient is missing
  const calories = Math.round((recipe.calories || 0) / servings);
  const protein = Math.round((recipe.totalNutrients?.PROCNT?.quantity || 0) / servings);
  const carbs = Math.round((recipe.totalNutrients?.CHOCDF?.quantity || 0) / servings);
  const fat = Math.round((recipe.totalNutrients?.FAT?.quantity || 0) / servings);

  let tag = "Balanced";
  if (protein > 30) tag = "High Protein";
  else if (carbs < 20) tag = "Low Carb";
  else if (carbs > 50) tag = "High Carb";

  // Safely extract the ID from the massive URI string
  const extractedId = recipe.uri ? recipe.uri.split("recipe_")[1] : Math.random().toString(36).substring(7);

  return {
    id: extractedId, 
    title: recipe.label || "Unknown Recipe",
    time: recipe.totalTime > 0 ? `${recipe.totalTime} min` : "30 min",
    image: recipe.image || "", 
    calories,
    protein,
    carbs,
    fat,
    tag,
    description: `A delicious ${recipe.cuisineType?.[0] || 'healthy'} meal perfect for your diet goals.`,
    
    // Safely map ingredients
    ingredients: (recipe.ingredients || []).map(ing => ({
      amount: ing.quantity > 0 ? Number(ing.quantity.toFixed(1)) : "", 
      unit: ing.measure && ing.measure !== "<unit>" ? ing.measure : "",
      name: ing.food || ing.text || "Unknown ingredient",
    })),
    
    difficulty: recipe.totalTime > 0 && recipe.totalTime <= 20 ? "Easy" : recipe.totalTime <= 45 ? "Medium" : "Hard",
  };
};