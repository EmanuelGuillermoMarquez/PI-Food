const { DataTypes } = require('sequelize');

// Exportamos una funcion que define el modelo, luego le injectamos la conexion a sequelize

module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('Recipe', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      /* set(value) {
        return this.setDataValue('id', value.split(0, 7));
      } */
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    health_score: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
        max: 10
      }
    },
    instructions: {
      type: DataTypes.STRING,
      get() {
        return JSON.parse(this.getDataValue('instructions'));
      },
      set(value) {
        return this.setDataValue('instructions', JSON.stringify(value));
      }
    }
  },
  {
    timestamps: false
  });
};
