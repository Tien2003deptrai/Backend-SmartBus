const app = require('./app');
const connectDB = require('./src/config/database');
const config = require('./src/config');

connectDB().then(() => {
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
});
