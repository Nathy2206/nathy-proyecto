import react, { useState } from 'react';

export default function Component() {
    const [text, setText] = useState('');

    return (
        <div>
            <p>{text}</p>
            <button onClick={() => setText('Hello, React!')}>

                Click me
            </button>
        </div>
    );
}