var path = require("path");
var twit = require('twit');
var sentimental = require('Sentimental');
var config = require("../config")

exports.index = function(req, res){
  res.render('index', { title: "Twit-Decision"});
};

exports.map = function(req, res){
  res.render('map', { title: "Twit-Map"});
};

exports.ping = function(req, res){
  res.send("pong!", 200);
};

function performAnalysis(tweetSet, geoSet) {
  //set a results variable
  var results = 0;
  // iterate through the tweets, pulling the text, retweet count, and favorite count
  for(var i = 0; i < tweetSet.length; i++) {
    tweet = tweetSet[i]['text'];
    if (tweetSet[i].geo != null) {
	geoSet.push(tweetSet[i]);
    }
    retweets = tweetSet[i]['retweet_count'];
    favorites = tweetSet[i]['favorite_count'];
    // remove the hastag from the tweet text
    tweet = tweet.replace('#', '');
    // perform sentiment on the text
    var score = sentimental.analyze(tweet)['score'];
    // calculate score
    results += score;
    if(score > 0){
      if(retweets > 0) {
        results += (Math.log(retweets)/Math.log(2));
      }
      if(favorites > 0) {
        results += (Math.log(favorites)/Math.log(2));
      }
    }
    else if(score < 0){
      if(retweets > 0) {
        results -= (Math.log(retweets)/Math.log(2));
      }
      if(favorites > 0) {
        results -= (Math.log(favorites)/Math.log(2));
      }
    }
    else {
      results += 0;
    }
  }
  // return score
  results = results / tweetSet.length;
  return results
}

exports.search = function(req, res) {
  // grab the request from the client
  var choices = JSON.parse(req.body.choices);
  // grab the current date
  var today = new Date();
  // establish the twitter config (grab your keys at dev.twitter.com)
  var twitter = new twit({
    consumer_key: config.twitterKey,
    consumer_secret: config.twitterSecret,
    access_token: config.token,
    access_token_secret: config.secret
  });
  // set highest score
  var highestScore = -Infinity;
  // set highest choice
  var highestChoice = null;
  // create new array
  var array = [];
  var geoSet = [];
  // set score
  var score = 0;
  console.log("----------")

// iterate through the choices array from the request
  for(var i = 0; i < choices.length; i++) {
    (function(i) {
    // add choice to new array
    array.push(choices[i])
    // grad 20 tweets from today
    twitter.get('search/tweets', {q: '' + choices[i] + ' since:' + today.getFullYear() + '-' +
      (today.getMonth() + 1) + '-' + today.getDate(), count:2000}, function(err, data) {
        // perform sentiment analysis
	score = performAnalysis(data['statuses'], geoSet);
        console.log("score:", score);
        console.log("choice:", choices[i]);
	for (var tweet in geoSet) {
		console.log("geoSet:", geoSet[tweet].geo.coordinates);
	}
        //  determine winner
        if(score > highestScore) {
          highestScore = score;
          highestChoice = choices[i];
          console.log("winner:",choices[i])
        }
        console.log("");
      });
    })(i)
  }
  // send response back to the server side; why the need for the timeout?
  setTimeout(function() { res.end(JSON.stringify({'score': highestScore, 'choice': highestChoice, 'geoSet': geoSet })) }, 5000);  
};
