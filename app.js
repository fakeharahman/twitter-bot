// const config = require("./config");
const fs = require("fs");
const path = require("path");
// const retweeted=require("./retweeted.json")
const token = process.env["ACCESS_TOKEN"];
const secret = process.env["ACCESS_TOKEN_SECRET"];
const consumer = process.env["CONSUMER_KEY"];
const csecret = process.env["CONSUMER_SECRET"];

const config = {
  access_token: token,
  access_token_secret: secret,
  consumer_key: consumer,
  consumer_secret: csecret,
};

const twit = require("twit");
const T = new twit(config);

function retweet() {
  console.log("started");
  let params = {
    q: "#WomenInSTEM OR #WomenWhoCode OR #WomenInTech OR #GirlsWhoCode",
    count: 15,
    result_type: "recent",
    lang: "en",
  };
  T.get("search/tweets", params, (err, data, response) => {
    let tweets = data.statuses;
    if (!err) {
      let retweetArray = fs.readFileSync(
        path.join(__dirname, "retweeted.json")
      );
      retweetArray = JSON.parse(retweetArray);
      console.log(retweetArray);
      for (let dat of tweets) {
        let retweetId = dat.id_str;
        let username = dat.user.screen_name;
        // console.log(dat);
        // let timestamp = dat.created_at;
        if (dat.retweeted_status) {
          retweetId = dat.retweeted_status.id_str;
        }
        if (!retweetArray.includes(retweetId)) {
          retweetArray.push(retweetId);
          console.log("yes");
          T.post("statuses/retweet/:id", { id: retweetId }, (err, response) => {
            if (response && !err) {
              console.log("Retweeted!!! " + retweetId);
              console.log(
                "Retweeted: ",
                `https://twitter.com/${username}/status/${retweetId}`
              );
            }
            if (err)
              console.log(
                "Something went wrong while RETWEETING... Duplication maybe..."
              );
          });
        }
      }
      fs.writeFile(
        path.join(__dirname, "retweeted.json"),
        JSON.stringify(retweetArray),
        function (err) {
          console.log(err);
        }
      );
    } else {
      console.log(err);
    }
  });
}

const clearJson = () => {
  fs.writeFileSync(
    path.join(__dirname, "retweeted.json"),
    JSON.stringify([])
  );
};

setInterval(retweet, 600000); //30000
setInterval(clearJson, 10800000);
