<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Http;
use Illuminate\Testing\TestResponse;
use Tests\TestCase;

class FacebookTest extends TestCase
{
    /**
     * Test Facebook webhook endpoint verify.
     *
     * @return void
     */
    public function test_verify(): void
    {
        $CHALLENGE = 'challenge';
        $VERIFY_TOKEN = env('FB_VERIFY_TOKEN');
        $response = $this->get(route('facebook.verify', [
            'hub.mode' => 'subscribe',
            'hub.verify_token' => $VERIFY_TOKEN,
            'hub.challenge' => $CHALLENGE,
        ]));
        $response->assertStatus(200);
        $response->assertSee($CHALLENGE);
    }

    /**
     * Assist function to simulate user send text.
     */
    private function testText(string $text): TestResponse
    {
        return $this->post(route('facebook.process', [
            'object' => 'page',
            'entry' => [
                [
                    'id' => '<PAGE_ID>',
                    'time' => time(),
                    'messaging' => [
                        [
                            'sender' => [
                                'id' => '<PSID>',
                            ],
                            'recepient' => [
                                'id' => '<PAGE_ID>',
                            ],
                            'message' => [
                                'text' => $text,
                            ],
                        ],
                    ],
                ],
            ],
        ]));
    }

    /**
     * Assist function to simulate user postback.
     */
    private function testPostBack(string $payload): TestResponse
    {
        return $this->post(route('facebook.process', [
            'object' => 'page',
            'entry' => [
                [
                    'id' => '<PAGE_ID>',
                    'time' => time(),
                    'messaging' => [
                        [
                            'sender' => [
                                'id' => '<PSID>',
                            ],
                            'recepient' => [
                                'id' => '<PAGE_ID>',
                            ],
                            'postback' => [
                                'payload' => $payload,
                            ],
                        ],
                    ],
                ],
            ],
        ]));
    }

    /**
     * Test Facebook webhook income processing.
     *
     * @return void
     */
    public function test_process(): void
    {
        Http::fake();

        // Test show entries.
        $response = $this->testText("I'm not feeling good");
        $response->assertStatus(200);

        // Test entry selection.
        $response = $this->testPostBack('nausea');
        $response->assertStatus(200);

        // Test show Yes/No question.
        $response = $this->testPostBack('nausea.Yes');
        $response->assertStatus(200);

        // Test healthy
        $response = $this->testPostBack('nausea.Yes.No.No');
        $response->assertStatus(200);

        // Test severe
        $response = $this->testPostBack('nausea.Yes.Yes.Yes');
        $response->assertStatus(200);
        Http::assertSentCount(5);
    }
}
