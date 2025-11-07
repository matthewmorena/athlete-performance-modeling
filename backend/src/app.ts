import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import athleteRoutes from "./routes/athlete.routes";
import meetRoutes from "./routes/meet.routes";
import teamRoutes from "./routes/team.routes";
import searchRoutes from "./routes/search.routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/athletes", athleteRoutes);
app.use("/api/meets", meetRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/search", searchRoutes)

export default app;
