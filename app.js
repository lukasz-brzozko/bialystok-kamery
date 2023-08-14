const { readFileSync, writeFileSync, appendFileSync } = require("fs");
const { resolve } = require("path");

const PATHS = {
  distMeta: resolve(__dirname, "dist", "index.meta.js"),
  distUser: resolve(__dirname, "dist", "index.user.js"),
  indexMeta: resolve(__dirname, "src", "index.meta.js"),
  indexUser: resolve(__dirname, "src", "index.user.js"),
};

const copyMeta = () => {
  const metaText = readFileSync(PATHS.indexMeta, "utf8");
  const userText = readFileSync(PATHS.indexUser, "utf8");

  writeFileSync(PATHS.distMeta, metaText);
  writeFileSync(PATHS.distUser, metaText);
  appendFileSync(PATHS.distUser, userText);
};

copyMeta();
