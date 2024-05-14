import flow from './flow.json'

const SEVERITY_THRESHOLD = 0.7

class TextMessage {
    private text: string

    constructor(text: string) {
        this.text = text
    }
    gettext() {
        return this.text
    }
}

class OptionsMessage {
    private text: string
    private options: Record<string, string>

    constructor(text: string, options: Record<string, string>) {
        this.text = text
        this.options = options
    }

    getText() {
        return this.text
    }

    getOptions() {
        return this.options
    }
}

type ResponseMessage = TextMessage | OptionsMessage

export function MessageHandler(payload: string): ResponseMessage {
    switch (payload) {
        case 'Get Started':
        case 'I\'m not feeling good':
            const entries = Object.keys(flow['entries']);

            return new OptionsMessage('What happened?', Object.fromEntries(entries.map((k) => ([k, k]))));
        case 'Cancel':
            return new TextMessage('Diagnose canceled')
        default:
            // Enter the question flow.
            let subtree: any = flow['entries'];
            const nodes = payload.split('.')
            for (const node of nodes) {
                subtree = subtree[node];
            }

            if (subtree['type'] == 'question') {
                return new OptionsMessage(`Do you have ${subtree['feature']}?`, {
                    'Yes': `${payload}.Yes`,
                    'No': `${payload}.No`,
                    'Cancel': 'Cancel',
                });
            } else if (subtree['type'] == 'result') {
                let text = '';
                const probs: any = subtree['probability'];
                if (subtree['severity'] >= SEVERITY_THRESHOLD) {
                    text += "According to my data, your health is considered SEVERE!\n";
                    text += "You should see a doctor ASAP!!\n\n";

                    if (Object.values<number>(probs)[0] > 0.5) {
                        text += 'You probably got ' + Object.entries<number>(probs).filter((v) => (v[1] > 0.5)).map((v) => v[0]).join(',')
                        if( Object.values<number>(probs).pop()! <= 0.5 ) {
                            text += ' and low chance that got ' + Object.entries<number>(probs).filter((v) => (v[1] <= 0.5)).map((v) => v[0]).join(',')
                        }
                    } else {
                        text += 'You probably got one of the following: ' + Object.keys(probs).join(', ');
                    }
                    text += ".\n";
                } else {
                    text += "\nAccording to my data, your health is considered Healthy.\n";
                    text += "You should be fine.\n\n";

                    if (Object.values<number>(probs)[0] > 0.5) {
                        text += 'But you probably got ' + Object.entries<number>(probs).filter((v) => (v[1] > 0.5)).map((v) => v[0]).join(',')
                        if( Object.values<number>(probs).pop()! <= 0.5 ) {
                            text += ' and very low chance that got ' + Object.entries<number>(probs).filter((v) => (v[1] <= 0.5)).map((v) => v[0]).join(',')
                        }
                    } else {
                        text += 'But if you\'re sick, you probably got ' + Object.keys(probs).join(', ');
                    }
                    text += ".\n\nNotice: You should NOT rely on me and must see a doctor if you feel sick.";
                }
                return new TextMessage(text);
            } else {
                return new TextMessage('Error')
            }
    }
}