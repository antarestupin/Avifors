# Getting started

## Install Avifors

Of course, the first step is to install Avifors:

```bash
yarn global add avifors
# or
npm install -g avifors
```

## Define a first generator

Create a folder `generators` and create in it a file named `event.generator.js` with the following contents:

```javascript
module.exports.default = function(avifors) {
  avifors.setGenerator('event', {     // 'event' is the name of our generator
    list: "events",                   // 'events' is the name to use when listing events in a model file
    key: "name",                      // When using a list of events, the key used to identify an event will then be set as its 'name'

    arguments: {                      // Here we define the interface of the model definition, i.e. how to define an event
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

## Define a template

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
    {% for attr in attributes %}
    public function get{{ attr | pascalcase }}() {
        return $this->{{ attr | camelcase }};
    }
    {% endfor %}
}
```

## Define your model

Create a folder `model` and put in it a create called `event.model.yml` and with the following contents:

```yaml
event:
  name: user_registered
  attributes: [user_id, email_address, encrypted_password]
```

## Add configuration

Create the file `.avifors.yml` with the following contents:

```yaml
plugins:
  - "./generators/**/*.generator.js"

model:
  - "./model/**/*.model.yml"
```

## Generate the code

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

Next: [Commands and options](https://github.com/antarestupin/Avifors/tree/master/doc/commands.md)
