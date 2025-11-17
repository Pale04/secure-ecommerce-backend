'use strict';
const bcrypt = require('bcrypt')
const crypto = require('crypto')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const AdministradorUID = crypto.randomUUID()
    const UsuarioUID = crypto.randomUUID()

    await queryInterface.bulkInsert('rol', [
      { id: AdministradorUID, nombre: 'Administrador', createdAt: new Date(), updatedAt: new Date() },
      { id: UsuarioUID, nombre: 'Usuario', createdAt: new Date(), updatedAt: new Date() }
    ]);

    await queryInterface.bulkInsert('usuario', [
      { id: crypto.randomUUID(), email: 'gvera@uv.mx', passwordhash: await bcrypt.hash('patito', 10), nombre: 'Guillermo Vera', rolid: AdministradorUID, protegido: true, createdAt: new Date(), updatedAt: new Date() },
      { id: crypto.randomUUID(), email: 'patito@uv.mx', passwordhash: await bcrypt.hash('patito', 10), nombre: 'Usuario patito', rolid: UsuarioUID, createdAt: new Date(), updatedAt: new Date() }
    ]);

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('rol', null, {})
    await queryInterface.bulkDelete('usuario', null, {})
  }
};