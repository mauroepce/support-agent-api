import { configDotenv } from "dotenv";
import express, { Application } from "express";

configDotenv();

const app: Application = express();
const port: number = parseInt(process.env.PORT || '3001', 10);

app.listen(port, () => {
    console.log(`Api listening on PORT: ${port}`);
});