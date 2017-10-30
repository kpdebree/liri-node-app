var twitter_keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');
var Twitter = require('twitter');

var command = process.argv[2];
var command_string = process.argv[3];

var user_tweets = [];

var spotify_keys = {
	id: "c66acb2e924e42af951c060ae92ff2c8",
	secret: "52bb4a1764c849b494a3c5606ee4f5bd"
}

const twitter = new Twitter(twitter_keys)
const spotify = new Spotify(spotify_keys)


function initialize() {
	switch(command) {
		case "my-tweets":
			console.log("twitter confirmed")
			getTweets();
			break;
		case "spotify-this-song":
			getSpotify();
			break;
		case "movie-this":
			getMovie();
			break;
		case "do-what-it-says":
			readTxt();
			break;
		default:
			console.log("Please Enter A Valid Command");
	};
};

function getTweets() {
	user_tweets = [];
	var user_name = {screen_name: 'realDonaldTrump'};
	twitter.get('statuses/user_timeline', user_name, function(error, tweets, response) {
		if (!error) {
			console.log("TWITTER: Last 20 Tweets for @realDonaldTrump");
			for (i = 0; i < 20; i++) {
				user_tweets.push(tweets[i].text)
				console.log((i + 1) + ". " + tweets[i].text);
			}
		} else if (error) {
			console.log(error)
		};
	});

};

function getSpotify() {
	if (command_string === undefined) {
		command_string = "Never Going To Give You Up";
		console.log("String Undefined. Initiating Default Search")
	};
	spotify.search({ type: 'track', query: command_string }, function(err, data) {
		if (err) {
			console.log(err)
			return;
		} else {
			for (i = 0; i < data.tracks.items.length; i++) {
				console.log("Song: " + data.tracks.items[i].name)
				console.log("Artist: " +data.tracks.items[i].artists[0].name);
        		console.log("Album: "+data.tracks.items[i].album.name);
        		console.log("Link: "+data.tracks.items[i].href);
				console.log("=====================")
			};
		};
	});

};

function getMovie() {
	if(command_string === undefined) {
		command_string = "Mr. Nobody";
		console.log("default")
	};
	request('http://www.omdbapi.com/?apikey=40e9cece&t=' + command_string + '&y=&plot=short&r=json&tomatoes=true', function (error, response, body) {
		if ( !error && response.statusCode == 200) {
			console.log("Success")
			var movie = JSON.parse(body);
		    console.log("Title: " + movie.Title);
		    console.log("Year: " + movie.Year);
		    console.log("imdb Rating: " + movie.imdbRating);
		    console.log("Country: " + movie.Country);
		    console.log("Language: " + movie.Language);
		    console.log("Plot: " + movie.Plot);
		    console.log("Actors: " + movie.Actors);
		    console.log("RottenTomatoes Rating: " + movie.tomatoRating);
		    console.log("RottenTomatoes Link: " + movie.tomatoURL);
		} else {
			console.log("Error")
			console.log(response.statusCode)
		}
	})
}

function readTxt(){
  fs.readFile("./random.txt", "utf8", function(err, data){
    if (err) {
    	console.log(err)
      	throw err;
    } else if (!err) {
      	dataSplit = data.split(",");
     	command = dataSplit[0];
      	command_string = dataSplit[1];
      	initialize();
    };
  });
};

initialize();