const { Router } = require('express');
const { getAllRecipes, getFilteredRecipe, getRecipeById, createRecipe, getDiets, createDiets } = require('../../controllers/controllers');
const { Diet , Op } = require('../../db');


const dietsRouter = Router();

// Rutas a la BDD - Diets

dietsRouter.get('/', async (req, res) => {
    try {
        res.status(200).send(await getDiets());
    } catch (error) {
        res.status(404).send(error.message);
    };
});

module.exports = dietsRouter;