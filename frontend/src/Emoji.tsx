import { useEffect, useState } from "react";
import styles from "./Emoji.module.css";

type EmojiIndicatorProps = {
  emoji?: string;
  word?: string;
};

export const Emoji = (props: EmojiIndicatorProps) => {
  return (
    <span className={`${styles.emoji}`}>
      {props.word} {""}
      {props.emoji}
    </span>
  );
};
