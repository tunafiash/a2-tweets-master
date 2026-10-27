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

		if (activityType !== "unknown" && distance > 0) {
			if (numActivity[activityType] == undefined) {
				numActivity[activityType] = 0;
				activityDistances[activityType] = 0;
			}
	
			numActivity[activityType]++;
			activityDistances[activityType] += distance;
	
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
		let xDistance = activityDistances[x] / numActivity[x];
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
		higherAverage = "weekdays";
	}

	else if (weekendAverage > weekdayAverage) {
		higherAverage = "weekends";
	}

	// update spans
	document.getElementById('numberActivities').innerText = activityArray.length;
	document.getElementById('firstMost').innerText = first;
	document.getElementById('secondMost').innerText = second;
	document.getElementById('thirdMost').innerText = third;

	document.getElementById('longestActivityType').innerText = longestActivity;
	document.getElementById('shortestActivityType').innerText = shortestActivity;
	document.getElementById('weekdayOrWeekendLonger').innerText = higherAverage;

	
	// -- VISUALIZATION SECTION --

	let topThreeTweets = [];
    let daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    tweet_array.forEach(function(tweet) {
        if (tweet.activityType === first || tweet.activityType === second || tweet.activityType === third) {
            topThreeTweets.push({
                "activity": tweet.activityType,
                "distance": tweet.distance,
                "day": daysOfWeek[tweet.time.getDay()]
            });
        }
    });

	// graph 1: how many of each type of activity exists in the dataset
	let activityData = [];
    let types = Object.keys(numActivity);

    types.forEach(function(type) {
        activityData.push({
            "activity": type, 
            "count": numActivity[type]
        });
    });

	activity_vis_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A graph of the number of Tweets containing each type of activity.",
		"data": {
			"values": activityData
		},
		"mark": "bar",
		"encoding": {
			"x": {
				field: "activity",
				type: "nominal"
			},

			"y": {
				field: "count",
				type: "quantitative"
		}
		}
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	// graph 2: distances by day of the week: including top 3 activities
    let distance_vis_spec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "description": "Distances by day of the week for top 3 activities.",
        "data": { 
			"values": topThreeTweets
		},
        "mark": "point",
        "encoding": {
            "x": {
                "field": "day",
                "type": "nominal",
                "sort": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
            },

            "y": {
				"field": "distance",
				"type": "quantitative",
			},

            "color": {
				"field": "activity",
				"type": "nominal",
			}
        }
    };
    vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});

    // graph 3: distances by day of the week: including top 3 activities
	// + AGGREGATING BY MEAN
    let distance_vis_aggregated_spec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "description": "Mean distances by day of the week for top 3 activities.",
        "data": { 
			"values": topThreeTweets
		},
        "mark": "point",
        "encoding": {
            "x": {
                "field": "day",
                "type": "nominal",
                "sort": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            },
            "y": { 
                "field": "distance", 
                "type": "quantitative", 
                "aggregate": "mean",
            },
            "color": {
				"field":"activity",
				"type": "nominal",}
        }
    };
    vegaEmbed('#distanceVisAggregated', distance_vis_aggregated_spec, {actions:false});

	// toggle button between visualizations 2 & 3
	let aggregateButton = document.getElementById('aggregate');
    let allPointsVis = document.getElementById('distanceVis');
    let meansVis = document.getElementById('distanceVisAggregated');

    // hide means graph upon page load
    meansVis.style.display = 'none';

    aggregateButton.addEventListener('click', function() {
        if (allPointsVis.style.display === 'block' || allPointsVis.style.display === '')
			{
            allPointsVis.style.display = 'none';
            meansVis.style.display = 'block';
            aggregateButton.innerText = 'Show all activities';
        } 

        else {
            allPointsVis.style.display = 'block';
            meansVis.style.display = 'none';
            aggregateButton.innerText = 'Show means';
        }
    });
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});