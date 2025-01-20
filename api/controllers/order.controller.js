import Order from "../models/order.model.js";
import { errorHandler } from "../utils/error.js";

export const createOrder = async (req, res, next) => {
  try {
    const { userId, sellerId, productId, quantity, address, date } = req.body;
    if (!userId || !sellerId || !productId || !quantity || !address || !date) {
      return next(errorHandler(403, 'All fields are required'));
    }
    const newOrder = new Order({
      userId,
      sellerId,
      productId,
      quantity,
      address,
      date,
    });
    await newOrder.save();
    res.status(200).json(newOrder);
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const { id } = req.params; // Single parameter for dynamic matching

    // Fetch orders where the id matches either userId or sellerId
    const orders = await Order.find({
      $or: [{ userId: id }, { sellerId: id }],
    });

    const totalOrders = await Order.countDocuments();

    res.status(200).json({
      orders,
      totalOrders,
    });
  } catch (error) {
    next(error);
  }
};


export const updateOrder = async (req, res, next) => {
  try {
    const updatedOrder = await Order.findById(req.params.orderId);
    if (!updatedOrder) {
      return next(errorHandler(404, 'Order not found'));
    }
    if(req.user.role !== "seller" && updatedOrder.sellerId !== req.user.id) {
      return next(errorHandler(403, 'You are not allowed to edit this order'));
    }

    const editOrder = await Order.findByIdAndUpdate(
      req.params.orderId,
      { $set
        : req.body
      },
      { new: true } 
    );
    res.status(200).json(editOrder);
  } catch (error) {
    next(error);
  }
};



