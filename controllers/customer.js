const Customer = require('../models/customer');

exports.updateDataCustomer = async (req, res) => {
  const customerId = req.params.customerId;
  const { name, phone_number, avatar_url } = req.body;

  try {
    const currentCustomer = await Customer.findById(customerId).select(['-__v']).exec();
    if(currentCustomer.owner.toString() !== req.userId) {
      return res.status(401).json({
        message: "Not authenticated",
        errors: "Your not allowed to edit this data"
      });
    }
    currentCustomer.name = name || currentCustomer.name;
    currentCustomer.phone_number = phone_number || currentCustomer.phone_number;
    currentCustomer.avatar_url = avatar_url || currentCustomer.avatar_url;
    await currentCustomer.save();
    return res.status(200).json({
      message: "Customer updated!",
      data: currentCustomer
    });
  } catch(err) {
    return res.status(500).json({
      message: "Error update customer",
      errors: err
    });
  }
}
