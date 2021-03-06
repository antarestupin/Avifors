# Avifors

[![Build Status](https://travis-ci.org/antarestupin/Avifors.svg?branch=master)](https://travis-ci.org/antarestupin/Avifors)
[![Code Climate](https://codeclimate.com/github/antarestupin/Avifors/badges/gpa.svg)](https://codeclimate.com/github/antarestupin/Avifors)
[![MIT License](https://poser.pugx.org/antares/accessible/license)](https://github.com/antarestupin/Avifors/blob/master/LICENSE)

A [Model-Driven Engineering](https://en.wikipedia.org/wiki/Model-driven_engineering) tool that generates code from a YAML definition of your app domain model.

[![Example](https://raw.githubusercontent.com/antarestupin/Avifors/master/doc/example.gif)](https://github.com/antarestupin/Avifors/tree/master/doc/example.gif)

## Motivation / Objectives

I want the domain model of my application to be simple to understand. To achieve this goal, I want it to be written in a declarative way, and the actual code generated consistently. I also don't want to use an heavy software like Rational Rose to create it, I want it to be included as code in my project.

When Avifors will be stable I'd like to develop libraries allowing to make more complex work based on standards, like generating a full REST API with filtering, pagination, hypermedia links... with only the resources definition. I also plan to write a tool to visualize the model, like in an UML software, if it appears to be relevant.

Here are examples of what is possible to do with Avifors:

- Generate the domain part of an application source code
- Generate code from the model in different languages to share it between frontend/backend or between microservices
- Generate a full REST / GraphQL API
- Or simply simplify a repetitive part of your code by generating it from a single template

## How to use it

1. Define you app domain model declaratively using YAML
2. Define generators to make sense of the model and [Nunjucks](https://mozilla.github.io/nunjucks) templates to generate code from it
3. `avifors generate`: your code is generated ✨

## Features

- Can be used to generate code in any language - your domain model becomes independent of your app language
- Use builders and constructors functions to ease the model definition
- Use validators to avoid wrong definitions in the model
- Query the model to answer most questions (even complex ones) you could have about the model using [Avifors queries](https://github.com/antarestupin/Avifors/blob/master/doc/queries.md)
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
- [Define lists of items](https://github.com/antarestupin/Avifors/tree/master/doc/lists.md)
- [Use automatic generators](https://github.com/antarestupin/Avifors/tree/master/doc/auto-generators.md)
- [Use constructors](https://github.com/antarestupin/Avifors/tree/master/doc/constructors.md)
- [Types, validators and builders](https://github.com/antarestupin/Avifors/tree/master/doc/types-validators-builders.md)
- [Query the model](https://github.com/antarestupin/Avifors/tree/master/doc/queries.md)
- [Print generators interfaces](https://github.com/antarestupin/Avifors/tree/master/doc/interface.md)
- [Avifors plugins](https://github.com/antarestupin/Avifors/tree/master/doc/plugins.md)
- [Nunjucks templates environment](https://github.com/antarestupin/Avifors/tree/master/doc/templates.md)

## Contributions

Contributions are welcome 🙏

Though the codebase is not complex, I've added [this file](https://github.com/antarestupin/Avifors/blob/master/.structure.yml) to describe the files structure of Avifors, to make life easier to newcomers.
