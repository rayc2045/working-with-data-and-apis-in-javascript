const express = require("express");

const app = express(),
  port = 3000;

app.use(express.static(__dirname));

app.listen(port, () => {
  console.log(`伺服器運行於 http://localhost:${port}`);
});
