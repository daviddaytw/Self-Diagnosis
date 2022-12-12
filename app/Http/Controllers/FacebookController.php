<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FacebookController extends Controller implements PlatformInterface
{
    public string $senderPsid;

    /**
     * Veriy endpoint required by Facebook messenger platform.
     */
    public function verify(Request $request): Response
    {
        // Parse the query params
        $mode = $request->hub_mode;
        $token = $request->hub_verify_token;
        $challenge = $request->hub_challenge;

        // Checks if a token and mode is in the query string of the request
        if (($mode !== null) && ($token !== null)) {
            // Checks the mode and token sent is correct
            if ($mode === 'subscribe' && $token === env('FB_VERIFY_TOKEN')) {
                // Responds with the challenge token from the request
                Log::info('WEBHOOK_VERIFIED');

                return response($challenge, 200);
            } else {
                // Responds with '403 Forbidden' if verify tokens do not match
                return response('Forbidden', 403);
            }
        }

        return response('Bad Request', 400);
    }

    /**
     * Digest the incoming requests from messenger platform.
     */
    public function process(Request $request): Response
    {
        // Checks if this is an event from a page subscription
        if ($request->object == 'page') {
            // Iterates over each entry - there may be multiple if batched
            foreach ($request->entry as $entry) {
                // Gets the body of the webhook event
                $webhookEvent = $entry['messaging'][0];

                $this->senderPsid = $webhookEvent['sender']['id'];
                Log::info('Sender PSID: '.$this->senderPsid);
                Log::info('Retrieved payload: '.json_encode($webhookEvent));

                // Pass the event to the appropriate handler function
                $handler = new MessageHandler($this);
                if (array_key_exists('message', $webhookEvent)) {
                    if (array_key_exists('quick_reply', $webhookEvent['message'])) {
                        $handler($webhookEvent['message']['quick_reply']['payload']);
                    } else {
                        $handler($webhookEvent['message']['text']);
                    }
                } elseif (array_key_exists('postback', $webhookEvent)) {
                    $handler($webhookEvent['postback']['payload']);
                }
            }

            // Returns a '200 OK' response to all requests
            return response('EVENT_RECEIVED', 200);
        } else {
            // Returns a '404 Not Found' if event is not from a page subscription
            return response('Not Found', 404);
        }
    }

    /**
     * Helper function to send request to messenger platform.
     */
    private function send($payload): void
    {
        // The page access token generated in your app settings
        $PAGE_ACCESS_TOKEN = env('FB_PAGE_ACCESS_TOKEN');

        // Send the HTTP request to the Messenger Platform
        $response = Http::post("https://graph.facebook.com/v2.6/me/messages?access_token=$PAGE_ACCESS_TOKEN", $payload);
        Log::info('Sent Payload: '.json_encode($payload));
        Log::info('Messenger response status: '.$response->status());
    }

    /**
     * Method to send text message to user.
     */
    public function sendText(string $text): void
    {
        $this->send([
            'recipient' => [
                'id' => $this->senderPsid,
            ],
            'message' => [
                'text' => $text,
            ],
        ]);
    }

    /**
     * Method to send options to user.
     */
    public function sendOptions(string $text, array $options): void
    {
        $replies = [];
        foreach ($options as $title => $payload) {
            array_push($replies, [
                'content_type' => 'text',
                'title' => $title,
                'payload' => $payload,
            ]);
        }

        $this->send([
            'recipient' => [
                'id' => $this->senderPsid,
            ],
            'messaging_type' => 'RESPONSE',
            'message' => [
                'text' => $text,
                'quick_replies' => $replies,
            ],
        ]);
    }
}
