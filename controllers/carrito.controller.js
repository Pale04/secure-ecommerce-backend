const { validationResult } = require('express-validator');
const crypto = require('crypto');
const { sequelize, usuario, carrito, productocarrito, producto } = require('../models');
const { Console } = require('console');

const { v4: uuid } = require('uuid');


module.exports = {
  async getActual(req, res, next) {
    try {
      const email = req.user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

      const usuarioDB = await usuario.findOne({
        where: { email }
      });

      if (!usuarioDB) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      const userId = usuarioDB.id;

      let cart = await carrito.findOne({
        where: { usuarioid: userId, actual: 1 },
        include: [
          {
            model: productocarrito,
            as: 'productocarritos',
            include: [
              {
                model: producto,
                as: 'producto'
              }
            ]
          }
        ]
      });

      if (!cart) {
        return res.json({
          id: "",
          email,
          actual: true,
          fechaCompra: null,
          itemsCarrito: [],
          total: 0
        });
      }

      // ---------- MAPEO LOS ITEMS AL FORMATO .NET ----------
      const items = cart.productocarritos.map(pc => ({
        idCarrito: cart.id,
        idProducto: pc.productoid,
        cantidad: pc.cantidad,
        producto: pc.producto
          ? {
              productoId: pc.producto.id,
              titulo: pc.producto.titulo,
              precio: pc.producto.precio,
              archivoId: pc.producto.archivoid,
              categorias: pc.producto.categorias ?? []
            }
          : null
      }));

      const total = items.reduce(
        (sum, item) => sum + ((item.producto?.precio ?? 0) * item.cantidad),
        0
      );

      return res.json({
        id: cart.id,
        email,
        actual: cart.actual === 1,
        fechaCompra: cart.fechaCompra ?? null,
        itemsCarrito: items,
        total
      });

    } catch (err) {
      console.log(err);
      next(err);
    }
  },
  // Agregar producto (o incrementar si existe)
  async agregaProducto(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { idcarrito } = req.params;
    const { idproducto, cantidad } = req.body;
    const email = req.user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

    const usuarioDB = await usuario.findOne({ where: { email } });
    if (!usuarioDB)
      return res.status(404).json({ error: "Usuario no encontrado" });

    const userId = usuarioDB.id;
    
    const t = await sequelize.transaction();
    try {
      const cart = await carrito.findOne({ where: { usuarioid: userId, actual: 1 }, transaction: t });
      if (!cart) { await t.rollback(); return res.status(404).json({ error: 'Carrito no encontrado' }); }

      const prod = await producto.findByPk(idproducto, { transaction: t });
      if (!prod) { await t.rollback(); return res.status(404).json({ error: 'Producto no existe' }); }

      const subtotal = parseFloat((prod.precio * cantidad).toFixed(2));

      const existing = await productocarrito.findOne({ where: { carritoid: idcarrito, productoid: idproducto }, transaction: t });
      if (existing) {
        existing.cantidad = existing.cantidad + cantidad;
        existing.subtotal = parseFloat((existing.cantidad * prod.precio).toFixed(2));
        await existing.save({ transaction: t });
      } else {
        await productocarrito.create({
          id: uuid(),
          carritoid: idcarrito,
          productoid: idproducto,
          cantidad,
          subtotal
        }, { transaction: t });
      }

      const items = await productocarrito.findAll({ where: { carritoid: idcarrito }, include: { model: producto, as: 'producto' }, transaction: t });
      const total = items.reduce((s, it) => s + parseFloat(it.subtotal), 0);
      await cart.update({ total }, { transaction: t });

      await t.commit();
      res.status(201).json({ message: 'Producto agregado', total });
    } catch (err) {
      await t.rollback();
      next(err);
    }
  },

  async modificarCantidad(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { idcarrito, idproducto } = req.params;
    const { cantidad } = req.body;
    const userId = req.user.id;

    const t = await sequelize.transaction();
    try {
      const cart = await carrito.findOne({ where: { id: idcarrito, usuarioid: userId, actual: 1 }, transaction: t });
      if (!cart) { await t.rollback(); return res.status(404).json({ error: 'Carrito no encontrado' }); }

      const prod = await producto.findByPk(idproducto, { transaction: t });
      if (!prod) { await t.rollback(); return res.status(404).json({ error: 'Producto no existe' }); }

      const item = await productocarrito.findOne({ where: { carritoid: idcarrito, productoid: idproducto }, transaction: t });
      if (!item) { await t.rollback(); return res.status(404).json({ error: 'Producto no está en carrito' }); }

      item.cantidad = cantidad;
      item.subtotal = parseFloat((prod.precio * cantidad).toFixed(2));
      await item.save({ transaction: t });

      const items = await productocarrito.findAll({ where: { carritoid: idcarrito }, transaction: t });
      const total = items.reduce((s, it) => s + parseFloat(it.subtotal), 0);
      await cart.update({ total }, { transaction: t });

      await t.commit();
      res.sendStatus(204);
    } catch (err) {
      await t.rollback();
      next(err);
    }
  },

  // Eliminar producto del carrito
  async quitarProducto(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { idcarrito, idproducto } = req.params;
    
     const email = req.user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

    const usuarioDB = await usuario.findOne({ where: { email } });
    if (!usuarioDB)
      return res.status(404).json({ error: "Usuario no encontrado" });

    const userId = usuarioDB.id;

    const t = await sequelize.transaction();
    try {
      const cart = await carrito.findOne({ where: { id: idcarrito, usuarioid: userId }, transaction: t });
      if (!cart) { await t.rollback(); return res.status(404).json({ error: 'Carrito no encontrado' }); }

      const deleted = await productocarrito.destroy({ where: { carritoid: idcarrito, productoid: idproducto }, transaction: t });
      if (!deleted) { await t.rollback(); return res.status(404).json({ error: 'Producto no está en carrito' }); }

      const items = await productocarrito.findAll({ where: { carritoid: idcarrito }, transaction: t });
      const total = items.reduce((s, it) => s + parseFloat(it.subtotal), 0);
      await cart.update({ total }, { transaction: t });

      await t.commit();
      res.sendStatus(204);
    } catch (err) {
      await t.rollback();
      next(err);
    }
  },

  async comprar(req, res, next) {
    console.log("Iniciando compra...");
    const { id } = req.params;
    
    const { idcarrito, idproducto } = req.params;
    const { cantidad } = req.body;
    
    const email = req.user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

    const usuarioDB = await usuario.findOne({ where: { email } });
    if (!usuarioDB)
      return res.status(404).json({ error: "Usuario no encontrado" });

    const userId = usuarioDB.id;
    const t = await sequelize.transaction();
    try {
      const cart = await carrito.findOne({
        where: { id, usuarioid: userId, actual: 1 },
        include: { model: productocarrito, as: 'productocarritos', include: { model: producto, as: 'producto' } },
        transaction: t
      });
      if (!cart) { await t.rollback(); return res.status(404).json({ error: 'Carrito no válido' }); }

      let total = 0;
    for (const it of cart.productocarritos) {
      total += parseFloat(it.producto.precio) * it.cantidad;
    }
    total = parseFloat(total.toFixed(2));

      await cart.update({ actual: 0, fechacompra: new Date(), total }, { transaction: t });

      await carrito.create({ id: uuid(), usuarioid: userId, actual: 1 }, { transaction: t });

      await t.commit();
      res.json({ message: 'Compra realizada', total });
    } catch (err) {
      await t.rollback();
      next(err);
    }
  },
};