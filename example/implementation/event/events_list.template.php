<?php

namespace Acme\Event;

class EventsList
{
    public function getEvents()
    {
        return [
            {{ 'event{}' | findinmodel | map("i => i.name") | prepend("'") | append("'") | join(',\n') | indent(12) }}
        ];
    }
}
