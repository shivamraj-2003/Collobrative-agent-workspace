import React from "react";
import {
  CardContent,
  Typography,
  Slider,
  Select,
  MenuItem,
  TextField,
  Button,
  Box,
  InputLabel,
  FormControl,
} from "@mui/material";
import {
  SettingOutlined,
  FireOutlined,
  NumberOutlined,
  DatabaseOutlined,
  FolderOpenOutlined,
  FileTextOutlined,
  ProfileOutlined,
  SwapOutlined,
  ExpandOutlined,
  EditOutlined,
  UnorderedListOutlined,
  FileOutlined,
  KeyOutlined,
} from "@ant-design/icons";

export default function LLMConfigPanel({
  temperature,
  setTemperature,
  tokenLimit,
  setTokenLimit,
  memoryType,
  setMemoryType,
  summaryWindowSize,
  setSummaryWindowSize,
  summaryType,
  setSummaryType,
  onSave,
  onCancel,
}) {
  const showWindowSize = ["buffer", "window", "summary", "hybrid"].includes(memoryType);
  const showSummaryType = ["summary", "hybrid"].includes(memoryType);

  return (
    <div className="p-6 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-2xl shadow-md space-y-4 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <CardContent>
        <Typography variant="h5" gutterBottom fontWeight={600}>
          <SettingOutlined style={{ marginRight: 8 }} />
           Advanced Configuration
        </Typography>

        <Box className="space-y-5 mt-4">
          <Box>
            <Typography gutterBottom>
              <FireOutlined style={{ marginRight: 6 }} />
              Temperature <strong>{temperature.toFixed(1)}</strong>
            </Typography>
            <Slider
              value={temperature}
              min={0}
              max={1}
              step={0.1}
              onChange={(e, v) => setTemperature(v)}
              valueLabelDisplay="auto"
            />
            <Typography variant="caption" color="text.secondary">
              Controls randomness: 0 = deterministic, 1 = more creative
            </Typography>
          </Box>

          <TextField
            label={
              <Box display="flex" alignItems="center">
                <NumberOutlined style={{ marginRight: 6 }} />
                Token Limit
              </Box>
            }
            type="number"
            fullWidth
            value={tokenLimit}
            onChange={(e) => setTokenLimit(Number(e.target.value))}
            helperText="Max number of tokens the model can generate"
          />

          <FormControl fullWidth>
            <InputLabel id="memory-type-label">
              <DatabaseOutlined style={{ marginRight: 6 }} />
              Memory Type
            </InputLabel>
            <Select
              labelId="memory-type-label"
              value={memoryType}
              label="Memory Type"
              onChange={(e) => setMemoryType(e.target.value)}
            >
              <MenuItem value="buffer">
                <FolderOpenOutlined style={{ marginRight: 8 }} />
                Buffer Memory
              </MenuItem>
              <MenuItem value="window">
                <FileTextOutlined style={{ marginRight: 8 }} />
                Window Memory
              </MenuItem>
              <MenuItem value="summary">
                <ProfileOutlined style={{ marginRight: 8 }} />
                Summary Memory
              </MenuItem>
              <MenuItem value="hybrid">
                <SwapOutlined style={{ marginRight: 8 }} />
                Window+Summary Memory
              </MenuItem>
            </Select>
          </FormControl>

          {showWindowSize && (
            <TextField
              sx={{ mt: 2 }}
              label={
                <Box display="flex" alignItems="center">
                  <ExpandOutlined style={{ marginRight: 6 }} />
                  Window Size
                </Box>
              }
              type="number"
              fullWidth
              value={summaryWindowSize}
              onChange={(e) => setSummaryWindowSize(Number(e.target.value))}
              helperText="Number of recent messages to retain"
            />
          )}

          {showSummaryType && (
            <FormControl sx={{ mt: 2 }} fullWidth>
              <InputLabel id="summary-type-label">
                <EditOutlined style={{ marginRight: 6 }} />
                Summary Type
              </InputLabel>
              <Select
                labelId="summary-type-label"
                value={summaryType}
                label="Summary Type"
                onChange={(e) => setSummaryType(e.target.value)}
              >
                <MenuItem value="bullet">
                  <UnorderedListOutlined style={{ marginRight: 8 }} />
                  Bullet Points
                </MenuItem>
                <MenuItem value="paragraph">
                  <FileOutlined style={{ marginRight: 8 }} />
                  Paragraph
                </MenuItem>
                <MenuItem value="keywords">
                  <KeyOutlined style={{ marginRight: 8 }} />
                  Keywords
                </MenuItem>
              </Select>
            </FormControl>
          )}

          <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
            <Button variant="outlined" color="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={onSave}>
              Save Configuration
            </Button>
          </Box>
        </Box>
      </CardContent>
    </div>
  );
}
