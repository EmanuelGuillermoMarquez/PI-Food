const { Router } = require('express');
const { getAllRecipes, getFilteredRecipe, getRecipeById, createRecipe } = require('../../controllers/controllers');
const { Recipe , Diet , Op } = require('../../db');

const recipesRouter = Router();

// Rutas a todas las recetas - API Externa y BDD Recipes

recipesRouter.get('/', async (req, res) => {
    try {
        const { name } = req.query;
        res.status(200).send(await getAllRecipes(name));
    } 
    catch (error) {
        res.status(404).send(error.message);
    }
});

recipesRouter.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if(!id) throw new Error('Invalid ID');
        res.status(200).send(await getRecipeById(id));
    } 
    catch (error) {
        res.status(404).send(error.message);
    };
});

module.exports = recipesRouter;