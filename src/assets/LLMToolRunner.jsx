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
} from "@mui/material";
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";

const initialNodes = [
  { id: "1", data: { label: "Fetch Newsletter" }, position: { x: 50, y: 50 } },
  { id: "2", data: { label: "Save to Database" }, position: { x: 300, y: 50 } },
  { id: "3", data: { label: "LLM Reply Generator" }, position: { x: 550, y: 50 } },
];

const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

function LangToolRunner() {
  const [activeTab, setActiveTab] = useState(0);
  const [toolType, setToolType] = useState("GET");
  const [selectedNode, setSelectedNode] = useState("1");
  const [postBody, setPostBody] = useState("{}");
  const [logs, setLogs] = useState([]);
  const [output, setOutput] = useState("");
  const [nodeMemory, setNodeMemory] = useState({});

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const simulateRun = async () => {
    let curr = selectedNode;
    const visited = new Set();
    const queue = [curr];
    let logQueue = [];

    while (queue.length) {
      let nodeId = queue.shift();
      visited.add(nodeId);
      logQueue.push(`🧠 Executing ${toolType} at node ${nodeId}`);

      let memory = nodeMemory[nodeId] || {};
      const tokens = ["Thinking", ".", ".", "Done!"];

      for (let i = 0; i < tokens.length; i++) {
        await new Promise((res) => setTimeout(res, 300));
        logQueue.push(`💬 Node ${nodeId} Output: ${tokens[i]}`);
        setOutput((prev) => prev + `Node ${nodeId}: ${tokens[i]}\n`);
      }

      memory.lastOutput = `Node ${nodeId} completed.`;
      setNodeMemory((prev) => ({ ...prev, [nodeId]: memory }));

      edges.forEach((e) => {
        if (e.source === nodeId && !visited.has(e.target)) queue.push(e.target);
      });
    }
    setLogs((prev) => [...prev, ...logQueue]);
  };

  return (
    <Card className="shadow-xl bg-gradient-to-br from-sky-100 via-violet-100 to-pink-100 rounded-2xl">
      <CardContent className="space-y-6 p-6">
        <Typography variant="h4" className="font-bold">
          🧠 LangGraph Studio (Cursor Style)
        </Typography>

        <Tabs value={activeTab} onChange={(_, newTab) => setActiveTab(newTab)}>
          <Tab label="Agent Config" />
          <Tab label="Agent Output" />
          <Tab label="Logs" />
          <Tab label="Graph View" />
          <Tab label="Memory" />
        </Tabs>

        {activeTab === 0 && (
          <Box className="space-y-4">
            <Select fullWidth value={toolType} onChange={(e) => setToolType(e.target.value)}>
              <MenuItem value="GET">GET Node</MenuItem>
              <MenuItem value="POST">POST Node</MenuItem>
            </Select>

            <Select fullWidth value={selectedNode} onChange={(e) => setSelectedNode(e.target.value)}>
              {nodes.map((node) => (
                <MenuItem key={node.id} value={node.id}>
                  {node.data.label}
                </MenuItem>
              ))}
            </Select>

            {toolType === "POST" && (
              <Box>
                <Typography variant="subtitle2">Agent Payload (JSON)</Typography>
                <JSONInput
                  id="json_payload"
                  placeholder={JSON.parse(postBody || "{}")}
                  locale={locale}
                  height="200px"
                  width="100%"
                  onChange={(e) => {
                    if (!e.error) setPostBody(JSON.stringify(e.jsObject));
                  }}
                />
              </Box>
            )}

            <Button variant="contained" color="primary" onClick={simulateRun}>
              🚀 Run Chain
            </Button>
          </Box>
        )}

        {activeTab === 1 && (
          <Box className="bg-white rounded p-4 shadow-inner font-mono h-40 overflow-auto whitespace-pre-wrap">
            <Typography variant="subtitle2">🧠 Chain Output:</Typography>
            {output}
          </Box>
        )}

        {activeTab === 2 && (
          <Box className="bg-black text-green-400 p-4 rounded font-mono h-40 overflow-auto text-sm whitespace-pre-wrap">
            <Typography variant="subtitle2" color="white">
              📜 Logs
            </Typography>
            {logs.map((log, i) => (
              <div key={i}>{log}</div>
            ))}
          </Box>
        )}

        {activeTab === 3 && (
          <Box style={{ height: 400 }}>
            <ReactFlowProvider>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={(params) => setEdges((eds) => addEdge(params, eds))}
                fitView
              >
                <MiniMap />
                <Controls />
                <Background color="#aaa" gap={16} />
              </ReactFlow>
            </ReactFlowProvider>
          </Box>
        )}

        {activeTab === 4 && (
          <Box className="bg-gray-100 rounded p-4 font-mono overflow-auto text-sm">
            <Typography variant="subtitle2">🧠 Agent Memory</Typography>
            <pre>{JSON.stringify(nodeMemory, null, 2)}</pre>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default LangToolRunner;
