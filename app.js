const { config } = require('dotenv');
config();

const express = require('express');
const app = express();
const cors = require('cors');
const port = 8080;
const mongoose = require('mongoose');
const { registerApiRoutes } = require('./components');
const { env } = require('./globals');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

main().catch(err => console.log("Error start application", err));

async function main() { 
  await mongoose.connect(env.MONGODB_URI)

  app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  registerApiRoutes(app);
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}

