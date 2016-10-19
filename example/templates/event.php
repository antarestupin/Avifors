<?php

{%- set varattributes = attributes | camelcase %}

namespace Acme\Event;

class {{ name | pascalcase }} extends BaseEvent {
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
    public function get{{ attr | pascalcase }}() {
        return $this->{{ attr | camelcase }};
    }
    {% endfor %}
}
