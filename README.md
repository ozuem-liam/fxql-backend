<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# development with docker
$ docker build -t fxql-backend .

# run with docker mode
$ docker run -p 8080:8080 fxql-backend

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Links

1. Access the API at [http://localhost:8080](http://localhost:8080) if using docker build
2. Access the Swagger documentation at `{BASE_URL}`
3. You can also get the json version of the Swagger API docs at `BASE_URL/api-json`. This URL can be used to import the entire API into a postman collection


## Architectural Overview

The following things should be noted and adhered to when working on this API:

1. Follow the existing modular structure, and create new modules/sub-modules when it makes sense.

2. **Controllers** are to be "lean" i.e they are primarily for request validation (done by a combination of DTOs and the class-validator package), and routing requests to the appropriate business domain/service classes.

3. **Service** classes should handle all the custom business logic, but should **NEVER** directly interact with the database.

4. **Repository** classes are used to interact with the dataase via the PrismaClient (which is automatically to repository classes that extend the `BaseRepository`);

5. **Ensure** you follow a Test driven approach, and at least write E2E tests to validate that the APIs defined in the controllers work as expected.

6. Automatic linting/error checking has been setup when making commits/pushes to the remote repository, **ENSURE** you fix any reported issues before attempting a push.

7. **NEVER** create a function without adding a documentation block for it, especially controller functions, as the doc blocks there are used in the swagger API documentation.

## Modules Overview

1. **App** module which sets up the entire application
2. **FXQL** module which handles everything around FXQL statement generator
2. **Common** module which houses various things that will be used by more than one module, including things like:
    - Response Handler
    - Error Logging
    - Custom Validators
    - Base Repository class

## Tools Used

- Sentry for error reporting

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
# fxql-backend
