# Define an automatic generator

Automatic generators are generators that are executed during the code generation without any definition in the model. They can be used to generate code depending on several model items.

Let's say we want a class listing the name of every event; here is how to define the automatic generator:

```js
avifors.addAutoGenerator(model => [                                       // the method takes a builder function taking the model as an argument and returning a list of outputs
  {
    path: "example/output/Events.php",                                    // the path of the output
    template: "example/generators/event/events.template.php",             // the path of the template to use
    variables: {                                                          // these variables will be added to the template
      events: model.filter(i => i.type === 'event').map(i => i.arguments) // here we want every event of the model
    }
  }
])
```

And this the template:

```php
<?php

namespace Acme;

class Events {
    public $events = [
        {{ events | map('event => event.name') | surround("'") | join(',\n        ') }}
    ];
}
```

The following file will be generated:

```php
<?php

namespace Acme;

class Events {
    public $events = [
        'user_registered',
        'password_changed'
    ];
}
```

Next: [Avifors plugins](https://github.com/antarestupin/Avifors/tree/master/doc/plugins.md)
