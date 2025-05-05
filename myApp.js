const express = require("express");
const app = express();

// ====== CONFIGURE HELMET WITH ALL SECURITY MIDDLEWARE ======
const helmet = require("helmet");
const ninetyDaysInSeconds = 90 * 24 * 60 * 60;

app.use(
  helmet({
    // Enabled by default in helmet() but we're configuring explicitly:
    frameguard: { action: "deny" },
    hsts: {
      maxAge: ninetyDaysInSeconds,
      force: true,
      includeSubDomains: true,
    },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "trusted-cdn.com"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'"],
        objectSrc: ["'none'"], // Prevents all plugin content (e.g., Flash)
      },
    },
    noCache: true, // Enable noCache which isn't included by default
    dnsPrefetchControl: { allow: false }, // Disable DNS prefetching
  })
);

module.exports = app;
const api = require("./server.js");
app.use(express.static("public"));
app.disable("strict-transport-security"); // Keep this disabled as we're using helmet's HSTS
app.use("/_api", api);
app.get("/", function (request, response) {
  response.sendFile(__dirname + "/views/index.html");
});
let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Your app is listening on port ${port}`);
});
