import { LogoImage } from "./LogoImage";

type Prop = {
    text: string
}

export function BotMessage({ text }: Prop) {
    return (
        <div className="flex items-center py-1">
            <LogoImage />
            <div className="px-5">
                <span className="block bg-gray-200 py-2 px-3 rounded">{text}</span>
            </div>
        </div>
    )
}