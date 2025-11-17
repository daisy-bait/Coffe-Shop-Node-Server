import orderModel from "../models/order.model.js";
import orderDetailModel from "../models/orderDetail.model.js";
import productsModel from "../models/products.model.js";
import userModel from "../models/user.model.js";
import mongoose from "mongoose";

export const createOrder = async (req, res) => {
  try {
    console.log(req.body);
    const { clientId, orderDetails } = req.body;

    if (
      !clientId ||
      !mongoose.Types.ObjectId.isValid(clientId) ||
      !orderDetails ||
      !Array.isArray(orderDetails) ||
      orderDetails.length === 0
    ) {
      return res.status(400).json({
        message: "Faltan datos obligatorios o el array de detalles está vacío",
      });
    }

    const client = await userModel.findById(clientId);
    if (!client) {
      return res
        .status(404)
        .json({ message: `Cliente no encontrado: ${clientId}` });
    }

    let totalOrderPrice = 0;
    const createdOrderDetails = [];

    // Se recorre el array de orderDetails
    for (const detail of orderDetails) {
      const { productId, quantity } = detail;

      if (!productId || quantity === undefined) {
        return res
          .status(400)
          .json({ message: "Cada detalle debe incluir productId y quantity" });
      }

      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({
          message: `El ID del producto no tiene un formato válido: ${productId}`,
        });
      }
      if (quantity <= 0) {
        return res.status(400).json({
          message: `Cantidad inválida (${quantity}) para el producto ${productId}`,
        });
      }

      const product = await productsModel.findById(productId);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Producto no encontrado: ${productId}` });
      }

      if (!product.enabled) {
        return res.status(400).json({
          message: `Producto no disponible: ${product.name} con id: ${product._id}`,
        });
      }

      // Validamos que haya stock suficiente
      if (quantity > product.stock) {
        return res.status(400).json({
          message: `Stock insuficiente para el producto ${product.name}. Disponible: ${product.stock}`,
        });
      }

      // Calculamos el precio total del detalle
      const totalDetailPrice = product.price * quantity;
      totalOrderPrice += totalDetailPrice;

      // Creamos el OrderDetail en la BD así bien GOATED
      const newOrderDetail = await orderDetailModel.create({
        product: product._id,
        quantity,
        total_price: totalDetailPrice,
      });

      createdOrderDetails.push(newOrderDetail._id);

      // Actualizar el stock del producto
      product.stock -= quantity;
      await product.save();
    }

    const newOrder = await orderModel.create({
      client: clientId,
      order_details: createdOrderDetails,
      total_price: totalOrderPrice,
      status: "PENDIENTE",
    });

    const populatedOrder = await orderModel
      .findById(newOrder._id)
      .populate({
        path: "client",
      })
      .populate({
        path: "order_details",
        select: "-__v",
        populate: {
          path: "product",
          select: "-__v",
        },
      })
      .select("-__v");

    return res.status(201).json({
      message: "Orden creada exitosamente",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("Error creando orden:", error);
    return res
      .status(500)
      .json({ message: "Error al crear la orden", error: error.message });
  }
};

export const modifyOrderStatus = async (req, res) => {
  try {
    const orderId = req.body.id;
    const status = req.body.status;

    const toModifyOrder = await orderModel.findOne({ _id: orderId });

    if (toModifyOrder.status !== "PENDIENTE") {
      return res
        .status(400)
        .json({ message: "La orden ya se encuentra cancelada o completada" });
    }

    const modifiedOrder = await orderModel.findOneAndUpdate(
      { _id: orderId },
      { status: status },
      { new: true }
    );

    return res.status(200).json(modifiedOrder);
  } catch (error) {
    console.error("Error modificando orden:", error);
    return res
      .status(500)
      .json({ message: "Error al modificar la orden", error: error.message });
  }
};

export const searchOrdersByParams = async (req, res) => {
  try {
    console.log(req.body);
    const { username } = req.query;

    const foundUser = await userModel.findOne({ username: username });

    if (!foundUser) {
      return res.json([]);
    }

    const foundOrders = await orderModel
      .find({ client: foundUser._id })
      .populate({
        path: "client",
        select: "-password -__v -createdAt -updatedAt -roles"
      })
      .populate({
        path: "order_details",
        select: "-__v",
        populate: {
          path: "product",
          select: "-__v -benefits -createdAt -updatedAt -category -image -enabled -ingredients -stock -roast_level -origin -recommendations",
        },
      })
      .sort({ updatedAt: -1 });

      return res.status(200).json(foundOrders);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error al buscar ordenes", error: error });
  }
};
