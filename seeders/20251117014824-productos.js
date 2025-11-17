'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.bulkInsert('producto', [
      { id: 1, titulo: "Televisor Smart TV 4K UHD", descripcion: "El televisor 4K UHD te...", precio: 7000, createdAt: new Date(), updatedAt: new Date() },
      { id: 2, titulo: "Apple MacBook Air 13 pulgadas", descripcion: "La MacBook Air es...", precio: 22000, createdAt: new Date(), updatedAt: new Date() },
      { id: 3, titulo: "Apple MacBook Air 13 pulgadas, Chip M2, 8 GB de RAM, 256 GB de SSD", descripcion: "La computadora es delgada y ligera...", precio: 22000, createdAt: new Date(), updatedAt: new Date() },
      { id: 4, titulo: "Silla De Oficina Ergonómica...", descripcion: "Silla de escritorio de malla...", precio: 1500, createdAt: new Date(), updatedAt: new Date() },
      { id: 5, titulo: "Silla de Escritorio Ergonómica...", descripcion: "Su rotación de 360 grados...", precio: 45, createdAt: new Date(), updatedAt: new Date() },
      { id: 6, titulo: "Bolsa Sobre Hombro Mujer...", descripcion: "Esta bolsa es ideal...", precio: 42, createdAt: new Date(), updatedAt: new Date() },
      { id: 7, titulo: "Juego de 2 Vasos...", descripcion: "Disfruta de tu bebida...", precio: 14.44, createdAt: new Date(), updatedAt: new Date() },
      { id: 8, titulo: "Cabezal de Ducha...", descripcion: "Presenta partículas de...", precio: 14.44, createdAt: new Date(), updatedAt: new Date() },
      { id: 9, titulo: "Protectores De Lente...", descripcion: "Protege tu privacidad...", precio: 12.99, createdAt: new Date(), updatedAt: new Date() },
      { id: 10, titulo: "JBL Flip 5 Altavoz Bluetooth...", descripcion: "JBL Flip 5 es...", precio: 89.95, createdAt: new Date(), updatedAt: new Date() },
      { id: 11, titulo: "Echo Dot (5ta gen) con reloj", descripcion: "El Echo Dot con...", precio: 100, createdAt: new Date(), updatedAt: new Date() },
      { id: 12, titulo: "Cámara digital para niños...", descripcion: "Es una cámara pequeña...", precio: 26.9, createdAt: new Date(), updatedAt: new Date() },
      { id: 13, titulo: "LEGO Star Wars: The...", descripcion: "El protagonista es...", precio: 771, createdAt: new Date(), updatedAt: new Date() },
      { id: 14, titulo: "Hidrolimpiadora Kärcher K1700", descripcion: "Ofrece 1700 PSI...", precio: 990, createdAt: new Date(), updatedAt: new Date() },
      { id: 15, titulo: "Aspiradora Robot iRobot Roomba", descripcion: "Roomba i4 EVO...", precio: 321, createdAt: new Date(), updatedAt: new Date() }
    ], {});

  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.bulkDelete('producto', null, {});
    
  }
};