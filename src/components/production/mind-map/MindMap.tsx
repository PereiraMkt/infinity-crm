
import { ReactFlowProvider } from "reactflow";
import MindMapFlow from "./MindMapFlow";
import "reactflow/dist/style.css";

// Main MindMap component that wraps everything with ReactFlowProvider
const MindMap = () => {
  return (
    <div className="h-[calc(100vh-13rem)] bg-secondary/10 rounded-lg shadow overflow-hidden">
      <ReactFlowProvider>
        <MindMapFlow />
      </ReactFlowProvider>
    </div>
  );
};

export default MindMap;
