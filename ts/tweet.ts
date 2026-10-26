class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {

        // convert to lowercase for case sensitivity
        let lower = this.text.toLowerCase();

        if (lower.startsWith('currently') || lower.startsWith('right now') || lower.includes('come with me') || lower.includes('completing')
        || lower.includes('doing')) {

            return 'live_event';

        }

        else if (lower.startsWith('just finished') || lower.startsWith('done with') || lower.startsWith('just completed')
        || lower.startsWith('just concluded') || lower.startsWith('just achieved') || lower.startsWith('just accomplished') || lower.startsWith('just posted')
        || lower.includes('finished') || lower.includes('completed') || lower.includes('achieved') || lower.endsWith('#runkeeper')) {

            return 'completed_event';

        }

        // checks for completed event before personal goals --> completeness overrides PB/PR based on Prof. Reid's slack msg ?
        else if (lower.includes('my goal') || lower.includes('my achievement') || lower.includes('pr') || lower.includes('pb')
        || lower.includes('personal best') || lower.includes('personal goal') || lower.endsWith('#fitnessalerts')) {

            return 'achievement';
        }

        else {
            return 'miscellaneous';
        }
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {

        let lower = this.text.toLowerCase();


        if (lower.includes('with @runkeeper. check it out!')) {
            return false;
        }

        else {
            return true;
        }
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }

        let mainText = this.text.slice(0, -2);
        const divider = ' - '

        if (mainText.startsWith('Just ') && mainText.includes(divider)) {
            const dividerIndex = mainText.indexOf(divider);
            return mainText.substring(dividerIndex + divider.length).trim();
        }

        return mainText;
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }

        let lowerText = this.text.toLowerCase()

        // hardcode top 3 common activities
        if (lowerText.includes("run")) {
            return "run";
        }
        if (lowerText.includes("bike")) {
            return "bike";
        }
        if (lowerText.includes("walk")) {
            return "walk";
        }
        
        // parse less common activities based on completed events format
        let miIndex = this.text.indexOf(" mi ");
        let kmIndex = this.text.indexOf(" km ");
        if (miIndex == -1 && kmIndex == -1) {
            return "unknown"
        }

        // slices start and end
        let sliceStart = -1;
        if (miIndex != -1) {
            sliceStart = miIndex + 4;
        }
        else if (kmIndex != -1) {
            sliceStart = kmIndex+ 4;
        }

        let sliceEnd = this.text.indexOf(" with ", sliceStart);
        if (sliceEnd == -1) {
            sliceEnd = this.text.indexOf(" - ", sliceStart);
        }

        // return the activity
        if (sliceEnd !== -1) {
            return this.text.substring(sliceStart, sliceEnd).trim();
        }

        return "unknown";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }

        // parses mi and converts to float
        if (this.text.includes(" mi ")) {

            let frontSlice = this.text.split(" mi ")[0];
            let separated = frontSlice.split(" ");
            let distanceString = separated[separated.length - 1];
    
            return parseFloat(distanceString);
        }

        // parses km, convert to mi (1 mi = 1.609 km)
        else if (this.text.includes( " km ")) {
            let frontSlice = this.text.split(" km ")[0];
            let separated = frontSlice.split(" ");
            let distanceString = separated[separated.length - 1];

            return parseFloat(distanceString) / 1.609;
        }

        // returns 0 for time-based workouts
        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}