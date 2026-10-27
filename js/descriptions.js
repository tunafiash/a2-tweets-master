function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	let tweet_array = runkeeper_tweets.map(function(tweet) {
        return new Tweet(tweet.text, tweet.created_at);
    });

	writtenTweets = tweet_array.filter(function(tweet) {
		return tweet.written == true;
	}
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table

	let searchBox = document.getElementById("textFilter");
	let searchCount = document.getElementById("searchCount");
	let searchText = document.getElementById("searchText");
	let tableBody = document.getElementById("tableBody");

	searchBox.addEventListener('input', function() {
		let inputtedText = searchBox.ariaValueMax;
		let lowerCase = inputtedText.toLowerCase();

		// update text box span and check if box is empty
		searchText.innerText = inputtedText;
		if (inputtedText == "") {
			searchCount.innerText = 0;
			tableBody.innerHTML = "";
			return;
		}

		let searchedMatch = writtenTweets.filter(function(tweet) {
			let currentTweetText = tweet.text;
			let lowerCaseTweet = currentTweetText.toLowerCase();

			// check if inputted text results in an existing tweet
			if (lowerCaseTweet.includes(lowerCaseText)) {
				return true;
			}
			else {
				return false;
			}
		});

	})

}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});