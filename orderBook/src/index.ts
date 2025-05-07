import express from "express";
import cors from "cors";
import { config } from "./config";
import { routes } from "./routes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1", routes);
app.listen(config.PORT, () => {
  console.log(`App is listening to port ${config.PORT}`);
});
