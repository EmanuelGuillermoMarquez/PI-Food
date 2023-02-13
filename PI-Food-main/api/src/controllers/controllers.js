const { Recipe , Diet , User , Op } = require('../db');
const axios = require('axios');
const { checkPassword } = require('../helpers/encrypter');
require('dotenv').config();
const { API_KEY2 } = process.env;

// Controllers para manipular solo la BDD


const createUser = async (data) => {
    const { username , email , password } = data;
    if(!username || !email || !password) throw new Error('Missing required data');
    const newUser = await User.create(data);
    return newUser;
};

const userLogin = async (data) => {
    const { email , password } = data;
    if(!email || !password) throw new Error('Missing required data');

    const user = await User.findOne({ where: { email } });
    if(!user) throw new Error('Invalid credentials');

    if(checkPassword(password, user.password)) return { response: `${user.username} welcome back`, user};
    else throw new Error('Invalid password');

};

const getUserByID = async (id) =>{
    if(!id || isNaN(id)) throw new Error('Invalid ID');
    const user = await User.findByPk(id);
    return user;
};

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

const createRecipe = async (data, userId) => {
    const { name , summary , health_score , instructions , diets } = data;
    // <diets> tiene que ser un array con el nombre de cada dieta
    
    if(!name || !summary || !userId) throw new Error('Missing required data');
  
    try {
        // ['nombre de dieta', 'nombre de dieta'] => [ id, id ] - Obtenemos los id de las dietas
        const dietsID = await Diet.findAll({
            where: {
                name: diets
            }
        }, {
            attributes: ['id']
        });
        
        const newRecipe = await Recipe.create({ name, summary, health_score, instructions });
        await newRecipe.addDiets(dietsID);
        await newRecipe.setUser(userId);
        return newRecipe;
    } 
    catch (error) {
        throw new Error('Error in any of the data provided');
    };
};

const updateRecipe = async ( id , attribute, value) => {
    try {
        //const { attribute, value } = data
        
        if(!id) throw new Error('Enter Id of recipe');
        
        const recipe = await Recipe.findByPk(id);

        await recipe.set({[attribute]: value});
        await recipe.save();
        
        return `Recipe ${id} successfully updated`;
    } 
    catch (error) {
        throw new Error('Error updating recipe');
    };
};

const deleteRecipe = async (id) => {
    try {
        if(!id) throw new Error('Enter Id of recipe');
        await Recipe.destroy({ where: {
            id
        }});
        return `Recipe ${id} successfully removed`;
    } 
    catch (error) {
        throw new Error('Error deleting recipe');
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



// Controllers para requerir la información a la API y devolver con la info de la BDD

const getAllRecipes = async (value) => {
    // Traemos las recetas de la API
    let result = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY2}`)
        .then((res) => res.data.results)
        .catch((err) => console.log(err.message));

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
                console.log(err.message);
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



module.exports = {
    createUser,
    userLogin,
    getUserByID,
    getUserRecipes,
    getUserRecipeByID,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    getDiets,
    createDiets,
    getAllRecipes,
    getRecipeById,
};


