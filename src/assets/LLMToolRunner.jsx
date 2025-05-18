import React, { useState, useEffect } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  Button,
  Typography,
  Tabs,
  Tab,
  Box,
  Card,
  CardContent,
  MenuItem,
  Select,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";
import {
  PlayArrow,
  Pause,
  Stop,
  Replay,
  Code,
  Terminal,
  Schema,
  Memory,
  Settings,
  CloudDownload,
  CloudUpload,
  AccountTree,
} from "@mui/icons-material";
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";

// AI Agent node types with different styling
const nodeTypes = {
  input: {
    background: "#4ade80",
    border: "#22c55e",
    icon: <CloudDownload fontSize="small" />,
  },
  output: {
    background: "#f87171",
    border: "#ef4444",
    icon: <CloudUpload fontSize="small" />,
  },
  processor: {
    background: "#60a5fa",
    border: "#3b82f6",
    icon: <AccountTree fontSize="small" />,
  },
};

const initialNodes = [
  {
    id: "1",
    type: "input",
    data: {
      label: "Fetch Newsletter",
      description: "GET request to fetch latest newsletter content",
      method: "GET",
      endpoint: "/api/newsletters",
    },
    position: { x: 50, y: 50 },
    style: {
      background: nodeTypes.input.background,
      border: `2px solid ${nodeTypes.input.border}`,
      borderRadius: "8px",
      width: "180px",
    },
  },
  {
    id: "2",
    type: "processor",
    data: {
      label: "Process Content",
      description: "Analyze and extract key information",
      method: "PROCESS",
    },
    position: { x: 300, y: 50 },
    style: {
      background: nodeTypes.processor.background,
      border: `2px solid ${nodeTypes.processor.border}`,
      borderRadius: "8px",
      width: "180px",
    },
  },
  {
    id: "3",
    type: "output",
    data: {
      label: "Save Newsletter",
      description: "Store processed newsletter in database",
      method: "POST",
      endpoint: "/api/newsletters",
    },
    position: { x: 550, y: 50 },
    style: {
      background: nodeTypes.output.background,
      border: `2px solid ${nodeTypes.output.border}`,
      borderRadius: "8px",
      width: "180px",
    },
  },
];

const initialEdges = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e2-3", source: "2", target: "3", animated: false },
];

const EXECUTION_STATES = {
  IDLE: "idle",
  RUNNING: "running",
  PAUSED: "paused",
  COMPLETED: "completed",
  ERROR: "error",
};

function LangToolRunner() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedNode, setSelectedNode] = useState("1");
  const [logs, setLogs] = useState([]);
  const [output, setOutput] = useState("");
  const [executionState, setExecutionState] = useState(EXECUTION_STATES.IDLE);
  const [currentStep, setCurrentStep] = useState(0);
  const [executionPath, setExecutionPath] = useState([]);
  const [nodeStatus, setNodeStatus] = useState({});

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onNodeClick = (event, node) => {
    setSelectedNode(node.id);
    setEdges(
      edges.map((edge) => ({
        ...edge,
        animated: edge.source === node.id || edge.target === node.id,
        style: {
          ...edge.style,
          stroke:
            edge.source === node.id || edge.target === node.id
              ? "#3b82f6"
              : "#999",
          strokeWidth:
            edge.source === node.id || edge.target === node.id ? 2 : 1,
        },
      }))
    );
  };

  const executeGraph = async () => {
    setExecutionState(EXECUTION_STATES.RUNNING);
    setOutput("");
    setLogs([]);
    setExecutionPath([]);
    setCurrentStep(0);

    const initialStatus = {};
    nodes.forEach((node) => {
      initialStatus[node.id] = "pending";
    });
    setNodeStatus(initialStatus);

    const path = determineExecutionPath(nodes, edges);
    setExecutionPath(path);

    for (let i = 0; i < path.length; i++) {
      if (executionState === EXECUTION_STATES.PAUSED) {
        await new Promise((resolve) => {
          const interval = setInterval(() => {
            if (executionState !== EXECUTION_STATES.PAUSED) {
              clearInterval(interval);
              resolve();
            }
          }, 100);
        });
      }

      if (
        executionState === EXECUTION_STATES.IDLE ||
        executionState === EXECUTION_STATES.ERROR
      ) {
        break;
      }

      setCurrentStep(i);
      const nodeId = path[i];
      await executeNode(nodeId);
    }

    if (
      executionState !== EXECUTION_STATES.IDLE &&
      executionState !== EXECUTION_STATES.ERROR
    ) {
      setExecutionState(EXECUTION_STATES.COMPLETED);
      addLog("✅ Execution completed successfully");
    }
  };

  const determineExecutionPath = (nodes, edges) => {
    return ["1", "2", "3"];
  };

  const executeNode = async (nodeId) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;

    setNodeStatus((prev) => ({ ...prev, [nodeId]: "running" }));
    addLog(`🚀 Executing node: ${node.data.label}`);

    try {
      if (node.type === "input") {
        await simulateFetch(node);
      } else if (node.type === "processor") {
        await simulateProcessing(node);
      } else if (node.type === "output") {
        await simulateSave(node);
      }

      setNodeStatus((prev) => ({ ...prev, [nodeId]: "completed" }));
      addLog(`✅ Node ${node.data.label} completed successfully`);
    } catch (error) {
      setNodeStatus((prev) => ({ ...prev, [nodeId]: "error" }));
      addLog(`❌ Error in node ${node.data.label}: ${error.message}`);
      setExecutionState(EXECUTION_STATES.ERROR);
    }
  };

  const simulateFetch = async (node) => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const steps = [
      `🔍 Fetching newsletter from ${node.data.endpoint}`,
      "📄 Received response (200 OK)",
      "🧠 Parsing newsletter content",
      `📊 Extracted key information (${
        Math.floor(Math.random() * 5) + 3
      } sections)`,
    ];

    for (const step of steps) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      addLog(step);
      setOutput((prev) => prev + step + "\n");
    }
  };

  const simulateProcessing = async (node) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const steps = [
      "🧠 Analyzing content with LLM",
      "🔍 Identifying key topics and sentiment",
      "📝 Generating summary and insights",
      "✅ Processing complete",
    ];

    for (const step of steps) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      addLog(step);
      setOutput((prev) => prev + step + "\n");
    }
  };

  const simulateSave = async (node) => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const steps = [
      `💾 Saving newsletter to database at ${node.data.endpoint}`,
      "🔐 Validating data structure",
      "📡 Uploading processed content",
      "✅ Newsletter saved successfully",
    ];

    for (const step of steps) {
      await new Promise((resolve) => setTimeout(resolve, 350));
      addLog(step);
      setOutput((prev) => prev + step + "\n");
    }
  };

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
  };

  const handlePlayPause = () => {
    if (executionState === EXECUTION_STATES.RUNNING) {
      setExecutionState(EXECUTION_STATES.PAUSED);
      addLog("⏸ Execution paused");
    } else if (executionState === EXECUTION_STATES.PAUSED) {
      setExecutionState(EXECUTION_STATES.RUNNING);
      addLog("▶ Execution resumed");
    } else {
      executeGraph();
    }
  };

  const handleStop = () => {
    setExecutionState(EXECUTION_STATES.IDLE);
    addLog("⏹ Execution stopped");
  };

  const handleReset = () => {
    setExecutionState(EXECUTION_STATES.IDLE);
    setOutput("");
    setLogs([]);
    setExecutionPath([]);
    setCurrentStep(0);

    const resetStatus = {};
    nodes.forEach((node) => {
      resetStatus[node.id] = "pending";
    });
    setNodeStatus(resetStatus);

    addLog("🔄 Execution reset");
  };

  const selectedNodeData =
    nodes.find((node) => node.id === selectedNode)?.data || {};

  return (
    <div className="shadow-xl bg-gradient-to-br from-sky-50 via-violet-50 to-pink-50 rounded-2xl">
      <CardContent className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <Typography variant="h6" className="font-bold flex items-center">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              LLMFlow Studio
            </span>
            <Chip
              label={executionState.toUpperCase()}
              size="small"
              color={
                executionState === EXECUTION_STATES.RUNNING
                  ? "primary"
                  : executionState === EXECUTION_STATES.COMPLETED
                  ? "success"
                  : executionState === EXECUTION_STATES.ERROR
                  ? "error"
                  : "default"
              }
              className="ml-2"
            />
          </Typography>

          <div className="flex space-x-2">
            <Tooltip
              title={
                executionState === EXECUTION_STATES.RUNNING ? "Pause" : "Run"
              }
            >
              <IconButton
                color="primary"
                onClick={handlePlayPause}
                disabled={executionState === EXECUTION_STATES.COMPLETED}
              >
                {executionState === EXECUTION_STATES.RUNNING ? (
                  <Pause />
                ) : (
                  <PlayArrow />
                )}
              </IconButton>
            </Tooltip>
            <Tooltip title="Stop">
              <IconButton
                color="secondary"
                onClick={handleStop}
                disabled={
                  executionState !== EXECUTION_STATES.RUNNING &&
                  executionState !== EXECUTION_STATES.PAUSED
                }
              >
                <Stop />
              </IconButton>
            </Tooltip>
            <Tooltip title="Reset">
              <IconButton onClick={handleReset}>
                <Replay />
              </IconButton>
            </Tooltip>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onChange={(_, newTab) => setActiveTab(newTab)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<Settings />} label="Configuration" />
          <Tab icon={<Terminal />} label="Execution" />
          <Tab icon={<Code />} label="Node Details" />
          <Tab icon={<Schema />} label="Graph View" />
          <Tab icon={<Memory />} label="Execution Logs" />
        </Tabs>

        {activeTab === 0 && (
          <Box className="space-y-4">
            <Typography variant="h6" className="font-semibold">
              Workflow Configuration
            </Typography>

            <div className="grid grid-cols-2 gap-4 ">
              <Card  variant="outlined" className="p-3">
                <Typography variant="subtitle2" className="font-medium mb-2">
                  Input Nodes
                </Typography>
                <div className="space-y-2">
                  {nodes
                    .filter((n) => n.type === "input")
                    .map((node) => (
                      <Chip
                        key={node.id}
                        label={node.data.label}
                        onClick={() => setSelectedNode(node.id)}
                        color={selectedNode === node.id ? "primary" : "default"}
                        icon={nodeTypes.input.icon}
                        variant={
                          selectedNode === node.id ? "filled" : "outlined"
                        }
                        className="w-full justify-start"
                      />
                    ))}
                </div>
              </Card>

              <Card variant="outlined" className="p-3">
                <Typography variant="subtitle2" className="font-medium mb-2">
                  Processing Nodes
                </Typography>
                <div className="space-y-2">
                  {nodes
                    .filter((n) => n.type === "processor")
                    .map((node) => (
                      <Chip
                        key={node.id}
                        label={node.data.label}
                        onClick={() => setSelectedNode(node.id)}
                        color={selectedNode === node.id ? "primary" : "default"}
                        icon={nodeTypes.processor.icon}
                        variant={
                          selectedNode === node.id ? "filled" : "outlined"
                        }
                        className="w-full justify-start"
                      />
                    ))}
                </div>
              </Card>

              <Card variant="outlined" className="p-3">
                <Typography variant="subtitle2" className="font-medium mb-2">
                  Output Nodes
                </Typography>
                <div className="space-y-2">
                  {nodes
                    .filter((n) => n.type === "output")
                    .map((node) => (
                      <Chip
                        key={node.id}
                        label={node.data.label}
                        onClick={() => setSelectedNode(node.id)}
                        color={selectedNode === node.id ? "primary" : "default"}
                        icon={nodeTypes.output.icon}
                        variant={
                          selectedNode === node.id ? "filled" : "outlined"
                        }
                        className="w-full justify-start"
                      />
                    ))}
                </div>
              </Card>

              <Card variant="outlined" className="p-3">
                <Typography variant="subtitle2" className="font-medium mb-2">
                  Execution Controls
                </Typography>
                <div className="space-y-3">
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PlayArrow />}
                    onClick={handlePlayPause}
                    disabled={executionState === EXECUTION_STATES.COMPLETED}
                    fullWidth
                  >
                    {executionState === EXECUTION_STATES.RUNNING
                      ? "Pause"
                      : "Run"}
                  </Button>
                  <Button sx={{ marginTop: 1 }}
                    variant="outlined"
                    color="secondary"
                    startIcon={<Stop />}
                    onClick={handleStop}
                    disabled={
                      executionState !== EXECUTION_STATES.RUNNING &&
                      executionState !== EXECUTION_STATES.PAUSED
                    }
                    fullWidth
                  >
                    Stop
                  </Button>
                  <Button
                    variant="text"
                    startIcon={<Replay />}
                    onClick={handleReset}
                    fullWidth
                  >
                    Reset
                  </Button>
                </div>
              </Card>
            </div>
          </Box>
        )}

        {activeTab === 1 && (
          <Box className="space-y-4">
            <Typography variant="h6" className="font-semibold">
              Execution Progress
            </Typography>

            <Card variant="outlined" className="p-4">
              <div className="flex items-center justify-between mb-3">
                <Typography variant="subtitle2" className="font-medium">
                  Execution Path
                </Typography>
                <Chip
                  label={`Step ${currentStep + 1} of ${executionPath.length}`}
                  size="small"
                  color="primary"
                />
              </div>

              <div className="flex overflow-x-auto pb-2 space-x-2">
                {executionPath.map((nodeId, index) => {
                  const node = nodes.find((n) => n.id === nodeId);
                  const status = nodeStatus[nodeId] || "pending";
                  const isCurrent = index === currentStep;
                  const isCompleted = index < currentStep;

                  return (
                    <Tooltip key={nodeId} title={node?.data.label}>
                      <div
                        className={`flex flex-col items-center min-w-24 ${
                          isCurrent ? "scale-105" : ""
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center 
                          ${
                            status === "completed"
                              ? "bg-green-100 text-green-600"
                              : status === "running"
                              ? "bg-blue-100 text-blue-600 animate-pulse"
                              : status === "error"
                              ? "bg-red-100 text-red-600"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {status === "running" ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : (
                            React.cloneElement(nodeTypes[node.type].icon, {
                              fontSize: "small",
                            })
                          )}
                        </div>
                        <Typography
                          variant="caption"
                          className={`mt-1 text-center ${
                            isCurrent ? "font-bold" : ""
                          }`}
                        >
                          {node?.data.label}
                        </Typography>
                        <div
                          className={`w-full h-1 mt-1 rounded-full 
                          ${isCompleted ? "bg-green-500" : "bg-gray-200"}`}
                        >
                          {isCurrent && (
                            <div className="h-1 rounded-full bg-blue-500 animate-pulse w-full"></div>
                          )}
                        </div>
                      </div>
                    </Tooltip>
                  );
                })}
              </div>
            </Card>

            <Card variant="outlined" className="p-4">
              <Typography variant="subtitle2" className="font-medium mb-2">
                Execution Output
              </Typography>
              <Box className="bg-gray-50 rounded p-3 font-mono h-48 overflow-auto whitespace-pre-wrap text-sm">
                {output || (
                  <span className="text-gray-400">
                    Execution output will appear here...
                  </span>
                )}
              </Box>
            </Card>
          </Box>
        )}

        {activeTab === 2 && (
          <Box className="space-y-4">
            <Typography variant="h6" className="font-semibold">
              Node Configuration: {selectedNodeData.label}
            </Typography>

            <Card variant="outlined" className="p-4">
              <Typography variant="subtitle2" className="font-medium mb-2">
                Node Details
              </Typography>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Typography variant="caption" className="text-gray-500">
                    Node Type
                  </Typography>
                  <Typography>
                    {selectedNodeData.method || "PROCESS"}
                  </Typography>
                </div>

                <div>
                  <Typography variant="caption" className="text-gray-500">
                    Status
                  </Typography>
                  <Typography>
                    <Chip
                      label={nodeStatus[selectedNode] || "pending"}
                      size="small"
                      color={
                        nodeStatus[selectedNode] === "completed"
                          ? "success"
                          : nodeStatus[selectedNode] === "running"
                          ? "primary"
                          : nodeStatus[selectedNode] === "error"
                          ? "error"
                          : "default"
                      }
                    />
                  </Typography>
                </div>
              </div>

              <Typography variant="caption" className="text-gray-500">
                Description
              </Typography>
              <Typography className="mb-4">
                {selectedNodeData.description || "No description available"}
              </Typography>

              {selectedNodeData.endpoint && (
                <>
                  <Typography variant="caption" className="text-gray-500">
                    Endpoint
                  </Typography>
                  <Typography className="mb-4">
                    {selectedNodeData.endpoint}
                  </Typography>
                </>
              )}

              {selectedNodeData.method === "POST" && (
                <>
                  <Divider className="my-3" />
                  <Typography variant="subtitle2" className="font-medium mb-2">
                    Payload Configuration
                  </Typography>
                  <Typography variant="caption" className="text-gray-500">
                    The processed data will be automatically sent to the
                    endpoint
                  </Typography>
                </>
              )}
            </Card>
          </Box>
        )}

        {activeTab === 3 && (
          <Box style={{ height: "500px" }}>
            <ReactFlowProvider>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={(params) => setEdges((eds) => addEdge(params, eds))}
                onNodeClick={onNodeClick}
                fitView
                nodesDraggable
                nodesConnectable
                elementsSelectable
              >
                <MiniMap />
                <Controls />
                <Background color="#aaa" gap={16} />
              </ReactFlow>
            </ReactFlowProvider>
          </Box>
        )}

        {activeTab === 4 && (
          <Box className="space-y-4">
            <Typography variant="h6" className="font-semibold">
              Execution Logs
            </Typography>

            <Card variant="outlined" className="p-4">
              <Box className="bg-black text-green-400 p-3 rounded font-mono h-96 overflow-auto text-sm whitespace-pre-wrap">
                {logs.length > 0 ? (
                  logs.map((log, i) => (
                    <div
                      key={i}
                      className="py-1 border-b border-gray-800 last:border-0"
                    >
                      {log}
                    </div>
                  ))
                ) : (
                  <span className="text-gray-500">
                    No logs yet. Run the workflow to see execution logs.
                  </span>
                )}
              </Box>
            </Card>
          </Box>
        )}
      </CardContent>
    </div>
  );
}

export default LangToolRunner;
