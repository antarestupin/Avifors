{% macro method(methodList, name) %}
    {% set methodStruct = methodList | findonebycolumn('name', name) %}
    function {{ name | camelcase }}({{ methodStruct.parameters | prepend('$') | join(', ') }}) {
        {{ caller() }}
    }
{% endmacro %}
