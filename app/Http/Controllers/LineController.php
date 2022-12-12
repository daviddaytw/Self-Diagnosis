<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class LineController extends Controller implements PlatformInterface
{
    public string $senderId;

    /**
     * Veriy message source by comparing signature.
     */
    private function verify(Request $request): bool
    {
        $CHANNEL_SECRECT = env('LINE_CHANNEL_SECRECT');
        $hash = hash_hmac('sha256', $request->getContent(), $CHANNEL_SECRECT);

        return $hash === $request->header('x-line-signature');
    }

    /**
     * Digest the incoming requests from messenger platform.
     */
    public function process(Request $request): Response
    {
        if (! $this->verify($request)) {
            return response('Bad Request', 400);
        }
        // Iterates over each event - there may be multiple if batched
        foreach ($request->events as $event) {
            $this->senderId = $event['source']['userid'];
            Log::info('Sender ID: '.$this->senderId);
            Log::info('Retrieved payload: '.json_encode($event));

            // Pass the event to the appropriate handler function
            $handler = new MessageHandler($this);
            if (array_key_exists('postback', $event)) {
                $handler($event['postback']['data']);
            } elseif (array_key_exists('message', $event)) {
                $handler($event['message']['text']);
            }
        }

        // Returns a '200 OK' response to all requests
        return response('EVENT_RECEIVED', 200);
    }

    /**
     * Helper function to send request to Line channel.
     */
    private function send($payload): void
    {
        $ACCESS_TOKEN = env('CHANNEL_TOKEN');

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => "Bearer $ACCESS_TOKEN",
        ])->post('https://api.line.me/v2/bot/message/push',
            $payload
        );

        Log::info('Sent Payload: '.json_encode($payload));
        Log::info('Line response status: '.$response->status());
    }

    /**
     * Method to send text message to user.
     */
    public function sendText(string $text): void
    {
        $this->send([
            'to' => $this->senderId,
            'messages' => [
                [
                    'type' => 'text',
                    'text' => $text,
                ],
            ],
        ]);
    }

    /**
     * Method to send options to user.
     */
    public function sendOptions(string $text, array $options): void
    {
        $items = [];
        foreach ($options as $title => $payload) {
            array_push($items, [
                'type' => 'action',
                'action' => [
                    'type' => 'postback',
                    'label' => $title,
                    'data' => $payload,
                    'displayText' => $title,
                ],
            ]);
        }

        $this->send([
            'to' => $this->senderId,
            'messages' => [
                [
                    'type' => 'text',
                    'text' => $text,
                    'quickReply' => [
                        'items' => $items,
                    ],
                ],
            ],
        ]);
    }
}
