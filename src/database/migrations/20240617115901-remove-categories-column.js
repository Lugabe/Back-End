'use strict';

const { type } = require('os');
const sequelize = require('sequelize');
const { AllowNull, Unique, AutoIncrement } = require('sequelize-typescript');



/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.removeColumn('products', 'category');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'category', {
      type: Sequelize.STRING,
      allowNull:true
    });
  },
};
