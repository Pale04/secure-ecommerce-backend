'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('productocarrito', {
      id: {
        type: Sequelize.CHAR(36),
        allowNull: false,
        primaryKey: true
      },
      carritoid: {
        type: Sequelize.CHAR(36),
        allowNull: false,
        references: {
          model: 'carrito',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      productoid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'producto',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      cantidad: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      subtotal: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }}, {
        charset: 'utf8mb4',
        collate: 'utf8mb4_bin'
      });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('productocarrito');
  }
};
