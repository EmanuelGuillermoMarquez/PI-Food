const { Router } = require('express');
const { getAllRecipes, getFilteredRecipe, getRecipeById, createRecipe, getUserRecipes, getUserRecipeByID } = require('../../controllers/controllers');
const { Recipe , Diet , Op } = require('../../db');


const userRouter = Router();

// Rutas a la BDD - Recipes

userRouter.get('/recipes', async (req, res) => {
    try {
        const { name } = req.query;
        res.status(200).send(await getUserRecipes(name));
    } 
    catch (error) {
        res.status(404).send(error.message);        
    };
});

userRouter.get('/recipes/:id', async (req, res) => {    
    try {
        const { id } = req.params;
        res.status(200).send(await getUserRecipeByID(id));
    } 
    catch (error) {
        res.status(404).send(error.message);        
    };
});

userRouter.post('/recipes', async (req, res) => {
    try {
        const result = await createRecipe(req.body);
        res.status(201).send(result);
    } 
    catch (error) {
        res.status(404).send(error.message);
    };
});


module.exports = userRouter;
