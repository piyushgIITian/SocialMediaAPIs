require("./config/database").connect();
require("dotenv").config();

const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');


const express = require("express");
const app = express();
app.use(express.json());

app.use('/api/authenticate', authRoute);
app.use('/api/posts', postRoute);
app.use('/api', userRoute);




const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  console.log(`Backend server has started on ${PORT}`);
});
