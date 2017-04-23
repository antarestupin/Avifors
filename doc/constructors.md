# Use constructors

In this section we will change the definition of our events in order to have constraints on the values that can be set to their attributes:

```javascript
// this function will abstract a constraint
const constraint = () => avifors.types.map({  // a constraint is a map (or dictionary, or JS object)
  type: avifors.types.string()                // a constraint must have at least a 'type' field
}, { strict: false })                         // the 'strict' option is disabled so that the map can have other fields that 'type'

avifors.setGenerator('event', {
  // ...

  arguments: {
    name: avifors.types.string(),
    attributes: avifors.types.list(
      avifors.types.map({                             // now instead of strings, attributes will be maps
        name: avifors.types.string(),                 // the value we used to define them will be put in the 'name' field
        constraints: avifors.types.list(constraint()) // and they will have a list of constraints
      }, {
        defaults: {                                   // we can define default values for maps, so that we won't have to put empty values
          constraints: []                             // in this case, if we don't define constraints for an attributes, it will be set to an empty list
        }
      })
    )
  },

  // ...
})
```

Now we can update our model to respect this specification:

```yaml
events:
  user_registered:
    attributes:
      - { name: user_id }
      - { name: email_address }
      - name: password
        constraints:
          - type: length-between
            min: 12
            max: 50

  password_changed:
    attributes:
      - { name: user_id }
      - { name: new_password }
```

As you can see, we want users' password to have a length between 12 and 50 characters.

Although this is readable, we could have a more concise, yet still readable definition of the constraint using a constructor.

First you need to define the constructor in your Avifors plugin:

```javascript
avifors.constructors.constraints = {
  between: (min, max) => ({
    type: 'lengthBetween',
    min: min,
    max: max
  })
}
```

Then, to use it in the model, call it like this:

```yaml
events:
  user_registered:
    attributes:
      - { name: user_id }
      - { name: email_address }
      - name: password
        constraints:
          - .constraints.lengthBetween(0,1)

  # ...
```

The pattern is simple: begin the definition with a dot, then call the method like in Javascript (actually it is JS under the hood). The method call string will be converted before the model validation.

In the template, we can now change the constructor to check the attributes values:

```php
<?php

{% set camelCasedAttributes = attributes.map("i => i.name") | camelcase -%}

class {{ name | pascalcase }} extends BaseEvent {
    // ...

    public function __construct(/* ... */)
        $this->name = '{{ name | kebabcase }}';

        {% for attr in attributes %}
          {% for constraint in attr.constraints %}
            {% if constraint.type == "length-between" %}
              {% set attrVar = ('$'+attr.name) | camelcase  %}
              if ({{ attrVar }} < {{ constraint.min }} || {{ attrVar }} > {{ constraint.max }}) {
                throw new \InvalidArgumentException();
              }
            {% endif %}
          {% endfor %}
        {% endfor %}

        {% for attr in camelCasedAttributes %}
        $this->{{ attr }} = ${{ attr }};
        {% endfor %}
    }

    // ...
}
```

(Note that this is a quick and dirty check in the template, you shouldn't do this validation like this in real code; you could for example have a list of constraints in a dedicated library or template method to reuse, with the code associated to validate each use case)

Next: [Types, validators and builders](https://github.com/antarestupin/Avifors/tree/master/doc/types-validators-builders.md)
