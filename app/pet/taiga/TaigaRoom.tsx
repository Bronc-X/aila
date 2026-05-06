"use client";

import Link from "next/link";
import { type CSSProperties, type FormEvent, useMemo, useState } from "react";
import styles from "./page.module.css";

type ActionId = "idle" | "wave" | "jump" | "run" | "wait" | "review" | "oops";

type TaigaAction = {
  id: ActionId;
  label: string;
  line: string;
  row: number;
  frames: number;
  duration: number;
  mood: string;
};

type Message = {
  id: number;
  from: "you" | "taiga";
  text: string;
};

const actions: TaigaAction[] = [
  { id: "wave", label: "Wave", line: "我在。你刚刚发现了一个隐藏入口。", row: 3, frames: 4, duration: 760, mood: "signal" },
  { id: "jump", label: "Jump", line: "这个想法可以继续长大，先别急着收口。", row: 4, frames: 5, duration: 900, mood: "spark" },
  { id: "run", label: "Run", line: "收到，我去前面探一下路。", row: 7, frames: 6, duration: 860, mood: "move" },
  { id: "wait", label: "Wait", line: "我会在这里等下一条指令。", row: 6, frames: 6, duration: 1060, mood: "calm" },
  { id: "review", label: "Review", line: "让我看一下这件事真正卡在哪里。", row: 8, frames: 6, duration: 1080, mood: "focus" },
  { id: "oops", label: "Recover", line: "这步可能跑偏了，我们退半步再看。", row: 5, frames: 8, duration: 1240, mood: "soft" },
];

const idleAction: TaigaAction = {
  id: "idle",
  label: "Idle",
  line: "我叫Taiga，来自西伯利亚，是一只西森猫~有什么问题我帮你解决",
  row: 0,
  frames: 6,
  duration: 1100,
  mood: "idle",
};

const replies = [
  "先把问题说成一句话，我会陪你拆。",
  "这听起来像一个可以做成 agent 的入口。",
  "我先记住这个方向：轻交互，低打扰，能持续陪伴。",
  "以后这里可以接你的工作流、记忆和任务状态。",
  "现在我还只是本地小回声，但位置已经留好了。",
];

function pickAction(current: ActionId) {
  const pool = actions.filter((action) => action.id !== current);
  return pool[Math.floor(Math.random() * pool.length)];
}

function pickReply(input: string) {
  const normalized = input.trim();
  if (!normalized) return replies[0];
  if (/agent|对话|聊天|智能体/i.test(normalized)) return "对，下一步就是把我接成一个有记忆的页面 agent。";
  if (/产品|页面|设计|交互/.test(normalized)) return "我会优先守住体验：少一点解释，多一点可触摸的反馈。";
  return replies[Math.floor(Math.random() * replies.length)];
}

export default function TaigaRoom() {
  const [action, setAction] = useState<TaigaAction>(idleAction);
  const [message, setMessage] = useState(idleAction.line);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, from: "taiga", text: "我叫Taiga，来自西伯利亚，是一只西森猫~有什么问题我帮你解决" },
  ]);

  const spriteStyle = useMemo(
    () => ({
      "--taiga-frames": action.frames,
      "--taiga-row-y": `-${action.row * 208}px`,
      "--taiga-end-x": `-${action.frames * 192}px`,
      "--taiga-duration": `${action.duration}ms`,
    }) as CSSProperties,
    [action],
  );

  const triggerAction = () => {
    const next = pickAction(action.id);
    setAction(next);
    setMessage(next.line);
  };

  const submitMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = input.trim();
    if (!text) return;
    const nextAction = pickAction(action.id);
    const reply = pickReply(text);
    setMessages((current) => [
      ...current.slice(-3),
      { id: Date.now(), from: "you", text },
      { id: Date.now() + 1, from: "taiga", text: reply },
    ]);
    setAction(nextAction);
    setMessage(reply);
    setInput("");
  };

  return (
    <main className={styles.page}>
      <Link href="/" className={styles.back}>
        Back to orbit
      </Link>
      <section className={styles.room} aria-label="Taiga hidden interaction room">
        <div className={styles.stage}>
          <div className={styles.orbit} aria-hidden="true" />
          <button
            type="button"
            className={styles.petButton}
            onClick={triggerAction}
            aria-label="Interact with Taiga"
          >
            <span className={styles.sprite} style={spriteStyle} aria-hidden="true" />
          </button>
          <p className={styles.caption}>{message}</p>
          <div className={styles.actionDock} aria-label="Recent Taiga action">
            <span>{action.label}</span>
            <span>{action.mood}</span>
          </div>
        </div>

        <aside className={styles.panel} aria-label="Taiga conversation">
          <div className={styles.panelHeader}>
            <span>Taiga</span>
            <strong>西森猫 agent seed</strong>
          </div>
          <div className={styles.messages}>
            {messages.map((item) => (
              <p key={item.id} className={item.from === "you" ? styles.you : styles.taiga}>
                {item.text}
              </p>
            ))}
          </div>
          <form className={styles.composer} onSubmit={submitMessage}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Say something to Taiga"
              aria-label="Message Taiga"
            />
            <button type="submit">Send</button>
          </form>
        </aside>
      </section>
    </main>
  );
}
