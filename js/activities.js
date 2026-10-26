function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	// tallying distances/lengths & activities
	let numWeekday = 0;
	let weekdayDistance = 0;
	let numWeekend = 0;
	let weekendDistance = 0;

	let numActivity = {};
	let activityDistances = {};

	tweet_array.forEach(function(tweet) {
		let activityType = tweet.activityType;
		let distance = tweet.distance;

		if (type !== "unknown" && distance > 0) {
			if (numActivity[type] == undefined) {
				numActivity[type] = 0;
				activityDistances[type] = 0;
			}
	
			numActivity[type]++;
			activityDistances[type] += distance;
	
			// check for day of the week
			let timeString = tweet.time.toString();
			if (timeString.includes("Sat ") || timeString.includes("Sun ")) {
				numWeekend++;
				weekendDistance += distance;
			}
	
			else {
				numWeekday++;
				weekdayDistance += distance;
			}
		}
	});

	// sort activities by frequency & retrieve top 3
	let activityArray = Object.keys(numActivity);

	activityArray.sort(function(x, y) {
		if (numActivity[x] > numActivity[y]) {
			return -1;
		}

		else if (numActivity[x] < numActivity[y]) {
			return 1;
		}

		else {
			return 0;
		}
	}); 

	let first = activityArray[0];
	let second = activityArray[1];
	let third = activityArray[2];

	// average & find longest & shortest distances
	let topThree = [first, second, third];

	topThree.sort(function(x, y) {
		let xDistance = activityDstances[x] / numActivity[x];
		let yDistance = activityDistances[y] / numActivity [y];
		
		if (xDistance > yDistance) {
			return -1;
		}

		else if (xDistance < yDistance) {
			return 1;
		}

		else {
			return 0;
		}
	});

	let longestActivity = topThree[0];
	let shortestActivity = topThree[2];

	// figure out if weekend or weekdays have higher average distance
	let weekdayAverage = weekdayDistance / numWeekday;
	let weekendAverage = weekendDistance / numWeekend;

	let higherAverage = "both";
	if (weekdayAverage > weekendAverage) {
		higherAverage = "weekends";
	}

	else if (weekendAverage > weekdayAverage) {
		higherAverage = "weekdays";
	}

	// update spans
	document.getElementById('numberActivities').innerText = activityArray.length;
	document.getElementById('firstmost').innerText = first;
	document.getElementById('secondmost').innerText = second;
	document.getElementById('thirdmost').innerText = third;

	document.getElementById('longestActivityType').innerText = longestActivity;
	document.getElementById('shortestActivityType').innerText = shortestActivity;
	document.getElementById('weekdayOrWeekendLonger').innerText = higherAverage;

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": tweet_array
	  }
	  //TODO: Add mark and encoding
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});