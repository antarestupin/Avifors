<?php

{% import 'example/lib/class/class.template.php' as class -%}
{% set varproperties = properties | camelcase -%}

namespace Acme\Entity;

class {{ name | pascalcase }} {
    private $id;

    {% for attr in varproperties %}
    private ${{ attr }};
    {% if loop.revindex0 != 0 %}{{ '\n' }}{% endif %}{# Alternative way to add a line -#}
    {% endfor %}

    public function __construct($id) {
        $this->id = $id;
    }

    {% for attr in properties %}
    public function get{{ attr | pascalcase }}() {
        return $this->{{ attr | camelcase }};
    }

    public function set{{ attr | pascalcase }}($value) {
        $this->{{ attr | camelcase }} = $value;
    }{{ _(not loop.last) }}
    {% endfor %}

    {% for method in methods %}
        {% call class.method(methods, method.name) -%}
            {{ _impl.methods[method.name] | indent(8) }}
        {%- endcall %}
    {% endfor %}

    {% block methods %}{% endblock %}
}
