<?php

namespace Acme\Event;

class EventsList
{
    public function getEvents()
    {
        return [
            {{ findInModel('event{}') | map("i => i.name") | surround("'") | join(',\n') | indent(12) }}
        ];
    }
}
