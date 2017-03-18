<?php

{% set propertiesNames = properties | map("i => i.name") -%}

namespace Acme\Entity;

class {{ name | pascalcase }} {
    private $id;

    {% for attr in propertiesNames %}
    private ${{ attr | camelcase }};
    {% endfor %}

    public function __construct($id) {
        $this->id = $id;
    }

    {# Getters & Setters #}
    {% for attr in propertiesNames %}
    public function get{{ attr | pascalcase }}() {
        return $this->{{ attr | camelcase }};
    }

    public function set{{ attr | pascalcase }}($value) {
        $this->{{ attr | camelcase }} = $value;
    }
    {% endfor %}
}
