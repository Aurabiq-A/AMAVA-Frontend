import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";

const Chat: React.FC = () => {
  const { darkMode } = useTheme();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ user: string; text: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);

    // Add user message to chat
    setMessages((msgs) => [...msgs, { user: "You", text: input }]);

    try {
      const response = await fetch(
        `https://electric-mistakenly-rat.ngrok-free.app/chat?user=${encodeURIComponent(input)}`,
        { method: "GET" }
      );
      const data = await response.json();
      setMessages((msgs) => [
        ...msgs,
        { user: "Bot", text: data.response || "No response" },
      ]);
    } catch (error) {
      setMessages((msgs) => [
        ...msgs,
        { user: "Bot", text: "Error contacting server." },
      ]);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  return (
    <div
      className={`flex flex-col items-center min-h-screen px-4 pt-32 ${
        darkMode ? "bg-gray-800 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="w-full max-w-2xl flex-1 mb-4 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 ${
              msg.user === "You"
                ? "text-right"
                : "text-left text-emerald-600 dark:text-emerald-400"
            }`}
          >
            <span className="font-semibold">{msg.user}: </span>
            <span>{msg.text}</span>
          </div>
        ))}
      </div>
      <form
        onSubmit={handleSend}
        className={`w-full max-w-2xl flex items-center shadow-md border rounded-full px-4 py-3 ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className={`flex-1 bg-transparent outline-none text-lg placeholder-gray-400 ${
            darkMode ? "text-white" : "text-gray-700"
          }`}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className={`ml-3 font-semibold rounded-full px-5 py-2 text-sm transition-colors ${
            loading || !input.trim()
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
