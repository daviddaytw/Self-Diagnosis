<?php

namespace App\Http\Controllers;

class LineController extends Controller implements PlatformInterface
{
    /**
     * Helper function to send request to messenger platform.
     */
    private function send($payload): void
    {
        // TODO.
    }

    /**
     * Method to send text message to user.
     */
    public function sendText(string $text): void
    {
        // TODO.
    }

    /**
     * Method to send options to user.
     */
    public function sendOptions(string $text, array $options): void
    {
        // TODO.
    }
}
