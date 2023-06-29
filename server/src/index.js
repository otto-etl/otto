import express from "express";
import cors from "cors";
import mockRoutes from "./routes/mock.js";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use("/mock", mockRoutes);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
