// const mongoose = require("mongoose");
const dotenv = require("dotenv");


const app = require("./app");

// const DB = process.env.DATABASE.replace(
//   "[YOUR-PASSWORD]",
//   process.env.DATABASE_PASSWORD
// );

// mongoose
//   .connect(DB)
//   .then(() => console.log("DB connection successful!"))
//   .catch((err) => console.error("DB connection failed:", err));

const port = process.env.PORT || 2025;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
