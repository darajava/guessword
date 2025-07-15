import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import "doodle.css/doodle.css";
import styles from "./App.module.css";
import instance from "./instance";
import { Emoji } from "./Emoji";

function Winning(props: { answer: string; numGuesses: number }) {
  const [wordsGuessed, setWordsGuessed] = useState<
    { word: string; response: string }[]
  >([]);

  const numberToEnglish = (num: number): string => {
    const ones = [
      "zero",
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
    ];
    const tens = [
      "ten",
      "eleven",
      "twelve",
      "thirteen",
      "fourteen",
      "fifteen",
      "sixteen",
      "seventeen",
      "eighteen",
      "nineteen",
    ];
    const twenties = [
      "twenty",
      "thirty",
      "forty",
      "fifty",
      "sixty",
      "seventy",
      "eighty",
      "ninety",
    ];

    if (num < 10) {
      return ones[num];
    } else if (num < 20) {
      return tens[num - 10];
    } else if (num % 10 === 0) {
      return twenties[num / 10 - 2];
    } else {
      return twenties[Math.floor(num / 10) - 2] + " " + ones[num % 10];
    }
  };

  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareText = `I guessed the word "${props.answer}" in ${props.numGuesses} guesses!`;
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={styles.win}>
      <h1>You win!</h1>
      <h2>
        The word was{" "}
        <span className={styles.correctAnswer}>{props.answer}</span>
      </h2>
      <div className={styles.share}>
        <div className={styles.shareHolder}>
          <button onClick={handleShare}>Share</button>
          <span className={`${styles.copied} ${copied && styles.visible}`}>
            Copied!
          </span>
        </div>
        <div className={styles.shareHolder}>
          <button onClick={() => window.location.reload()}>Play again</button>
          <span className={`${styles.copied}`}>.</span>
        </div>
      </div>
      <br />
      <sup>
        You took {numberToEnglish(props.numGuesses)} guesses.
        <br />
        Well done retard :3
      </sup>
    </div>
  );
}

export default Winning;
