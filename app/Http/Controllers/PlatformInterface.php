<?php

namespace App\Http\Controllers;

interface PlatformInterface
{
    public function sendText(string $text): void;

    public function sendOptions(string $text, array $options): void;
}
