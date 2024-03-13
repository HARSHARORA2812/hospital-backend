import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cors({
  origin : process.env.CORS_ORIGIN,
  credentials : true
}))

app.use(express.json({limit : "16kb"}))
app.use(urlencoded({extended : true , limit : "16kb"}))

app.use(express.static("public"))
app.use(cookieParser())


// import Routers

import patientRouter from "./src/Routes/patient.routes.js";
import doctorRouter from "./src/Routes/doctor.routes.js";
import helprouter from "./src/Routes/help.routes.js";
import reportrouter from "./src/Routes/report.routes.js";
import appointmentrouter from "./src/Routes/appointment.routes.js";

app.use("/api/v1/patient",patientRouter);
app.use("/api/v1/doctor",doctorRouter);
app.use("/api/v1/help",helprouter);
app.use("/api/v1/report",reportrouter);
app.use("/api/v1/appointment",appointmentrouter);

export { app }