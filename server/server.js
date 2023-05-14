const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, './.env') });
const app = require('./app');

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`🔴 App running on port ${port}...`);
});
