'use client';

import { useRef, useState } from "react";
import { MessageHandler } from "../MessageHandler";
import { LogoImage } from "./LogoImage";
import { BotMessage } from "./BotMessage";
import { UserMessage } from "./UserMessage";


export function DemoChat() {
    const [chat, setChat] = useState([
        { from: 'bot', text: 'Hi'},
    ])
    const [options, setOptions] = useState([])

    const send = (text: string, payload: string) => {
        const msg: any = MessageHandler(payload)
        setChat([
            ...chat, 
            {from: 'user', text},
            {from: 'bot', text: msg.text},
        ])
        setOptions(msg.options)
    }

    const initChat = () => {
        send('I\'m not feeling good', 'I\'m not feeling good')
    }

    return (
        <div className="border border-gray-200 rounded-xl overflow-y-scroll" style={{ height: '80vh'}}>
            <div className="flex items-center border-b shadow">
                <div className="p-4">
                    <LogoImage />
                </div>
                <h2 className="font-medium text-2xl">Self-Diagnosis</h2>
            </div>
            <div>
                <div className="flex flex-col p-4">
                    {
                        chat.map((msg, idx) => {
                            if( msg.from === 'bot') {
                                return <BotMessage key={'c'+idx} text={msg.text} />
                            } else {
                                return <UserMessage key={'c'+idx} text={msg.text} />
                            }
                        })
                    }
                    <div id='message-end' />
                </div>
                <div className="flex gap-1 px-4">
                    {
                        options && Object.entries(options).map(([k, v]) => (
                            <button
                                key={v}
                                onClick={() => send(k, v)}
                                className="px-2 py-1 bg-gray-300 rounded-full"
                            >
                                {k}
                            </button>
                        ))
                    }
                </div>
                <div className="text-center">
                    <button
                        className="py-4 underline"
                        onClick={initChat}
                    >
                        I&apos;m not feeling good.
                    </button>
                </div>
            </div>
        </div>
    )
}