require('dotenv').config();
const { Sequelize , Op } = require('sequelize');
const fs = require('fs');
const path = require('path');
const { DB_USER, DB_PASS, DB_HOST } = process.env;

const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASS}@${DB_HOST}/henry_food`, {
  logging: false, // set to console.log to see the raw SQL queries
  native: false, // lets Sequelize know we can use pg-native for ~30% more speed
});

const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners (* Mucho texto Henry *)

fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos

modelDefiners.forEach(model => model(sequelize));

// Capitalizamos los nombres de los modelos ej: product => Product

let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring

const { Recipe , Diet } = sequelize.models;

// Aca vendrian las relaciones

Recipe.belongsToMany(Diet, { through: 'Recipe_Diet'});
Diet.belongsToMany(Recipe, { through: 'Recipe_Diet'});

module.exports = {
  ...sequelize.models,  // para poder importar los modelos así: const { Product, User } = require('./db.js');
  db: sequelize,        // para importart la conexión => { db } = require('./db.js');
  Op,     
};
