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
    return await queryInterface.bulkInsert('tags', [
      {
        itemId: '1',
        tag: '세트',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        itemId: '1',
        tag: '챔피언',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        itemId: '1',
        tag: '스킨',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        itemId: '2',
        tag: '세트',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        itemId: '2',
        tag: '챔피언',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        itemId: '2',
        tag: '스킨',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        itemId: '3',
        tag: '세트',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        itemId: '3',
        tag: '챔피언',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        itemId: '3',
        tag: '스킨',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        itemId: '4',
        tag: '세트',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        itemId: '4',
        tag: '챔피언',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        itemId: '4',
        tag: '스킨',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        itemId: '5',
        tag: '세트',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        itemId: '5',
        tag: '챔피언',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        itemId: '5',
        tag: '스킨',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        itemId: '6',
        tag: '스킨',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        itemId: '7',
        tag: '스킨',
        createdAt: new Date(),
        updatedAt: new Date()
      },


      {
        itemId: '8',
        tag: '스킨',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        itemId: '9',
        tag: '스킨',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        itemId: '10',
        tag: '스킨',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        itemId: '11',
        tag: '스킨',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        itemId: '12',
        tag: '스킨',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        itemId: '13',
        tag: '스킨',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        itemId: '14',
        tag: '챔피언',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        itemId: '15',
        tag: '챔피언',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        itemId: '16',
        tag: '챔피언',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        itemId: '17',
        tag: '챔피언',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        itemId: '18',
        tag: '챔피언',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        itemId: '19',
        tag: '챔피언',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        itemId: '20',
        tag: '챔피언',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkInsert('tags', null, {});
  }
};
