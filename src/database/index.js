import { Sequelize } from 'sequelize';
import User from '../app/models/User';
import configDatabase from '../config/database';
import Products from '../app/models/Products';
import Category from '../app/models/Category';
import mongoose from 'mongoose';

const models = [User, Products, Category];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(configDatabase);
    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models),
      );
  }
  mongo() {
    this.mongoConnection = mongoose
      .connect('mongodb://localhost:27017/devburger')
      .then(() => {
        console.log('MongoDb Connected');
      })
      .catch((err) => {
        console.error('Error in connect to MongoDb', err);
      });
  }
  getMongoConnection() {
    return mongoose.connection;
  }
}

export default new Database();
