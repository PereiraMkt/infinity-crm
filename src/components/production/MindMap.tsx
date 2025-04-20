
import { ReactFlowProvider } from "reactflow";
import MindMapFlow from "./mind-map/MindMapFlow";
import "reactflow/dist/style.css";

// Main MindMap component that wraps everything with ReactFlowProvider
const MindMap = () => {
  return (
    <ReactFlowProvider>
      <MindMapFlow />
    </ReactFlowProvider>
  );
};

export default MindMap;
