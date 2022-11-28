exports.env = {
  MONGODB_URI: process.env.MONGODB_URI,
  SECRET_KEY: process.env.SECRET_KEY
};

exports.role = {
  CUSTOMER: "customer",
  TENANT: "tenant",
}
