# Api Task


## Assumptions
I didn't use mongodb and redis, since my mac is not working and i'm using a very old windows pc, which has an issue with running mongodb locally.
<br/>Therefore : 
1. `/data/stat` and `/data/get` aren't really necessary since i haven't implemented mongodb.
2. There's a local db for [users and data](./src/data.js) which is quite an ugly hack, but its the best i can do with my own resources.

## Run from tests
In order to test the api, you can use `yarn start:test`.
In order to run the api, you can use `yarn start` (though its not really usefull, since there's no app to run with it)