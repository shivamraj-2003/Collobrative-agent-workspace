import React, { useState } from "react";
import {
  Tabs,
  Tab,
  Box,
  Fab,
  Paper,
  Typography,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import {
  MessageOutlined,
  FolderOpenOutlined,
  MailOutlined,
  SettingOutlined,
  ToolOutlined,
  EditOutlined,
  UserSwitchOutlined,
  SearchOutlined,
  BarChartOutlined,
  RobotOutlined,
} from "@ant-design/icons";

import PresenceBar from "./assets/PresenceBar";
import ChatWindow from "./assets/ChatWindow";
import ThreadTree from "./assets/ThreadTree";
import MessageInput from "./assets/MessageInput";
import MessageViewer from "./assets/MessageViewer";
import LLMConfigPanel from "./assets/LLMConfigPanel";
import LLMToolRunner from "./assets/LLMToolRunner";
import AnnotationPanel from "./assets/AnnotationPanel";
import RoleControl from "./assets/RoleControl";
import AgentInsightPanel from "./assets/AgentInsightPanel";
import AnalyticsDashboard from "./assets/AnalyticsDashboard";
import SystemPrompt from "./assets/SystemPrompt";
import { dummyMessages } from "./data/dummyMessages";
import "./App.css";

const App = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  const [tokenLimit, setTokenLimit] = useState(512);
  const [memoryType, setMemoryType] = useState("buffer");
  const [toolType, setToolType] = useState("GET");
  const [url, setUrl] = useState("");
  const [postBody, setPostBody] = useState("");
  const [messages, setMessages] = useState(dummyMessages);
  const [summaryWindowSize, setSummaryWindowSize] = useState(10);
  const [summaryType, setSummaryType] = useState("bullet");

  const handleTabChange = (_, newValue) => setTabIndex(newValue);

  const onFabClick = () => alert("🚀 Quick Action Triggered!");

  const handleSend = (msg) => {
    setMessages((prev) => [...prev, { id: prev.length + 1, content: msg }]);
  };

  const handleToolRun = () => {
    alert(
      `${toolType} to ${url} with ${toolType === "POST" ? postBody : "no body"}`
    );
  };

  const [savedConfig, setSavedConfig] = useState({
    temperature: 0.7,
    tokenLimit: 1000,
    memoryType: "buffer",
  });

  const handleSave = () => {
    setSavedConfig({ temperature, tokenLimit, memoryType });
    console.log("✅ Saved config:", savedConfig);
  };

  const handleCancel = () => {
    setTemperature(savedConfig.temperature);
    setTokenLimit(savedConfig.tokenLimit);
    setMemoryType(savedConfig.memoryType);
    console.log("❌ Config reverted.");
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <Typography
        variant="h6"
        align="center"
        className="font-extrabold mb-6 text-teal-300 dark:text-indigo-400 flex items-center justify-center gap-2"
      >
        <RobotOutlined className="text-teal-300" style={{ fontSize: 16 }} />
        Collaborative Agent Workspace
      </Typography>
      <div className="flex  mb-4">
        <PresenceBar />
      </div>
      <Paper elevation={0} className="my-4 shadow-none bg-transparent">
        <Tabs
          className="my-4 shadow-none bg-gradient-to-r from-gray-100 via-blue-50 to-blue-100 transition-all duration-500 ease-in-out rounded-xl"
          value={tabIndex}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
          aria-label="Unified Tab Navigation"
        >
          <Tab icon={<SettingOutlined />} label="Advanced" />
          <Tab icon={<ToolOutlined />} label="Tools" />
          <Tab icon={<SettingOutlined />} label="Provider" />
          <Tab icon={<EditOutlined />} label="Annotations" />
          <Tab icon={<UserSwitchOutlined />} label="Roles" />
          <Tab icon={<RobotOutlined />} label="Agent" />
          <Tab icon={<MessageOutlined />} label="Chat" />
          <Tab icon={<FolderOpenOutlined />} label="Threads" />
          <Tab icon={<MailOutlined />} label="Messages" />
          <Tab icon={<BarChartOutlined />} label="Analytics" />
        </Tabs>
      </Paper>

      {(tabIndex == 6 || tabIndex === 7) && (
        <Box className="max-w-2xl  my-4">
          <TextField
            sx={{ width: "50%" }}
            fullWidth
            label={
              <Box display="flex">
                <SearchOutlined style={{ marginRight: 8 }} />
                Search messages or threads...
              </Box>
            }
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Box>
      )}

      <Paper className="mt-2 space-y-4">
        {tabIndex === 6 && <ChatWindow searchTerm={search} />}
        {tabIndex === 7 && <ThreadTree searchTerm={search} />}
        {tabIndex === 8 && (
          <MessageViewer messages={messages} memoryType={memoryType} />
        )}
        {tabIndex === 0 && (
          <LLMConfigPanel
            temperature={temperature}
            setTemperature={setTemperature}
            tokenLimit={tokenLimit}
            setTokenLimit={setTokenLimit}
            memoryType={memoryType}
            setMemoryType={setMemoryType}
            summaryWindowSize={summaryWindowSize}
            setSummaryWindowSize={setSummaryWindowSize}
            summaryType={summaryType}
            setSummaryType={setSummaryType}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}
        {tabIndex === 1 && (
          <LLMToolRunner
            toolType={toolType}
            setToolType={setToolType}
            url={url}
            setUrl={setUrl}
            postBody={postBody}
            setPostBody={setPostBody}
            onRun={handleToolRun}
          />
        )}
        {tabIndex === 2 && <SystemPrompt />}
        {tabIndex === 3 && <AnnotationPanel />}
        {tabIndex === 4 && <RoleControl />}
        {tabIndex === 5 && <AgentInsightPanel />}
        {tabIndex === 9 && <AnalyticsDashboard />}
      </Paper>

      {tabIndex == 6 && <MessageInput onSend={handleSend} />}
    </div>
  );
};

export default App;
