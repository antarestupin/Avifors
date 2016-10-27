{% macro method(methodList, name) %}
    {% set methodStruct = methodList | findOneByColumn('name', name) %}
    function {{ name | camelcase }}({{ methodStruct.arguments | prepend('$') | join(', ') }}) {
        {{ caller() }}
    }
{% endmacro %}
