// const config = require("./config");
const twit = require("twit");
const T = new twit(config);
// let createdAt=0;
function retweet() {
  console.log("started");
  let params = {
    q: "#WomenWhoCode",
    count: 10,
    result_type: "recent",
    lang: 'en'
  };
  T.get("search/tweets", params, (err, data, response) => {
    let tweets = data.statuses;
    console.log(params);
    if (!err) {
      for (let dat of tweets) {
        // console.log(dat);
        let retweetId = dat.id_str;
        T.post("statuses/retweet/:id", { id: retweetId }, (err, response) => {
          if (response && !err) console.log("Retweeted!!! " + retweetId);
          // console.log(response);
          let username = dat.user.screen_name;
          // let tweetId = response.id_str;
          console.log(
            "Retweeted: ",
            `https://twitter.com/${username}/status/${retweetId}`
          );
          if (err)
            console.log(
              "Something went wrong while RETWEETING... Duplication maybe..."
            );
        });
      }
    } else {
      console.log(err);
    }
  });
}
setInterval(retweet, 30000); //30000
