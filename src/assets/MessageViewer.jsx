import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

export default function MessageViewer({ messages, memoryType }) {
  const renderMessages = () => {
    if (memoryType === "buffer") return messages;
    if (memoryType === "window") return messages.slice(-10);
    if (memoryType === "summary")
      return [
        { id: "summary", content: "📄 Summary of first 99 messages", isSummary: true },
        messages[messages.length - 1],
      ];
    if (memoryType === "hybrid")
      return [
        { id: "summary", content: "📄 Summary of first 70 messages", isSummary: true },
        ...messages.slice(-30),
      ];
    return messages;
  };

  const processedMessages = renderMessages();

  return (
    <Box
      sx={{
        maxHeight: 400,
        overflowY: "auto",
        p: 2,
        border: "1px solid #e0e0e0",
        borderRadius: 2,
        backgroundColor: "#fafafa",
      }}
    >
      <Typography
        variant="h6"
        sx={{ mb: 2, position: "sticky", top: 0, bgcolor: "#fafafa", zIndex: 10 }}
      >
        💬 Conversation ({memoryType.charAt(0).toUpperCase() + memoryType.slice(1)} Memory)
      </Typography>

      <Box className="space-y-3">
        {processedMessages.map((msg) => (
          <Card
            key={msg.id}
            sx={{
              maxWidth: "80%",
              alignSelf: msg.isSummary ? "center" : msg.sender === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.isSummary
                ? "#e3f2fd"
                : msg.sender === "user"
                ? "#1976d2"
                : "#f1f1f1",
              color: msg.isSummary ? "#0d47a1" : msg.sender === "user" ? "white" : "black",
              borderRadius: 3,
              boxShadow: msg.isSummary ? "0 0 10px #90caf9" : "none",
              p: 1.5,
              wordBreak: "break-word",
              fontSize: "0.95rem",
            }}
          >
            <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: msg.isSummary ? 600 : "normal",
                  fontStyle: msg.isSummary ? "italic" : "normal",
                }}
              >
                {msg.content}
              </Typography>
              {msg.timestamp && (
                <Typography variant="caption" sx={{ mt: 0.5, opacity: 0.6, fontSize: 11 }}>
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </Typography>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
