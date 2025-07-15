import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import "doodle.css/doodle.css";
import styles from "./App.module.css";
import instance from "./instance";
import { Emoji } from "./Emoji";
import Winning from "./Winning";

function App() {
  const [emoji, setEmoji] = useState<string>("");
  const [word, setWord] = useState<string>("");
  const [input, setInput] = useState<string>("");
  const [disabled, setDisabled] = useState<boolean>(false);
  const [won, setWon] = useState<boolean>(false);
  const [answer, setAnswer] = useState<string>();

  const [wordsGuessed, setWordsGuessed] = useState<
    { word: string; response: string }[]
  >([]);

  useEffect(() => {
    instance.get("/word").then((response) => {
      setAnswer(response.data.word);
    });
  }, []);

  const emojiFromResponse = (response: string) => {
    switch (response) {
      case "cold":
        return "❄️";
      case "warm":
        return "🌤️";
      case "hot":
        return "🔥";
      case "very hot":
        return "🔥🔥";
      case "correct":
        return "🎉";
      default:
        return "❓";
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const guess = event.currentTarget.value;
      setDisabled(true);
      instance
        .post("/guess", {
          guess,
          answer,
          wordsGuessed: JSON.stringify(wordsGuessed),
        })
        .then((response) => {
          console.log(response.data);
          setInput("");
          switch (response.data.response) {
            case "cold":
              setEmoji("❄️");
              setWord("cold");
              break;
            case "warm":
              setEmoji("🌤️");
              setWord("warm");
              break;
            case "hot":
              setEmoji("🔥");
              setWord("hot");
              break;
            case "very hot":
              setEmoji("🔥🔥");
              setWord("very hot");
              break;
            case "correct":
              setEmoji("🎉");
              setWord("🎉 correct");
              break;
            default:
              setEmoji("❓");
              setWord("WTF");
              break;
          }
          setDisabled(false);
          setInput("");
          setWordsGuessed((prevWords) => [
            ...prevWords,
            {
              word: guess,
              response: response.data.response,
            },
          ]);
          console.log(wordsGuessed);
          setTimeout(() => {
            setEmoji("");
            if (response.data.response === "correct") {
              setWon(true);
            }
          }, 1000);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <div className={styles.container}>
      <div
        className={`${styles.screen} ${
          !answer && !won ? styles.visible : styles.hidden
        }`}
      >
        <div>Loading...</div>
      </div>

      <div
        className={`${styles.screen} ${
          answer && !won ? styles.visible : styles.hidden
        }`}
      >
        <div className={styles.main}>
          <h1>Guess the word</h1>
          <div className={styles.inputHolder}>
            <input
              className={`${disabled ? styles.disabled : ""} ${styles.input}`}
              onKeyDown={(e) => {
                if (!disabled) handleKeyDown(e);
              }}
              value={input}
              autoFocus
              onChange={(e) => {
                if (!disabled) setInput(e.target.value);
              }}
            />
            {disabled && (
              <div className={styles.spinner}>
                <div className={styles.bounce1} />
                <div className={styles.bounce2} />
                <div className={styles.bounce3} />
              </div>
            )}
          </div>
          <div className={styles.history}>
            {wordsGuessed
              .filter(
                (word) => word.response === "hot" || word.response === "warm"
              )
              .map((word) => {
                return word.word + " " + emojiFromResponse(word.response) + " ";
              })}
          </div>
          <div className={styles.answer}>
            {emoji.length > 0 && (
              <Emoji emoji={emoji} word={word} key={emoji + word} />
            )}
          </div>
        </div>
      </div>

      <div
        className={`${styles.screen} ${won ? styles.visible : styles.hidden}`}
      >
        <Winning answer={answer!} numGuesses={wordsGuessed.length} />
      </div>
    </div>
  );
}

export default App;
