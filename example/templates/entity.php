<?php

{%- set varproperties = properties | varcamelcase %}

namespace Acme\Entity;

class {{ name | camelcase }} {
    private $id;

    {% for attr in varproperties %}
    private ${{ attr }};
    {% endfor %}

    public function __construct($id) {
        $this->id = $id;
    }

    {% for attr in properties %}
    public function get{{ attr | camelcase }}() {
        return $this->{{ attr | varcamelcase }};
    }

    public function set{{ attr | camelcase }}($value) {
        $this->{{ attr | varcamelcase }} = $value;
    }
    {% endfor %}
}
