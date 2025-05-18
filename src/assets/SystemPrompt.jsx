import React, { useState } from "react";
import {
  TextField,
  Card,
  CardContent,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  CardHeader,
} from "@mui/material";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";

const templates = {
  Assistant: "You are a helpful assistant. Respond concisely and clearly.",
  Expert: "You are an expert assistant. Provide in-depth technical guidance.",
  Tutor: "You are a tutor. Teach concepts step-by-step and use analogies.",
  Creative: "You are a creative assistant. Respond with originality and flair.",
};

const SystemPrompt = () => {
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");

  const handleTemplateChange = (e) => {
    const template = e.target.value;
    setSelectedTemplate(template);
    setSystemPrompt(templates[template]);
  };

  const handlePromptChange = (e) => {
    setSystemPrompt(e.target.value);
  };

  const handleSave = () => {
    alert(`✅ System Prompt Saved:\n\n${systemPrompt}`);
  };

  return (
    <div
      className="flex justify-center items-start py-12 px-4 min-h-screen"
      style={{
        background: "linear-gradient(to right, #f0f4ff, #eef2ff, #fcf4ff)",
      }}
    >
      <div className="p-6 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-2xl shadow-md space-y-4 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
        <CardHeader
          title={
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
              <FormatQuoteIcon />
              AI Bot System Prompt Editor
            </div>
          }
          subheader={
            <Typography variant="body2" className="text-gray-600 mt-1">
              Guide your AI assistant’s behavior using descriptive and
              structured prompts. Select a predefined template or customize your
              own system prompt.
            </Typography>
          }
        />
        <CardContent className="space-y-6">
          <FormControl fullWidth>
            <InputLabel id="template-label">Choose a Template</InputLabel>
            <Select
              labelId="template-label"
              value={selectedTemplate}
              label="Choose a Template"
              onChange={handleTemplateChange}
              variant="outlined"
            >
              {Object.keys(templates).map((key) => (
                <MenuItem key={key} value={key}>
                  {key}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            sx={{ marginTop: 2 }}
            label="System Prompt"
            multiline
            rows={6}
            value={systemPrompt}
            onChange={handlePromptChange}
            fullWidth
            variant="outlined"
            placeholder="Define how your assistant should behave..."
            InputProps={{
              style: {
                background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                borderRadius: 8,
              },
            }}
          />

          <div className="flex justify-end mt-1">
            <Button
              variant="contained"
              color="primary"
              size="large"
              className="rounded-xl"
              onClick={handleSave}
            >
              Send Prompt
            </Button>
          </div>
        </CardContent>
      </div>
    </div>
  );
};

export default SystemPrompt;
