const { Router } = require('express');
const { createRecipe, getUserRecipes, getUserRecipeByID, createUser, userLogin, deleteRecipe, updateRecipe } = require('../../controllers/controllers');
const { authentication } = require('../../middlewares/authentication');


const userRouter = Router();

// Ruta para crear un nuevo usuario en la BDD
userRouter.post('/register', async (req, res) => {
    const { username , email , password } = req.body;
    try {
        const result = await createUser(req.body);
        res.status(200).send(result);
    } 
    catch (error) {
        res.status(404).send(error.message);
    };
});

// Ruta para loguear un usuario en la BDD
userRouter.post('/login', async (req, res) => {
    const { email , password } = req.body;
    try {
        const result = await userLogin(req.body);
        res.cookie('userId', result.user.id, { maxAge: 1 * 60 * 60 * 1000, httpOnly: true })
        res.status(200).send(result.response);
    } 
    catch (error) {
        res.status(404).send(error.message);
    };
});

// Ruta para cerrar sesion del usuario en la BDD
userRouter.post('/logout', (req, res) => {
    res.clearCookie('userId');
    res.status(200).send(`User loggued out successfully`);
});



// Rutas a la BDD - Recipes

userRouter.post('/recipes', authentication, async (req, res) => {
    try {
        const result = await createRecipe(req.body, req.cookies.userId);
        res.status(200).send(result);
    } 
    catch (error) {
        res.status(404).send(error.message);
    };
});

userRouter.get('/recipes', authentication, async (req, res) => {
    try {
        const { key } = req.query;
        res.status(200).send(await getUserRecipes(key));
    } 
    catch (error) {
        res.status(404).send(error.message);        
    };
});

userRouter.get('/recipes/:id', authentication, async (req, res) => {    
    try {
        const { id } = req.params;
        res.status(200).send(await getUserRecipeByID(id));
    } 
    catch (error) {
        res.status(404).send(error.message);        
    };
});

userRouter.delete('/recipes/:id', authentication, async (req, res) => {
    try {
        const { id } = req.params;
        res.status(200).send(await deleteRecipe(id));
    } 
    catch (error) {
        res.status(404).send(error.message);
    };
});

userRouter.put('/recipes/:id', authentication, async (req, res) => {
    try {
        //  Ej.: req.body = { "atributte" : "title" ,	"value" : "Pollo al horno con papas" }
        const { id } = req.params;
        const { atributte , value } = req.body;
        res.status(200).send(await updateRecipe(id, atributte , value));
    } 
    catch (error) {
        res.status(404).send(error.message);
    };
});


module.exports = userRouter;
