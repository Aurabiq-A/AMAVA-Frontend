import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import styles from "./Home.module.css"
const Chat: React.FC = () => {
  const { darkMode } = useTheme();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ user: string; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  function extractMainResponse(json: any): string {
    for (const entry of json) {
      const part = entry?.content?.parts?.[0];
      if (part?.text) {
        return part.text;
      }
    }
    return "No main response found.";
  }
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);

    // Add user message to chat
    setMessages((msgs) => [...msgs, { user: "You", text: input }]);
    const userId = "us";
    const sessionId = "st";
    const appName = "AMAVAGENT";
    const promptText = input.trim();
    

    try {
      let response = await fetch("http://localhost:51483/run", {
        method: "POST",
        headers: { "ngrok-skip-browser-warning": "true", "Content-Type": "application/json" },
        body: JSON.stringify({
          appName,
          userId,
          sessionId,
          newMessage: {
            role: "user",
            parts: [{ text: promptText }],
          },
        }),
      });
      const text = await response.clone().text();
      if (text.includes('"detail":"Session not found"')) {
        await fetch(
          `http://localhost:51483/apps/${appName}/users/${userId}/sessions/${sessionId}`,
          {
            method: "POST",
            headers: { "ngrok-skip-browser-warning": "true", "Content-Type": "application/json" },
            body: JSON.stringify({ state: { key1: "value1", key2: 42 } }),
          }
        );
        response = await fetch("http://localhost:51483/run", {
          method: "POST",
          headers: { "ngrok-skip-browser-warning": "true", "Content-Type": "application/json" },
          body: JSON.stringify({
            appName,
            userId,
            sessionId,
            newMessage: {
              role: "user",
              parts: [{ text: promptText }],
            },
          }),
        });
      }

      const retryText = await response.clone().text();

      let main = "No main response found.";
      try {
        const json = JSON.parse(retryText);
        main = extractMainResponse(json);
      } catch {
        main = retryText;
      }
      setMessages((msgs) => [
        ...msgs,
        { user: "AMAVA AI", text: main || "No response" },
      ]);
    } catch (error) {
      setMessages((msgs) => [
        ...msgs,
        { user: "AMAVA AI", text: "Error: " + (error instanceof Error ? error.message : String(error)) },
      ]);
      console.error("Error during fetch:", error);
    }
    finally {
      setLoading(false);
      setInput("");
    }
    };


    return (
      <div
        className={`${styles.container} ${darkMode ? styles.dark : styles.light}`}
      >
        <div className={styles.responseBox}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-2 ${msg.user === "You"
                  ? "text-right"
                  : "text-left"
                }`}
            >
              <span className="font-semibold">{msg.user}: </span>
              <span>{msg.text}</span>
            </div>
          ))}
        </div>
        {/* <div className={styles.i} */}
        <form
          onSubmit={handleSend}
          className={`${styles.input} max-h-min`}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className={styles.input}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className={`ml-3 font-semibold rounded-full px-5 py-2 text-sm transition-colors ${loading || !input.trim()
                ? "bg-emerald-400 cursor-not-allowed text-white"
                : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }`}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    );
  };

  export default Chat;
