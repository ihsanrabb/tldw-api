const { validationResult } = require('express-validator');
const Tenant = require('../models/tenant');

exports.getAllTenant = async (req, res) => {
  try {
    const tenantList = await Tenant.find().select(['-__v', '-owner']).exec();
    res.status(200).json({
      message: "Success get tenant!",
      data: tenantList
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error getAllTenant tenant",
      errors: err
    });
  }
}

exports.createTenant = async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(422).json({
      message: "InvalidParameter",
      errors: errors.array()
    });
  }

  const { tenant_name, location, description, category, image_url, phone_number } = req.body;
  try {
    const existingTenant = await Tenant.where({tenant_name}).findOne();
    if(existingTenant) {
      return res.status(422).json({
        message: "Failed to create!",
        errors: "Tenant already exist"
      });
    }

    const newTenant = new Tenant({
      tenant_name,
      location,
      description,
      category,
      image_url,
      phone_number,
      owner: req.userId
    })
    await newTenant.save();
    res.status(201).json({
      message: "Tenant created!"
    });
  } catch(err) {
    console.log("Error create tenant", err);
    return res.status(500).json({
      message: "Error create tenant",
      errors: err
    });
  }
}

exports.updateTenant = async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(422).json({
      message: "InvalidParameter",
      errors: errors.array()
    });
  }
  
  const tenantId = req.params.tenantId;
  const { tenant_name, location, description, category, image_url } = req.body;
  try {
    const currentTenant = await Tenant.findById(tenantId).select(['-__v']).exec();
    if(currentTenant.owner.toString() !== req.userId) {
      return res.status(401).json({
        message: "Not authenticated",
        errors: "Your not allowed to edit this data"
      });
    }
    currentTenant.tenant_name = tenant_name || currentTenant.tenant_name;
    currentTenant.location = location || currentTenant.location;
    currentTenant.description = description || currentTenant.description;
    currentTenant.category = category || currentTenant.category;
    currentTenant.image_url = image_url || currentTenant.image_url;
    await currentTenant.save();
    res.status(200).json({
      message: "Tenant updated!",
      data: currentTenant
    });
  } catch(err) {
    return res.status(500).json({
      message: "Error update tenant",
      errors: err
    });
  }
}

exports.deleteTenant = async (req, res) => {
  const tenantId = req.params.tenantId;
  try {
    const currentTenant = await Tenant.findById(tenantId).exec();
    if(currentTenant) {
      if(currentTenant.owner.toString() === req.userId) {
        await Tenant.findByIdAndDelete(tenantId);
        return res.status(200).json({message: "Delete tenant successfully"});
      } else {
        return res.status(403).json({
          message: "Youre not authorized to delete this tenant"
        });
      }
    } else {
      return res.status(404).json({
        message: "Tenant not found"
      });
    }
  } catch(err) {
    return res.status(500).json({
      message: "Error delete tenant",
      errors: err
    });
  }
}
