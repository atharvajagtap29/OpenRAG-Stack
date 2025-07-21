import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CallTheAgentAPI } from "../API/Agent";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const ChatBoxModal = ({ context, onClose }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await CallTheAgentAPI({
        query: userMessage.text,
        context_id: context.context_id,
      });

      if (res.success) {
        const agentMessage = { role: "agent", text: res.response };
        setMessages((prev) => [...prev, agentMessage]);
      } else {
        toast.error("Agent failed to respond.");
      }
    } catch (err) {
      toast.error("Error talking to the agent.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Chat with AI Agent</DialogTitle>
        </DialogHeader>

        <div className="text-sm text-muted-foreground mb-2">
          You are chatting about: <strong>{context?.context_name}</strong>
        </div>

        {/* Chat Messages */}
        <div className="border p-4 rounded-md h-60 overflow-y-auto space-y-3 bg-muted text-sm">
          {messages.length === 0 ? (
            <p className="italic text-muted-foreground">
              Ask your first question...
            </p>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-md ${
                  msg.role === "user"
                    ? "bg-primary text-white ml-auto max-w-[80%]"
                    : "bg-background border text-muted-foreground mr-auto max-w-[80%]"
                }`}
              >
                {msg.text}
              </div>
            ))
          )}

          {loading && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Loader2 className="h-4 w-4 animate-spin" /> Thinking...
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex gap-2 mt-4">
          <input
            type="text"
            placeholder="Ask something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-grow border rounded-md p-2 text-sm"
            disabled={loading}
          />
          <Button
            size="sm"
            onClick={handleSend}
            disabled={loading || !input.trim()}
          >
            Send
          </Button>
        </div>

        <DialogFooter className="pt-4">
          {/* <Button variant="ghost" onClick={onClose}>
            Close
          </Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChatBoxModal;
