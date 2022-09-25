# React/blockfrost-js frontend
React/[blockfrost-js](https://github.com/blockfrost/blockfrost-js) integration. 
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). 
<img src="screenshots/0_HomePage0.png"/>

### `npm start`
Runs the app concurrently with [`node ../backend/server.js`](../backend/server.js) (for frontend development).\
For Heroku deployment see [`/README.md`](../README.md). \
\
[`package.json`](package.json#L16):
```json
"scripts": {
  ...
    "start": "conc \"node ../backend/server\" \"react-scripts start\""
  ...
}
```
[`npm i concurrently`](https://www.npmjs.com/package/concurrently)
