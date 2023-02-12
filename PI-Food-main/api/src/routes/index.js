const { Router } = require('express');

const recipesRouter = require('./routesHandlers/recipesRouter');
const userRouter = require('./routesHandlers/userRouter');
const dietsRouter = require('./routesHandlers/dietsRouter');

// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();

// Rutas a la BDD - Dietas

router.use('/diets', dietsRouter);

// Rutas a la BDD - Recetas creadas por el usuario

router.use('/user', userRouter);

// Rutas a la API Externa 

router.use('/recipes', recipesRouter);

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);


module.exports = router;
