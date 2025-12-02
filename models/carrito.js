'use strict';

module.exports = (sequelize, DataTypes) => {
  const Carrito = sequelize.define('carrito', {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true
    },
    usuarioid: DataTypes.CHAR(36),
    actual: {
      type: DataTypes.BOOLEAN,
      get() {
        const raw = this.getDataValue('actual');
        return !!raw; // fuerza true/false
      }
    }

  }, { tableName: 'carrito' });

  Carrito.associate = (models) => {
    Carrito.belongsTo(models.usuario, { foreignKey: 'usuarioid' });
    Carrito.hasMany(models.productocarrito, { foreignKey: 'carritoid' });
  };

  return Carrito;
};
