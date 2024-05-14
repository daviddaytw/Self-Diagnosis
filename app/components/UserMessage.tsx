type Prop = {
    text: string
}

export function UserMessage({ text }: Prop) {
    return (
        <div className="flex justify-end items-center py-1">
            <div>
                <span className="block bg-blue-600 text-white py-2 px-3 rounded">{text}</span>
            </div>
        </div>
    )
}