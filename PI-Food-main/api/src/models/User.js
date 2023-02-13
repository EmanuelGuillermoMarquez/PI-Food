const { DataTypes } = require('sequelize');
const { passwordEncryptor } = require('../helpers/encrypter');

// Modelo extra para poder crear usuarios y que cada uno tenga sus recetas

module.exports = (sequelize) => {
    sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            set(value) {
                this.setDataValue('password', passwordEncryptor(value))
            }
        }
    },
    { timestamps: false });
};
