const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.SQLALCHEMY_DATABASE_URI || "sqlite::memory:",
  {
    logging: false,
    dialectOptions:
      process.env.NODE_ENV === "production"
        ? { ssl: false }
        : {},
  }
);

module.exports = sequelize;