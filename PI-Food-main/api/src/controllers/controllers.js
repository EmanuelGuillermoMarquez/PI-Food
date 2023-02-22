const { Recipe , Diet , User , Op } = require('../db');
const axios = require('axios');
const { checkPassword } = require('../helpers/encrypter');
require('dotenv').config();
const { API_KEY1 } = process.env;

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

        const result = await Recipe.findAll({
            attributes: {
                exclude: ['instructions']
            },
            include: {
                model: Diet,
                through: { attributes: [] }          
            }
        });

        if(!result.length) throw new Error(`User recipes not found`);

        const recipe = result.map((recipe) => {
            return {
                id: recipe.id,
                title: recipe.title,
                diets: recipe.Diets.map((item) => item.name)
            }
        });
        
        return recipe;
    };

    const result = await Recipe.findAll({
        where: { 
            title:  {
                [Op.iLike] : `%${value}%`
            } 
        }, 
        attributes: {exclude: ['instructions']},
        include: {
            model: Diet,
            through: { attributes: [] }          
        }
    });

    if(!result.length) throw new Error(`User recipe ${value} not found`);
    
    const recipe = result.map((recipe) => {
        return {
            id: recipe.id,
            title: recipe.title,
            diets: recipe.Diets.map((item) => item.name)
        }
    });
    
    return recipe;
};

const getUserRecipeByID = async (id) => {
    if(!id) throw new Error(`Wrong ID`);

    const result = await Recipe.findByPk(id, {
        attributes: ['id', 'title', 'summary', 'health_score', 'instructions'],
        include: {
            model: Diet,
            through: { attributes: [] }          
        }
    });

    if(!result) throw new Error(`User recipe ${id} not found`);

    const recipe = {
        id: result.id,
        title: result.title,
        summary: result.summary,
        health_score: result.health_score,
        diets: result.Diets.map((item) => item.name),
        instructions: result.instructions
    };

    return recipe;
};

const createRecipe = async (data, userId) => {
    const { title , summary , health_score , instructions , diets } = data;
    // <diets> tiene que ser un array con el nombre de cada dieta
    
    if(!title || !summary || !userId) throw new Error('Missing required data');
  
    try {
        // ['nombre de dieta', 'nombre de dieta'] => [ id, id ] - Obtenemos los id de las dietas
        const dietsID = await Diet.findAll({
            where: {
                name: diets
            }
        }, {
            attributes: ['id']
        });
        
        const newRecipe = await Recipe.create({ title, summary, health_score, instructions });
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
    let apiResult = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY1}&addRecipeInformation=true&number=100`)
        .then((res) => res.data.results)
        .catch((err) => console.log(err.message));

    let result = apiResult.map((item) => {
       return {
            id: item.id,
            title: item.title,
            image: item.image,
            diets: item.diets
        }
    });
    apiResult.vegetarian && result.diets.push('Vegetarian');
    apiResult.vegan && result.diets.push('Vegan');


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

    if(!isNaN(id)) {
        // Traemos las recetas de la API por su id siempre que sea un numero
        const result = await axios.get(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY1}`)
            .then((res) => res.data)
            .catch((err) => {
                console.log(err.message);
                throw new Error(`A recipe with the id ${id} does not exist`);
            });
        // Filtramos la info que queremos recibir  
        const recipe = {
            id: result.id,
            title: result.title,
            image: result.image,
            summary: result.summary,
            health_score: result.healthScore,
            diets: result.diets,
            instructions: {
                ingredients: result.extendedIngredients.map((item) => item.name),
                cooking: result.analyzedInstructions[0]?.steps.map((item) => {
                    return {
                        number: item.number,
                        step: item.step
                    }
                })
            }
        };

        result.vegetarian && recipe.diets.push('Vegetarian');
        result.vegan && recipe.diets.push('Vegan');

        return recipe;
    } 
    
    // Buscamos las recetas del usuario por el id ingresado
    if(typeof id === 'string' && id.length >= 35) {
        return await getUserRecipeByID(id);
    } 

    // Si ningun if resulta ser positivo se arroja el error
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


