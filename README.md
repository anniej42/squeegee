
# squeegee

clean a blurry glass window to reveal something special.

## Specifications
this app is written in front-end javascript, uses and `d3.js`, and is routed using `express`.  
the server is written in `node.js` and hosted on `heroku`.  

images use the google custom search engine API. the use of the custom search engine is subject to 100 search queries a day for free. if the service needs to support more queries, google has a paid option or we can switch to other image search services (flickr or 500px, for example). the server querying is done in `server.js`.

## Installation

first install `node` homebrew, by running `brew install node`, or downloading the installer from <https://nodejs.org/>.  

`cd` into the cloned repository, and run `npm install` to install dependencies.

## Usage
to start the app locally, type `npm start` or `heroku local` if heroku is installed.

to push to heroku, create a heroku account, install the heroku toolbelt, and follow instructions on https://devcenter.heroku.com/articles/deploying-nodejs.
