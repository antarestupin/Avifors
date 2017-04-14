<?php

{% set camelCasedAttributes = attributes | camelcase -%}

namespace Acme\Event;

class {{ name | pascalcase }} extends BaseEvent {
    private $name;
    {% for attr in camelCasedAttributes %}
    private ${{ attr }};
    {% endfor %}

    public function __construct({{ camelCasedAttributes | prepend('$') | join(', ') }}) {
        $this->name = '{{ global.companyName | kebabcase }}-{{ name | kebabcase }}';
        {% for attr in camelCasedAttributes %}
        $this->{{ attr }} = ${{ attr }};
        {% endfor %}
    }

    {% for attr in attributes %}
    public function get{{ attr | pascalcase }}() {
        return $this->{{ attr | camelcase }};
    }
    {% endfor %}
}
