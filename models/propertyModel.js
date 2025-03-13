// const { sequelize } = require("./config/db");

const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Property = sequelize.define("Property", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
});
module.exports = Property;
