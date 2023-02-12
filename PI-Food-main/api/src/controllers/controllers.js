const { Recipe , Diet , Op } = require('../db');
const axios = require('axios');
require('dotenv').config();
const { API_KEY2 } = process.env;

// Controllers para requerir la información a la API y devolver con la info de la BDD

const getAllRecipes = async (value) => {
    // Traemos las recetas de la API
    let result = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY2}`)
        .then((res) => res.data.results)
        .catch((err) => console.log(err));

    // Filtrado del resultado si se le pasa query
    if(value) result = result.filter((item) => item.title.toLowerCase().includes(value));

    // Traemos las recetas del usuario y las agregamos al resultado
    try {
        const userResult = await getUserRecipes(value);
        if(userResult.length) userResult.forEach((item) => result.unshift(item));
    } 
    catch (error) {
        console.log(error.message);
    };
    // Lanzamos una exepción si no se encuentran recetas
    if(!result.length) throw new Error(`Recipe ${value} not found`);
    return result;
};

const getRecipeById = async (id) => {
    try {
        // Traemos las recetas de la API por su id
        const result = await axios.get(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY2}`)
            .then((res) => res.data)
            .catch((err) => {
                console.log(err);
                throw new Error(`A recipe with the id ${id} does not exist`);
            });
        // Filtramos la info que queremos recibir  
        const recipe = {
            title: result.title,
            image: result.image,
            summary: result.summary,
            dietTypes: {
                diets: result.diets,
                vegetarian: result.vegetarian,
                vegan: result.vegan, 
                glutenFree: result.glutenFree
            },
            ingredients: result.extendedIngredients.map((item) => item.name)
        };
        return recipe;
    } 
    catch (error) {
        console.log(error.message);
    }
    // Buscamos las recetas del usuario por el id ingresado
    try {
        return await getUserRecipeByID(id);
    } 
    catch (error) {
        console.log(error.message);
    };
    // Si ningun try resulta ser positivo se arroja el error
    throw new Error(`A recipe with the id ${id} does not exist`);
};

// Controllers para manipular solo la BDD

const getUserRecipes = async (value) => {
    if(!value) {
        const result = await Recipe.findAll({attributes: {exclude: ['instructions']}});
        if(!result.length) throw new Error(`User recipes not found`);
        return result;
    };

    const result = await Recipe.findAll({
        where: { 
            name:  {
                [Op.iLike] : `%${value}%`
            } 
        }, attributes: {exclude: ['instructions']}
    });

    if(!result.length) throw new Error(`User recipe ${value} not found`);

    return result;
};

const getUserRecipeByID = async (id) => {
    if(!id) throw new Error(`Wrong ID`);

    const result = await Recipe.findByPk(id, {
        attributes: ['name', 'summary', 'health_score', 'instructions'],
        include: {
            model: Diet,
            through: { attributes: [] }          
        }
    });

    if(!result) throw new Error(`User recipe ${id} not found`);

    return result;
};

const createRecipe = async (data) => {
    const { name , summary , health_score , instructions , diets } = data;
    // <diets> tiene que ser un array con el nombre de cada dieta
    
    if(!name || !summary) throw new Error('Falta enviar datos obligatorios');
  
    try {
        const dietsID = await Diet.findAll({
            where: {
                name: diets
            }
        }, {
            attributes: ['id']
        });
        // ['nombre de dieta', 'nombre de dieta'] => [ id, id ]
        
        const newRecipe = await Recipe.create({ name, summary, health_score, instructions });
        await newRecipe.addDiets(dietsID);
        return newRecipe;
    } 
    catch (error) {
        console.log(error);
        throw new Error('Error en alguno de los datos provistos');
    };
};

const getDiets = async () => {
    const result = await Diet.findAll();
    if(!result.length) throw new Error('Diets not found'); // Eso no deberia ocurrir nunca
    return result;
};

const createDiets = async () => {
    // Esta funcion debe ejecutarse automaticamente al levantar el server para precargar la tabla de dietas en la BDD

    const diets = [{name: 'Gluten Free'}, {name: 'Ketogenic'}, {name: 'Vegetarian'}, {name: 'Lacto-Vegetarian'}, {name: 'Ovo-Vegetarian'}, {name: 'Vegan'}, {name: 'Pescetarian'}, {name: 'Paleo'}, {name: 'Primal'}, {name: 'Low FODMAP'}, {name: 'Whole30'}];

    return await Diet.bulkCreate(diets);
};


module.exports = {
    getAllRecipes,
    getRecipeById,
    getUserRecipes,
    getUserRecipeByID,
    createRecipe,
    getDiets,
    createDiets
};


