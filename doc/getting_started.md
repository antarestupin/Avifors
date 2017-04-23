# Getting started

In this example, we want to express in our model the events that can happen in our application, and generate PHP code to manipulate them as objects.

Create a folder in which we will do this work, and let's start.

## Install Avifors

Of course, the first step is to install Avifors. You can do it with [Yarn](https://yarnpkg.com) or [npm](https://www.npmjs.com):

```bash
yarn global add avifors
# or
npm install -g avifors
```

For a project, you should install Avifors locally and call it via `node_modules/.bin/avifors`:

```bash
yarn add avifors
# or
npm install avifors

# ...

node_modules/.bin/avifors generate
```

## Define your model

Create a folder `model` in which we will put the domain model of our app. In our case, we will first create an event for a user registration. To do this, create in `model` a folder `events` and add in it a file named `user_registered.model.yml` and with the following contents:

```yaml
event:
  name: user_registered
  attributes: [user_id, email_address, password]
```

Now we have a clear definition of our event, but nothing to generate the code.

## Define a first generator

We must first create the generator that will define what an event is and how to handle it.

Create a folder `generators` and create in it a file named `event.generator.js` with the following contents:

```javascript
module.exports.default = function(avifors) {
  avifors.setGenerator('event', {     // 'event' is the name of our generator
    list: "events",                   // 'events' is the name to use when listing events in a model file
    key: "name",                      // When using a list of events, the key used to identify an event will then be set as its 'name'

    arguments: {                       // Here we define the interface of the model definition, i.e. how to define an event
      name: avifors.types.string(),    // The name of the event is a string
      attributes: avifors.types.list(  // Here we want a list of strings as attributes
        avifors.types.string()
      )
    },

    outputs: [                                          // Here we define which files will be written for each event
      {
        path: "src/Event/{{ name | pascalcase }}.php",  // We want the file to have the name of the event PascalCased
        template: "generators/event/event.template.php" // This template will be used to generate the code
      }
    ]
  })
}
```

As you may guess, the last piece to add is the template.

## Define a template

The template will receive the definition of our event as arguments.

In `generators/event`, create a file named `event.template.php` with the following contents:

```php
<?php

{% set camelCasedAttributes = attributes | camelcase -%}

namespace Acme\Event;

class {{ name | pascalcase }} extends BaseEvent {
    private $name;
    {% for attr in camelCasedAttributes %}
    private ${{ attr }};
    {% endfor %}

    {# Constructor - each attribute is passed as an argument #}
    public function __construct({{ camelCasedAttributes | prepend('$') | join(', ') }}) { {# ['username', 'password'] -> '$username, $password' #}
        $this->name = '{{ name | kebabcase }}';
        {% for attr in camelCasedAttributes %}
        $this->{{ attr }} = ${{ attr }};
        {% endfor %}
    }

    {# Getters #}
    {% for attr in camelCasedAttributes %}
    public function get{{ attr | pascalcase }}() {
        return $this->{{ attr }};
    }
    {% endfor %}
}
```

Here you can see that custom filters have added to help creating code templates, like `camelcase`. The list of Avifors Nunjucks filters and functions is [here](https://github.com/antarestupin/Avifors/tree/master/doc/templates.md). You can also create you own [filters and functions](https://github.com/antarestupin/Avifors/blob/master/doc/plugins.md#change-environment-of-templates).

## Add configuration

The last step is to create the Avifors configuration file. By default Avifors will look for a `.avifors.yml` file in current directory, but you can override this behavior by adding `--config='path/to/your/config.yml'` to the commands you run.

Create the file `.avifors.yml` with the following contents:

```yaml
plugins:                              # Avifors will load these files as plugins...
  - "./generators/**/*.generator.js"

model:                                # ... and these ones as the model
  - "./model/**/*.model.yml"
```

## Generate the code

Now we have everything in place, let's run Avifors!

Run the following command:

```
avifors generate
```

The file `src/Event/UserRegistered.php` has been created with the following contents:

```php
<?php

namespace Acme\Event;

class UserRegistered extends BaseEvent {
    private $name;
    private $userId;
    private $emailAddress;
    private $encryptedPassword;


    public function __construct($userId, $emailAddress, $encryptedPassword) {
        $this->name = 'user-registered';
        $this->userId = $userId;
        $this->emailAddress = $emailAddress;
        $this->encryptedPassword = $encryptedPassword;
    }


    public function getUserId() {
        return $this->userId;
    }
    public function getEmailAddress() {
        return $this->emailAddress;
    }
    public function getEncryptedPassword() {
        return $this->encryptedPassword;
    }
}
```

Next: [Define lists of items](https://github.com/antarestupin/Avifors/tree/master/doc/lists.md)
