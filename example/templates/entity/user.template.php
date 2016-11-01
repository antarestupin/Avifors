{% extends 'example/templates/entity.template.php' %}
{% import 'example/templates/components/class.template.php' as class %}

{% block methods %}
    function test() {
        return 'ok';
    }
{% endblock %}
