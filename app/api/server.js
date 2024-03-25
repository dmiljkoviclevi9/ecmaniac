import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import getUserRouter from "./src/routes/usersRoute.js";
import getChallengeRouter from "./src/routes/challengesRoute.js";
import getAuthRouter from "./src/routes/authRoute.js";
import { setup } from "./dependencyInjectionConfig.js";

import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerOptions from './src/swagger/swaggerConfig.js';
import fs from 'fs'; 
import path from 'path';


dotenv.config({ path: "./config.env" });
const app = express();
const PORT = process.env.PORT || 3001;

const customCss = fs.readFileSync(path.resolve('./src/swagger/swaggerCustomStyles.css'), 'utf8');
var options = {
  customCss: customCss
};
const specs = swaggerJsdoc(swaggerOptions);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs, options));

setup();


app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/user", getUserRouter());
app.use("/auth", getAuthRouter());
app.use("/challenge", getChallengeRouter());

// Global Error Handler
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const type = error.type || "";
  res.status(status).json({ code: status, type: type, message: message });
});

mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => console.log(err));
