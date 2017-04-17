<?php

namespace Acme;

class Events {
    public $events = [
        {{ events | map('event => event.name') | surround("'") | join(',\n        ') }}
    ];
}
