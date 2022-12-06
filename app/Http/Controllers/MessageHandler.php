<?php

namespace App\Http\Controllers;

class MessageHandler
{
    private PlatformInterface $platform;

    private array $flow;

    public function __construct(PlatformInterface $platform)
    {
        $this->platform = $platform;
        $this->flow = json_decode(file_get_contents(storage_path('app/flow.json')), true);
    }

    public function __invoke(string $payload): void
    {
        switch ($payload) {
            case 'Get Started':
            case 'I\'m not feeling good':
                $entries = array_keys($this->flow['entries']);

                $this->platform->sendOptions('What happened?', array_combine($entries, $entries));
                break;
            case 'Cancel':
                $this->platform->sendText('Diagnose canceled');
                break;
            default:
                if ($payload != null) {
                    // Enter the question flow.
                    $subtree = $this->flow['entries'];
                    $nodes = explode('.', $payload);
                    foreach ($nodes as $node) {
                        $subtree = $subtree[$node];
                    }

                    if ($subtree['type'] == 'question') {
                        $this->platform->sendOptions("Do you have {$subtree['feature']}?", [
                            'Yes' => "$payload.Yes",
                            'No' => "$payload.No",
                            'Cancel' => 'Cancel',
                        ]);
                    } elseif ($subtree['type'] == 'result') {
                        $text = '';
                        $probs = $subtree['probability'];
                        if ($subtree['severity'] >= env('SEVERITY_THRESHOLD')) {
                            $text .= "According to my data, your health is considered SEVERE!\n";
                            $text .= "You should see a doctor ASAP!!\n\n";

                            if (array_values($probs)[0] > 0.5) {
                                $text .= 'You probably got '.implode(', ', array_keys(array_filter($probs, function ($var) {
                                    return $var > 0.5;
                                })));
                                if (array_pop($probs) <= 0.5) {
                                    $text .= ' and low chance that got '.implode(', ', array_keys(array_filter($probs, function ($var) {
                                        return $var <= 0.5;
                                    })));
                                }
                            } else {
                                $text .= 'You probably got one of the following: '.implode(', ', array_keys($probs));
                            }
                            $text .= ".\n";
                        } else {
                            $text .= "\nAccording to my data, your health is considered Healthy.\n";
                            $text .= "You should be fine.\n\n";

                            if (array_values($probs)[0] > 0.5) {
                                $text .= 'But you probably got '.implode(', ', array_keys(array_filter($probs, function ($var) {
                                    return $var > 0.5;
                                })));
                                if (array_pop($probs) <= 0.5) {
                                    $text .= ' and very low chance that got '.implode(', ', array_keys(array_filter($probs, function ($var) {
                                        return $var <= 0.5;
                                    })));
                                }
                            } else {
                                $text .= 'But if you\'re sick, you probably got '.implode(', ', array_keys($probs));
                            }
                            $text .= ".\n\nNotice: You should NOT rely on me and must see a doctor if you feel sick.";
                        }
                        $this->platform->sendText($text);
                    }
                }
        }
    }
}
