import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/random-cocktail", async (req, res) => {
  try {
    const response = await axios.get(
      "https://www.thecocktaildb.com/api/json/v1/1/random.php"
    );
    const cocktail = response.data.drinks[0];
    res.json({
      name: cocktail.strDrink,
      image: cocktail.strDrinkThumb,
      instructions: cocktail.strInstructions,
      ingredients: getIngredients(cocktail),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch cocktail" });
  }
});

function getIngredients(cocktail) {
  const ingredients = [];
  for (let i = 1; i <= 15; i++) {
    if (cocktail[`strIngredient${i}`]) {
      ingredients.push(
        `${cocktail[`strIngredient${i}`]} - ${cocktail[`strMeasure${i}`]}`
      );
    }
  }
  return ingredients;
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
