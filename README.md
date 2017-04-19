# Avifors

[![Build Status](https://travis-ci.org/antarestupin/Avifors.svg?branch=master)](https://travis-ci.org/antarestupin/Avifors)
[![Code Climate](https://codeclimate.com/github/antarestupin/Avifors/badges/gpa.svg)](https://codeclimate.com/github/antarestupin/Avifors)

Avifors is a MDE ([Model-Driven Engineering](https://en.wikipedia.org/wiki/Model-driven_engineering)) tool to define the business model of your app in a declarative and readable way using YAML, and associate generators to this model, that will generate the code needed from the model by using [Nunchuks](https://mozilla.github.io/nunjucks) templates. It also provides commands allowing you to make the model easier to understand - you can for example query it to get interesting parts of it depending on your needs -, and allows you to create more commands to play with the model.

## Features

- Generate code from model using [Nunchuks](https://mozilla.github.io/nunjucks) templates
- Use validators to avoid wrong definitions in the model
- Create your own validators, builders and types to ease the model definition
- Query the model to answer most questions you could have about the model
- Create your own commands to do more
- Use constructors functions to reduce the size of complex definitions
- Use the plugins system to extend Avifors, e.g to add global variables, use libraries...

## Documentation

- [Getting started](https://github.com/antarestupin/Avifors/tree/master/doc/getting_started.md)
- [Commands and options](https://github.com/antarestupin/Avifors/tree/master/doc/commands.md)
- [Define the model](https://github.com/antarestupin/Avifors/tree/master/doc/model.md)
- [Define a generator](https://github.com/antarestupin/Avifors/tree/master/doc/generator.md)
- [Define an automatic generator](https://github.com/antarestupin/Avifors/tree/master/doc/auto-generators.md)
- [Avifors plugins](https://github.com/antarestupin/Avifors/tree/master/doc/plugins.md)
