'use strict';

const {promises: fs} = require("fs");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    let companies = JSON.parse(await fs.readFile("./data/companies.json", "utf-8")).map(item => {
      item.company_id = item.id;
      delete item.id;
      delete item.name;
      delete item.image;
      delete item.description;
      delete item.risk_level;
      delete item.growth;

      item.obligasi_pemerintah = item.allocationAssets.obligasi_pemerintah;
      item.obligasi_korporasi = item.allocationAssets.obligasi_korporasi;
      item.pasar_uang = item.allocationAssets.pasar_uang;

      delete item.allocationAssets;

      item.createdAt = new Date();
      item.updatedAt = new Date();
      return item;
    });

    await queryInterface.bulkInsert('CompanyDetails', companies);

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('CompanyDetails', null, {});
  }
};
