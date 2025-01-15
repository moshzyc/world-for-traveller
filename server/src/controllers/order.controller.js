const createOrder = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Create the order object with delivery address defaulting to user's address
    const orderData = {
      cart: req.body.cart,
      totalAmount: req.body.totalAmount,
      deliveryAddress: req.body.deliveryAddress || user.address, // Use provided address or fall back to user's address
      // ... other order fields
    };

    // Add the order to user's orders array
    user.orders.push(orderData);
    await user.save();

    res.status(201).json({ message: "Order created successfully", order: orderData });
  } catch (error) {
    res.status(500).json({ message: "Error creating order", error: error.message });
  }
}; 