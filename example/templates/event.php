<?php

{%- set varattributes = attributes | varcamelcase %}

namespace Acme\Events;

class {{ name | camelcase }} extends BaseEvent {
    {%- for attr in varattributes %}
    private ${{ attr }};
    {% endfor %}

    public function __construct(
        ${{ name | varcamelcase }}{% if attributes | length %},{% endif %}
        {{ varattributes | prepend('$') | join(', ') }}
    ) {
        $this->name = ${{ name | varcamelcase }};
        {%- for attr in varattributes %}
        $this->{{ attr }} = ${{ attr }};
        {%- endfor %}
    }

    public function getName() {
        return $this->{{ name | varcamelcase }};
    }

    {% for attr in attributes %}
    public function get{{ attr | camelcase }}() {
        return $this->{{ attr | varcamelcase }};
    }
    {% endfor %}
}
