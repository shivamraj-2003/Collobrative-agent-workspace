import React from "react";
import { TextField, Button } from "@mui/material";
import { NoteAdd } from "@mui/icons-material";

const AnnotationPanel = () => {
  return (
    <div className="p-6 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-2xl shadow-md space-y-4 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center gap-2 mb-1">
        <NoteAdd className="text-blue-600" />
        <h2 className="text-xl font-bold text-gray-800">Annotations</h2>
      </div>

      <TextField
        label="Write your thoughts..."
        fullWidth
        multiline
        rows={3}
        variant="outlined"
        placeholder="e.g. Consider simplifying this sentence..."
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          },
        }}
      />

      <Button
        variant="contained"
        sx={{
          marginTop: 1,
          paddingX: 3,
          borderRadius: "999px",
          textTransform: "none",
          fontWeight: "bold",
          background: "linear-gradient(to right, #6366f1, #3b82f6)",
          boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
          "&:hover": {
            background: "linear-gradient(to right, #4f46e5, #2563eb)",
          },
        }}
      >
        Add Note
      </Button>
    </div>
  );
};

export default AnnotationPanel;
