import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";

import fs from "fs";

dotenv.config();
const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const makeid = (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};
const readData = () => {
  let rawdata = fs.readFileSync("urls.json");
  let urls = JSON.parse(rawdata);
  return urls;
};

const setUrlData = (data) => {
  let urls = readData();

  const result = urls.filter((item) => item.lurl === data.lurl);

  console.log(result);
  if (result.length > 0) {
    const result = urls.findIndex((item) => item.lurl === data.lurl);
    urls[result] = data;
  } else {
    urls.push(data);
  }

  let urlData = JSON.stringify(urls);
  fs.writeFileSync("urls.json", urlData);
};

const getShortUrl = (url) => {
  let urls = readData();
  const result = urls.filter((item) => item.lurl == url);
  return result[0];
};

const getLongUrl = (url) => {
  let urls = readData();
  const result = urls.filter((item) => item.surl === url);
  return result[0];
};

app.post("/save", (req, res) => {
  const shortUrl = makeid(6);

  const dataObj = {
    lurl: req.body.url,
    surl: shortUrl,
  };
  setUrlData(dataObj);
  res.send(dataObj);
});

app.get("/all", (req, res) => {
  let rawdata = fs.readFileSync("urls.json");
  let urls = JSON.parse(rawdata);

  res.send(urls);
});

app.post("/reqsurl", (req, res) => {
  const result = getShortUrl(req.body.url);

  console.log(result);
  res.send(result);
});

app.post("/reqlurl", (req, res) => {
  const result = getLongUrl(req.body.url);
  res.send(result);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server live on ${port}`);
});
