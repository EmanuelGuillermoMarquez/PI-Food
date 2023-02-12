const { DataTypes } = require('sequelize');

// Creamos una funcion que define el modelo, le injectamos la conexion a sequelize y luego la exportamos (invertimos la ruta del modelo por defecto)

const Diet = (sequelize) => {
  sequelize.define('Diet', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  },
  {
    timestamps: false
  });
};

module.exports = Diet;
