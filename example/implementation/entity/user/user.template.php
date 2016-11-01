{% extends 'example/implementation/entity/entity.template.php' %}
{% import 'example/implementation/templates/class.template.php' as class %}

{% block methods %}
    function test() {
        return 'ok';
    }
{% endblock %}
