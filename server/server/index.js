const express = require("express");
const session = require("express-session");
const cors = require("cors");

require("dotenv").config();
const passport = require("./passport-setup");

const getFile = require("./routes/RetriveFile");

// DB Connect
const connectToMongo = require("./db/connection");
const logging = require("./middlewares/logging");

// Route Imports
const authRoutes = require("./routes/authRoutes");
const applicationRoutes = require("./routes/ApplicationRoutes");
const companyRoutes = require("./routes/companyRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const emailRoutes = require("./routes/emailRoutes");
const jobRoutes = require("./routes/jobRoutes");
const profileRoutes = require("./routes/profileRoutes");
const swaggerOptions = require("./config/docsConfig");
const swaggerjsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
const port =
  process.env.NODE_ENV === "test"
    ? process.env.NODE_LOCAL_TEST_PORT
    : process.env.NODE_LOCAL_PORT;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// dosc config
const swaggerDocs = swaggerjsdoc(swaggerOptions);

// Logging middleware
app.use(logging());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/send-email", emailRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/", categoryRoutes);
app.use("/backend-app", getFile);
app.use(
  "/api/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, { explorer: true })
);

//SERVER
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  connectToMongo();
});

app.get("/test", (req, res) => {
  res.json(
    "Server connection to client works!! Good Luck with your capstones :D"
  );
});

module.exports = app;
