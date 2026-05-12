"use client";

import Link from "next/link";
import {
  type CSSProperties,
  type FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./page.module.css";

type ActionId =
  | "idle"
  | "wave"
  | "jump"
  | "run"
  | "wait"
  | "review"
  | "dash"
  | "sneak"
  | "orbit"
  | "peek";
type MotionId =
  | "motionIdle"
  | "motionSignal"
  | "motionPounce"
  | "motionScout"
  | "motionLoaf"
  | "motionInspect"
  | "motionDash"
  | "motionSneak"
  | "motionOrbit"
  | "motionPeek";

type TaigaAction = {
  id: ActionId;
  label: string;
  line: string;
  row: number;
  frames: number;
  duration: number;
  mood: string;
  motion: MotionId;
};

type Message = {
  id: number;
  from: "you" | "taiga";
  text: string;
  imageUrl?: string;
};

const taigaIntro = "我叫 Taiga，来自西伯利亚，是一只西森猫~\n有什么问题我帮你解决";

const bubbleLines = [
  "拆问题、写代码、改文案都可以。",
  "一句话也能先变成图。",
  "复杂一点没关系，我先找路径。",
  "产品判断、agent 流程，我可以陪你推。",
  "把问题丢给我，我先给你下一步。",
  "我不记仇，也不记忆，这次只看当前问题。",
];

const actions: TaigaAction[] = [
  { id: "wave", label: "Wave", line: "我在。你刚刚发现了一个隐藏入口。", row: 3, frames: 4, duration: 760, mood: "signal", motion: "motionSignal" },
  { id: "jump", label: "Pounce", line: "这个想法可以继续长大，先别急着收口。", row: 4, frames: 5, duration: 900, mood: "spark", motion: "motionPounce" },
  { id: "run", label: "Scout", line: "收到，我去前面探一下路。", row: 7, frames: 6, duration: 860, mood: "move", motion: "motionScout" },
  { id: "wait", label: "Loaf", line: "我会在这里等下一条指令。", row: 6, frames: 6, duration: 1060, mood: "calm", motion: "motionLoaf" },
  { id: "review", label: "Inspect", line: "让我看一下这件事真正卡在哪里。", row: 8, frames: 6, duration: 1080, mood: "focus", motion: "motionInspect" },
  { id: "dash", label: "Dash", line: "我先冲过去，把最短路径找出来。", row: 1, frames: 8, duration: 980, mood: "fast", motion: "motionDash" },
  { id: "sneak", label: "Sneak", line: "我轻一点靠近，看看问题背后藏着什么。", row: 2, frames: 8, duration: 1160, mood: "quiet", motion: "motionSneak" },
  { id: "orbit", label: "Orbit", line: "我绕一圈观察，全局比单点更重要。", row: 7, frames: 6, duration: 1100, mood: "scan", motion: "motionOrbit" },
  { id: "peek", label: "Peek", line: "我探个头，这里可能有个小线索。", row: 6, frames: 6, duration: 980, mood: "curious", motion: "motionPeek" },
];

const idleAction: TaigaAction = {
  id: "idle",
  label: "Idle",
  line: taigaIntro,
  row: 0,
  frames: 6,
  duration: 1100,
  mood: "idle",
  motion: "motionIdle",
};

function pickAction(current: ActionId) {
  const pool = actions.filter((action) => action.id !== current);
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function TaigaRoom() {
  const [action, setAction] = useState<TaigaAction>(idleAction);
  const [bubble, setBubble] = useState(idleAction.line);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);
  const nextMessageIdRef = useRef(2);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, from: "taiga", text: taigaIntro },
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

  const motionClass = {
    motionIdle: styles.motionIdle,
    motionSignal: styles.motionSignal,
    motionPounce: styles.motionPounce,
    motionScout: styles.motionScout,
    motionLoaf: styles.motionLoaf,
    motionInspect: styles.motionInspect,
    motionDash: styles.motionDash,
    motionSneak: styles.motionSneak,
    motionOrbit: styles.motionOrbit,
    motionPeek: styles.motionPeek,
  }[action.motion];

  useEffect(() => {
    const previousBodyBg = document.body.style.backgroundColor;
    const previousHtmlBg = document.documentElement.style.backgroundColor;
    document.body.style.backgroundColor = "#050605";
    document.documentElement.style.backgroundColor = "#050605";

    return () => {
      document.body.style.backgroundColor = previousBodyBg;
      document.documentElement.style.backgroundColor = previousHtmlBg;
    };
  }, []);

  useEffect(() => {
    const container = messagesRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const triggerAction = () => {
    const next = pickAction(action.id);
    setAction(next);
    setBubble(Math.random() > 0.45 ? next.line : bubbleLines[Math.floor(Math.random() * bubbleLines.length)]);
  };

  const submitMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || isThinking) return;
    const nextAction = pickAction(action.id);
    const userId = nextMessageIdRef.current++;
    const pendingId = nextMessageIdRef.current++;
    setMessages((current) => [
      ...current.slice(-3),
      { id: userId, from: "you", text },
      { id: pendingId, from: "taiga", text: "我在想，等我一下。" },
    ]);
    setAction(nextAction);
    setBubble("我在想，等我一下。");
    setInput("");
    setIsThinking(true);

    try {
      const response = await fetch("/api/pet/taiga", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const payload = (await response.json()) as {
        text?: string;
        imageUrl?: string;
        message?: string;
      };
      const reply = payload.text || payload.message || "Taiga 没拿到有效回复。";
      setMessages((current) =>
        current.map((item) =>
          item.id === pendingId ? { ...item, text: reply, imageUrl: payload.imageUrl } : item
        )
      );
      setBubble(reply.length > 44 ? bubbleLines[Math.floor(Math.random() * bubbleLines.length)] : reply);
      setAction(pickAction(nextAction.id));
    } catch {
      const fallback = "我这次没连上那边的模型。你再发一次，我继续接。";
      setMessages((current) =>
        current.map((item) => (item.id === pendingId ? { ...item, text: fallback } : item))
      );
      setBubble(fallback);
      setAction(actions.find((item) => item.id === "review") || idleAction);
    } finally {
      setIsThinking(false);
    }
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
            <span
              key={action.id}
              className={`${styles.motionLayer} ${motionClass}`}
              aria-hidden="true"
            >
              <span className={styles.sprite} style={spriteStyle} />
            </span>
          </button>
          <p className={styles.speechBubble}>
            <span className={styles.speechText}>{bubble}</span>
          </p>
        </div>

        <aside className={styles.panel} aria-label="Taiga conversation">
          <div className={styles.panelHeader}>
            <span>Taiga</span>
            <strong>opentaiga</strong>
          </div>
          <div className={styles.messages} ref={messagesRef}>
            {messages.map((item) => (
              <p key={item.id} className={item.from === "you" ? styles.you : styles.taiga}>
                <span className={styles.messageText}>{item.text}</span>
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.imageUrl} alt="Taiga generated visual" />
                ) : null}
              </p>
            ))}
          </div>
          <form className={styles.composer} onSubmit={submitMessage}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="问问题，或让 Taiga 生一张图"
              aria-label="Message Taiga"
              disabled={isThinking}
            />
            <button type="submit" disabled={isThinking}>
              {isThinking ? "..." : "Send"}
            </button>
          </form>
        </aside>
      </section>
    </main>
  );
}
