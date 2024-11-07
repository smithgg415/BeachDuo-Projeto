// TypingText.js
import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';

const TypingText = ({ text, speed = 50, style }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        let currentIndex = 0;
        const interval = setInterval(() => {
            setDisplayedText((prev) => prev + text[currentIndex]);
            currentIndex++;
            if (currentIndex === text.length) {
                clearInterval(interval);
            }
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed]);

    return <Text style={style}>{displayedText}</Text>;
};

export default TypingText;
