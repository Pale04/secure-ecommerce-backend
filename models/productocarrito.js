'use strict';

module.exports = (sequelize, DataTypes) => {
  const ProductoCarrito = sequelize.define('productocarrito', {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true
    },
    carritoid: DataTypes.CHAR(36),
    productoid: DataTypes.INTEGER,
    cantidad: DataTypes.INTEGER,
    subtotal: DataTypes.DECIMAL(10, 2)
  }, { tableName: 'productocarrito' });

  ProductoCarrito.associate = (models) => {
    ProductoCarrito.belongsTo(models.carrito, { foreignKey: 'carritoid' });
    ProductoCarrito.belongsTo(models.producto, { foreignKey: 'productoid' });
  };

  return ProductoCarrito;
};
