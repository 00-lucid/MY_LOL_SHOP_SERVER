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
    return await queryInterface.bulkInsert('items', [
      {
        name: '2021 우주 그루브 메가 세트',
        rate: 0,
        review: 91,
        price: 19570,
        status: 'sale',
        count: 11,
        img: 'https://d392eissrffsyf.cloudfront.net/storeImages/bundles/99901061.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '우주 그루브 나서스 테두리 세트',
        rate: 4.8,
        review: 3102,
        price: 3125,
        status: 'on',
        count: 7,
        img: 'https://d392eissrffsyf.cloudfront.net/storeImages/bundles/99901056.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '우주 그루브 럭스 테두리 세트',
        rate: 3.9,
        review: 7,
        price: 3330,
        status: 'on',
        count: 1,
        img: 'https://d392eissrffsyf.cloudfront.net/storeImages/bundles/99901054.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '우주 그루브 사미라 테두리 세트',
        rate: 4.9,
        review: 1500,
        price: 3515,
        status: 'on',
        count: 9100,
        img: 'https://d392eissrffsyf.cloudfront.net/storeImages/bundles/99901060.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '우주 그루브 블리츠와 크랭크 테두리 세트',
        rate: 4.8,
        review: 90000,
        price: 3800,
        status: 'on',
        count: 200000,
        img: 'https://d392eissrffsyf.cloudfront.net/storeImages/bundles/99901058.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'K/DA ALL OUT 이블린',
        rate: 4.9,
        review: 110000,
        price: 1350,
        status: 'sale',
        count: 400000,
        img: 'https://cdn-store.leagueoflegends.co.kr/images/v2/champion-splashes/28015.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },



      {
        name: '우주 그루브 나서스',
        rate: 4.9,
        review: 5000,
        price: 1350,
        status: 'on',
        count: 400000,
        img: 'https://cdn-store.leagueoflegends.co.kr/images/v2/champion-splashes/75025.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '우주 그루브 누누와 윌럼프',
        rate: 4.9,
        review: 5000,
        price: 1350,
        status: 'sale',
        count: 400000,
        img: 'https://cdn-store.leagueoflegends.co.kr/images/v2/champion-splashes/20016.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '우주 그루브 럼블',
        rate: 4.9,
        review: 5000,
        price: 1350,
        status: 'on',
        count: 400000,
        img: 'https://cdn-store.leagueoflegends.co.kr/images/v2/champion-splashes/68013.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '우주 그루브 룰루',
        rate: 4.9,
        review: 5000,
        price: 1350,
        status: 'on',
        count: 400000,
        img: 'https://cdn-store.leagueoflegends.co.kr/images/v2/champion-splashes/117026.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '우주 그루브 블리츠와 크랭크',
        rate: 4.9,
        review: 5000,
        price: 1850,
        status: 'on',
        count: 400000,
        img: 'https://cdn-store.leagueoflegends.co.kr/images/v2/champion-splashes/53029.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '전투사관학교 가렌',
        rate: 4.9,
        review: 5000,
        price: 1350,
        status: 'on',
        count: 400000,
        img: 'https://cdn-store.leagueoflegends.co.kr/images/v2/champion-splashes/86024.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '전투사관학교 레오나',
        rate: 4.9,
        review: 5000,
        price: 1350,
        status: 'on',
        count: 400000,
        img: 'https://cdn-store.leagueoflegends.co.kr/images/v2/champion-splashes/89021.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '유미',
        rate: 5.0,
        review: 5000,
        price: 975,
        status: 'on',
        count: 400000,
        img: 'https://cdn-store.leagueoflegends.co.kr/images/v2/champion-splashes/350000.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '비에고',
        rate: 5.0,
        review: 5000,
        price: 975,
        status: 'on',
        count: 400000,
        img: 'https://cdn-store.leagueoflegends.co.kr/images/v2/champion-splashes/234000.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '렐',
        rate: 5.0,
        review: 5000,
        price: 975,
        status: 'on',
        count: 400000,
        img: 'https://cdn-store.leagueoflegends.co.kr/images/v2/champion-splashes/526000.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '세라핀',
        rate: 5.0,
        review: 5000,
        price: 975,
        status: 'on',
        count: 400000,
        img: 'https://cdn-store.leagueoflegends.co.kr/images/v2/champion-splashes/147000.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '사미라',
        rate: 5.0,
        review: 5000,
        price: 975,
        status: 'on',
        count: 400000,
        img: 'https://cdn-store.leagueoflegends.co.kr/images/v2/champion-splashes/360000.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '요네',
        rate: 5.0,
        review: 5000,
        price: 975,
        status: 'on',
        count: 400000,
        img: 'https://cdn-store.leagueoflegends.co.kr/images/v2/champion-splashes/777000.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '릴리아',
        rate: 5.0,
        review: 5000,
        price: 975,
        status: 'on',
        count: 400000,
        img: 'https://cdn-store.leagueoflegends.co.kr/images/v2/champion-splashes/876000.jpg',
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
    return await queryInterface.bulkInsert('items', null, {});
  }
};
