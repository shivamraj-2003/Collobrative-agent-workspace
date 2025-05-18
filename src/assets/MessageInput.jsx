import React, { useState } from "react";
import { TextField, Button, IconButton, InputAdornment } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';

export default function MessageInput({ onSend }) {
  const [value, setValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && value.trim()) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!value.trim()) return;
    onSend(value.trim());
    setValue("");
  };

  const handleClear = () => setValue("");

  return (
    <div className="flex items-center gap-2 mt-4">
      <TextField sx={{height:32}}
        fullWidth
        label="Type your message"
        value={value}
        multiline
        minRows={1}
        maxRows={5}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        InputProps={{
          endAdornment: value && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={handleClear} edge="end" aria-label="Clear message">
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        placeholder="Write a message and press Enter to send"
      />

      <Button sx={{marginTop:2}}
        size="large"
        variant="contained"
        color="primary"
        disabled={!value.trim()}
        onClick={handleSend}
      >
        Send
      </Button>
    </div>
  );
}
