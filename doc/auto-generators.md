# Use automatic generators

Now that we have our lists of events, let's say we want a class listing them in PHP. To achieve this we will use an automatic generator.

Automatic generators are generators that are executed during the code generation without any definition in the model. They can be used to generate code depending on several model items.

Here is how to define the automatic generator:

```javascript
avifors.addAutoGenerator(model => [                                       // the method takes a builder function taking the model as an argument and returning a list of outputs
  {
    path: "src/Events.php",                                               // the path of the output
    template: "generators/events.template.php",                           // the path of the template to use
    variables: {                                                          // these variables will be added to the template
      events: model.filter(i => i.type === 'event').map(i => i.arguments) // here we want every event of the model
    }
  }
])
```

Add this piece of code in `generators/event.generator.js`.

Create also the following template at `generators/events.template.php`:

```php
<?php

namespace Acme;

class Events {
    public $events = [
        {{ events | map('event => event.name') | surround("'") | join(',\n        ') }}
    ];
}
```

At next code generation, the following file will be generated:

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

Next: [Use constructors](https://github.com/antarestupin/Avifors/tree/master/doc/constructors.md)
