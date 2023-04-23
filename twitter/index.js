const Twitter = require("twitter");

const client = new Twitter({
  consumer_key: "33MbTVomuiRYSMLGzjGOClHUQ",
  consumer_secret: "62BzCq3G3XyEMf5QvVARmmIdMjXeBkNez61HsnENxJj1Kk3r1A",
  access_token_key: "2323952426-HNWqfBvdZ305Dg1W7gnCiMY9CF2anCZUqsHG2Rx",
  access_token_secret: "qlBTOlQPk3bqhGL78jgyIsXcqIibAcvQ75Exy7nTSQcDE",
});

// bearer AAAAAAAAAAAAAAAAAAAAAI5WmwEAAAAA7NDm56tob6dt1lujN2zr%2BhgcF4A%3DcSHFapnEuPUZEWfWzlYqR1DX3mpAV55lZqdCyL1QpC7CZAER1R

const params = {
  screen_name: "Doucluffy",
  count: 200,
  include_rts: false,
};

let allTweets = [];

const fetchTweets = (params) => {
  client.get("statuses/user_timeline", params, (error, tweets) => {
    if (error) {
      console.log(error);
    } else {
      allTweets = allTweets.concat(tweets);
      const oldestTweet = allTweets[allTweets.length - 1].id_str;

      if (tweets.length === 0) {
        console.log(`Nombre de tweets récupérés : ${allTweets.length}`);
        return;
      }

      params.max_id = oldestTweet;
      fetchTweets(params);
    }
  });
};

const tweets = fetchTweets(params);
console.log(tweets);
