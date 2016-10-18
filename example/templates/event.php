<?php

{%- set varattributes = attributes | varcamelcase %}

namespace Acme\Event;

class {{ name | camelcase }} extends BaseEvent {
    {%- for attr in varattributes %}
    private ${{ attr }};
    {% endfor %}

    public function __construct({{ varattributes | prepend('$') | join(', ') }}) {
        $this->name = '{{ name | kebabcase }}';
        {%- for attr in varattributes %}
        $this->{{ attr }} = ${{ attr }};
        {%- endfor %}
    }

    {% for attr in attributes %}
    public function get{{ attr | camelcase }}() {
        return $this->{{ attr | varcamelcase }};
    }
    {% endfor %}
}
