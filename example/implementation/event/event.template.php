<?php

{% set varattributes = attributes | camelcase -%}

namespace Acme\Event;

class {{ name | pascalcase }} extends BaseEvent {
    {% for attr in varattributes %}
    private ${{ attr }};{{ _(loop.revindex0) }}
    {% endfor %}

    public function __construct({{ varattributes | prepend('$') | join(', ') }}) {
        $this->name = '{{ _global.company_namespace | kebabcase }}-{{ name | kebabcase }}';
        {% for attr in varattributes %}
        $this->{{ attr }} = ${{ attr }};
        {% endfor %}
    }

    {% for attr in attributes %}
    public function get{{ attr | pascalcase }}() {
        return $this->{{ attr | camelcase }};
    }{{ _(loop.revindex0) }}
    {% endfor %}
}
