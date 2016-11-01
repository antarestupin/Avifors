{% macro method(methodList, name) %}
    {% set methodStruct = methodList | findOneByColumn('name', name) %}
    function {{ name | camelcase }}({{ methodStruct.parameters | prepend('$') | join(', ') }}) {
        {{ caller() }}
    }
{% endmacro %}
