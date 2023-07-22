import express from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import records from "./routes/record.mjs";
import bodyParser from "body-parser"
const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json()); //uses json for headers

app.use(bodyParser.json());

app.use("/record", records);

// start the Express backend
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});

