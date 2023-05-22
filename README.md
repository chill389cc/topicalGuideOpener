# Topical Guide Opener
This repo stores some scripts that I use to reduce big web pages from the Church of Jesus Christ of Latter-day Saints website down to a list of links that I can easily read one-by-one. This is particularly useful for classes that assign lists of readings.
## Use
1. Clone the repo
2. Populate an `html` directory in the repo directory with html files for each web page whose links you want to parse. This works best if you copy in only those html elements that contain the links, such as the parent element containing the links and not the entire page itself.
3. Run `node createCSV.js` (with a recent version of node, such as version 18). This will create a `scriptures.csv` file which you can use to view a list of all of the scriptures that you are going to be reading.
4. Whenever you need to, run `node readScriptures.js`. This program will ask for a starting index representing which scripture you are on, and then start opening scriptures for you to read one-by-one.

