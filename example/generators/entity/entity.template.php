<?php

{% set varproperties = properties | map("i => i.name") | camelcase -%}

namespace Acme\Entity;

class {{ name | pascalcase }} {
    private $id;

    {% for attr in varproperties %}
    private ${{ attr }};
    {% endfor %}

    public function __construct($id) {
        $this->id = $id;
    }

    {% for attr in properties | map("i => i.name") %}
    public function get{{ attr | pascalcase }}() {
        return $this->{{ attr | camelcase }};
    }

    public function set{{ attr | pascalcase }}($value) {
        $this->{{ attr | camelcase }} = $value;
    }
    {% endfor %}
}
