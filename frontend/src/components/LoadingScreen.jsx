import { useState, useEffect } from "react";

const LoadingScreen = ({ onFinish }) => {
  const fullText = "<LoadingCoDesign />";
  const [text, setText] = useState("");
  const [doneTyping, setDoneTyping] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullText.length) {
        setText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setDoneTyping(true);
      }
    }, 175);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (doneTyping) {
      setTimeout(() => {
        setFadeOut(true);
      }, 800);

      setTimeout(() => {
        onFinish();
      }, 1600);
    }
  }, [doneTyping, onFinish]);

  return (
    <div
      className={`w-screen h-screen backgroundBlue text-white flex items-center justify-center text-7xl font-mono transition-opacity duration-700 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <span>{text}<span className="animate-pulse">|</span></span>
    </div>
  );
};

export default LoadingScreen;