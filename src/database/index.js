import { Sequelize } from "sequelize";
import User from "../app/models/User"
import configDatabase from "../config/database"

const models =[User]

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(configDatabase);
    models.forEach(model => model.initModel(this.connection));
  }
}

module.exports = new Database();