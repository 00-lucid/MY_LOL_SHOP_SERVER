'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    return await queryInterface.bulkInsert('options', [
      {
        itemId: 1,
        option: 'red',
        optionPrice: 75,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        itemId: 1,
        option: 'yellow',
        optionPrice: 75,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        itemId: 1,
        option: 'blue',
        optionPrice: 75,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        itemId: 1,
        option: 'skyblue',
        optionPrice: 100,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        itemId: 2,
        option: 'orange',
        optionPrice: 100,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkInsert('options', null, {});
  }
};
