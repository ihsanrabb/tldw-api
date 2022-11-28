const authRoutes = require('../routes/auth');
const tenantRoutes = require('../routes/tenant');
const customerRoutes = require('../routes/customer');

exports.registerApiRoutes = (app) => {
  app.use(`/auth`, authRoutes);
  app.use('/tenant', tenantRoutes);
  app.use('/customer', customerRoutes);
}