# `npm start`
Runs frontend concurrently with backend (for development). For Heroku deployment switch to `heroku` branch.

## [`package.json`](package.json#L16)
```json
"scripts": {
  ...
    "start": "export NODE_OPTIONS=\"--max-old-space-size=8192\" && conc \"node ../backend/server\" \"react-scripts start\""
  ...
}
```

### `export NODE_OPTIONS="--max-old-space-size=8192"`
Needed due to memory issue after importing [`@emurgo/cardano-serialization-lib-asmjs`](https://www.npmjs.com/package/@emurgo/cardano-serialization-lib-asmjs) as per https://github.com/dynamicstrategies/cardano-wallet-connector#troubleshooting

### `conc`
[`npm i concurrently`](https://www.npmjs.com/package/concurrently)
