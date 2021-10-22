# Casino royale

## About architecture

The solution was implemented with [SOLID](https://en.wikipedia.org/wiki/SOLID) principles and [Onion Architecture](https://jeffreypalermo.com/2008/07/the-onion-architecture-part-1/) mind. Main focus is on maintainability with emphasis on separation of concerns throughout the system. Layers are separated by interfaces. They define behavior contracts and stand as foundations amongst the layers. It is also easy to write different implementation of the interface. For example: if for some reason would like to change how and where the data is stored, one could simply write different implementation of repository without the need to change any business logic.

## Data persistance choice

[MongoDB](https://www.mongodb.com) was selected because of flexibility and scalability. It is expected to have a lot of data coming in and the db can be scaled-out. The schemas are likely to bo changed, so flexibility is important.

## Continuous integration

Also added simple [CI workflow](/actions/workflows/ci.yaml) on `Github actions` that triggers on each push to the server.
The workflow checks if all dependencies can be installed and builded. There is also static code analysis check, done with [linting](https://en.wikipedia.org/wiki/Lint_(software)) to ensure there is no stylistic errors and suspicions constructs. It also check if all test ran without errors.

## Testing

With interfaces between each layer it's easy to mock the dependencies that are not the focus of testing. For tests that use database, in memory database is used, so that tests run faster. The tests also run in github actions where there is no database infrastructure. The whole functionality was also manually tested with [Postman](https://www.postman.com/).

## How to build and start the application

* For package manager [Yarn](https://yarnpkg.com/) is used. If you don't already have it installed you can install it globally with `npm install yarn -g`.
* After that the command `yarn build` can be executed to transpile TypeScript to JavaScript.
* Application uses MongoDB for data persistance. You can [download](https://www.mongodb.com/try/download/community) and install it locally or if you don't have it already installed and you have [docker](https://www.docker.com/) you can run commands `docker pull mongo` and `docker run -d -p 27017:27017 mongo`.
* The application can be run with command `yarn start`.
* Api documentation can be found on `http://localhost:4000/api-docs`.
