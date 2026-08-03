const jwt = require('jsonwebtoken');
const User = require('../models/User');

const initializeSocket = (io) => {
  // Auth middleware for Socket.io
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error('Authentication error'));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (!user) return next(new Error('User not found'));
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.name} (${socket.user.role})`);

    // Join user-specific room
    socket.join(`user_${socket.user._id}`);

    // Vendor joins restaurant room
    if (socket.user.role === 'vendor') {
      socket.on('join_restaurant', (restaurantId) => {
        socket.join(`restaurant_${restaurantId}`);
        console.log(`Vendor joined restaurant room: ${restaurantId}`);
      });
    }

    // Delivery partner joins delivery room
    if (socket.user.role === 'delivery') {
      socket.on('join_delivery', () => {
        socket.join('delivery_pool');
        console.log(`Delivery partner joined pool: ${socket.user.name}`);
      });
    }

    // === ORDER EVENTS ===

    // Customer places order -> notify restaurant
    socket.on('order_placed', (data) => {
      const { orderId, restaurantId } = data;
      io.to(`restaurant_${restaurantId}`).emit('new_order', {
        orderId,
        message: 'New order received!',
        timestamp: new Date(),
      });
    });

    // Vendor confirms order -> notify customer
    socket.on('order_confirmed', (data) => {
      const { orderId, customerId, estimatedTime } = data;
      io.to(`user_${customerId}`).emit('order_update', {
        orderId,
        status: 'confirmed',
        message: `Your order has been confirmed! Estimated time: ${estimatedTime} min`,
        timestamp: new Date(),
      });
    });

    // Order status update -> notify customer
    socket.on('order_status_update', (data) => {
      const { orderId, customerId, status, message } = data;
      io.to(`user_${customerId}`).emit('order_update', {
        orderId,
        status,
        message,
        timestamp: new Date(),
      });
    });

    // Vendor marks order ready -> notify delivery
    socket.on('order_ready', (data) => {
      const { orderId, restaurantId, restaurantAddress } = data;
      io.to('delivery_pool').emit('new_delivery', {
        orderId,
        restaurantId,
        restaurantAddress,
        message: 'New delivery available!',
        timestamp: new Date(),
      });
    });

    // Delivery partner accepts order
    socket.on('delivery_accepted', (data) => {
      const { orderId, customerId, deliveryPartnerName, deliveryPartnerPhone } = data;
      io.to(`user_${customerId}`).emit('order_update', {
        orderId,
        status: 'dispatched',
        message: `${deliveryPartnerName} has picked up your order`,
        deliveryPartner: { name: deliveryPartnerName, phone: deliveryPartnerPhone },
        timestamp: new Date(),
      });
    });

    // Delivery partner shares live location
    socket.on('delivery_location', (data) => {
      const { orderId, customerId, location } = data;
      io.to(`user_${customerId}`).emit('delivery_tracking', {
        orderId,
        location,
        timestamp: new Date(),
      });
    });

    // Order delivered
    socket.on('order_delivered', (data) => {
      const { orderId, customerId } = data;
      io.to(`user_${customerId}`).emit('order_update', {
        orderId,
        status: 'delivered',
        message: 'Your order has been delivered! Enjoy your meal!',
        timestamp: new Date(),
      });
    });

    // === CHAT / NOTIFICATIONS ===

    socket.on('send_notification', (data) => {
      const { userId, notification } = data;
      io.to(`user_${userId}`).emit('notification', {
        ...notification,
        timestamp: new Date(),
      });
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.name}`);
    });
  });

  return io;
};

module.exports = initializeSocket;
