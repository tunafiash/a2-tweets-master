function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	

	// sort tweets by time
	tweet_array.sort(function(x, y) {
		if (x.time < y.time) {
			return -1;
		}

		else if (x.time > y.time) {
			return 1;
		}

		else {
			return 0;
		}
	});

	// replace dates with retrieved earliest & latest tweets
	let earliestTweet = tweet_array[0];
	let latestTweet = tweet_array[tweet_array.length - 1];
	const dates = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};

	document.getElementById('firstDate').innerText = earliestTweet.time.toLocaleDateString('en-US', dates);
	document.getElementById('lastDate').innerText = latestTweet.time.toLocaleDateString('en-US', dates);

	// counting and formatting categorized tweets
}


//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});