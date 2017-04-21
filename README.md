# Avifors

[![Build Status](https://travis-ci.org/antarestupin/Avifors.svg?branch=master)](https://travis-ci.org/antarestupin/Avifors)
[![Code Climate](https://codeclimate.com/github/antarestupin/Avifors/badges/gpa.svg)](https://codeclimate.com/github/antarestupin/Avifors)
[![MIT License](https://poser.pugx.org/antares/accessible/license)](https://github.com/antarestupin/Avifors/blob/master/LICENSE)

A [Model-Driven Engineering](https://en.wikipedia.org/wiki/Model-driven_engineering) tool that generates code from a YAML definition of your app domain model.

TODO: gif example

## How to use it

1. Define you app domain model declaratively using YAML
2. Define generators to make sense of the model and [Nunjucks](https://mozilla.github.io/nunjucks) templates to generate code from it
3. `avifors generate`: your code is generated ✨

## Motivation

TODO

Here are examples of what is possible to do with Avifors:

- Generate the domain part of an application source code
- Generate code from the model in different languages to share it between frontend/backend or between microservices
- Generate a full REST / GraphQL API

## Features

- Can be used to generate code in any language - your domain model becomes independent of your app language
- Use builders and constructors functions to ease the model definition
- Use validators to avoid wrong definitions in the model
- Query the model to answer most questions (even complex ones) you could have about the model using [Avifors queries](https://github.com/antarestupin/Avifors/blob/master/doc/commands.md#query-the-model)
- Use the plugins system to extend Avifors: add Nunjucks global variables, create your own validators, builders, types or even commands 🚀

## Installation

You can install Avifors using [Yarn](https://yarnpkg.com) or [npm](https://www.npmjs.com):

```bash
yarn global add avifors
# or
npm install -g avifors
```

## Documentation

- [Getting started](https://github.com/antarestupin/Avifors/tree/master/doc/getting_started.md)
- [Commands and options](https://github.com/antarestupin/Avifors/tree/master/doc/commands.md)
- [Define the model](https://github.com/antarestupin/Avifors/tree/master/doc/model.md)
- [Define a generator](https://github.com/antarestupin/Avifors/tree/master/doc/generator.md)
- [Define an automatic generator](https://github.com/antarestupin/Avifors/tree/master/doc/auto-generators.md)
- [Avifors plugins](https://github.com/antarestupin/Avifors/tree/master/doc/plugins.md)
