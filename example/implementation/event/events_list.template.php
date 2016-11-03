<?php

namespace Acme\Event;

class EventsList
{
    public function getEvents()
    {
        return [
            {{ 'event{}' | findinmodel | map("i => i.name") | surround("'") | join(',\n') | indent(12) }}
        ];
    }
}
