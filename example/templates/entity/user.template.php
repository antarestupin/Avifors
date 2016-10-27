{% extends 'example/templates/entity.template.php' %}
{% import 'example/templates/components/class.template.php' as class %}

{% block methods %}
    {% call class.method(methods, 'clear_basket') -%}
        $this->articles = [];
    {%- endcall %}
{% endblock %}
