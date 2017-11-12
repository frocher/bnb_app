# \<Botnbot\>


## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `polymer serve` to serve your application locally.

## Viewing Your Application

You can use either

```
npm start -- --dev
```

or

```
polymer serve --proxy-path=api --proxy-target=http://localhost:3000/
```


## Building Your Application

```
$ polymer build
```

This will create builds of your application in the `build/` directory, optimized to be served in production. You can then serve the built versions :

```
$ npm start
```

## Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.
