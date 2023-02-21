const { Router } = require('express');
const { getAllRecipes, getRecipeById } = require('../../controllers/controllers');


const recipesRouter = Router();

// Rutas a todas las recetas - API Externa y BDD Recipes

recipesRouter.get('/', async (req, res) => {
    try {
        const { key } = req.query;                             //recipes?key=xxx
        res.status(200).send(await getAllRecipes(key));
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