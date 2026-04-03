import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronDown, Plus, Trash2 } from "lucide-react";
import type { Node } from "../types";
import AddNodeForm from "./AddNodeForm";
import { nodeService } from "../services/nodeService";

interface TreeNodeProps {
  node: Node;
  onNodeAdded: (newNode: Node, parentId?: string) => void;
  onNodeDeleted: (id: string, name: string) => void;
  level?: number;
  pendingDeleteId?: string | null;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  onNodeAdded,
  onNodeDeleted,
  level = 0,
  pendingDeleteId,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [children, setChildren] = useState<Node[]>(node.children || []);
  const [loadingChildren, setLoadingChildren] = useState(false);
  const [addChildError, setAddChildError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChildren = async () => {
      setLoadingChildren(true);
      try {
        const fetched = await nodeService.getChildren(node._id);
        setChildren(fetched);
      } catch (err) {
        console.error("[TreeNode] failed to fetch children:", err);
      } finally {
        setLoadingChildren(false);
      }
    };
    fetchChildren();
  }, [node._id]);

  useEffect(() => {
    if (!pendingDeleteId) return;
    setChildren((prev) => prev.filter((c) => c._id !== pendingDeleteId));
  }, [pendingDeleteId]);

  const hasChildren = children.length > 0;

  const handleToggle = () => {
    if (hasChildren) setIsExpanded((p) => !p);
  };

  const handleAddChild = async (name: string) => {
    setAddChildError(null);
    try {
      const newNode = await nodeService.createNode({
        name,
        parentId: node._id,
      });
      setChildren((prev) => [...prev, newNode]);
      onNodeAdded(newNode, node._id);
      setShowAddForm(false);
      setIsExpanded(true);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Failed to add child node";
      setAddChildError(message);
    }
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
    setAddChildError(null);
  };

  return (
    <div className="select-none">
      <div
        className={`flex items-center gap-1.5 sm:gap-2 py-1.5 sm:py-2 px-2 sm:px-3
          hover:bg-gray-100 rounded-lg group
          ${level > 0 ? "ml-4 sm:ml-6 border-l-2 border-gray-200" : ""}`}
      >
        <button
          onClick={handleToggle}
          className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center
                     text-gray-500 hover:text-gray-700 transition-colors shrink-0"
        >
          {loadingChildren ? (
            <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : hasChildren ? (
            isExpanded ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )
          ) : (
            <div className="w-5 h-5 sm:w-6 sm:h-6" />
          )}
        </button>

        <span
          onClick={handleToggle}
          className="flex-1 text-sm sm:text-base text-gray-800 font-medium cursor-pointer truncate min-w-0"
        >
          {node.name}
        </span>

        <div
          className="flex items-center gap-0.5 sm:gap-1
                     opacity-100 sm:opacity-0 sm:group-hover:opacity-100
                     transition-opacity shrink-0"
        >
          <button
            onClick={() => setShowAddForm((p) => !p)}
            className="p-1 sm:p-1.5 hover:bg-green-100 rounded text-green-600
                       hover:text-green-700 transition touch-manipulation"
            title="Add child node"
          >
            <Plus size={14} className="sm:hidden" />
            <Plus size={16} className="hidden sm:block" />
          </button>
          <button
            onClick={() => onNodeDeleted(node._id, node.name)}
            className="p-1 sm:p-1.5 hover:bg-red-100 rounded text-red-600
                       hover:text-red-700 transition touch-manipulation"
            title="Delete node and all children"
          >
            <Trash2 size={14} className="sm:hidden" />
            <Trash2 size={16} className="hidden sm:block" />
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="ml-8 sm:ml-10 mt-2 mb-3 pr-2">
          <AddNodeForm
            onSubmit={handleAddChild}
            onCancel={handleCancelAdd}
            placeholder="New child node name"
            buttonText="Add Child"
            error={addChildError}
            onClearError={() => setAddChildError(null)}
          />
        </div>
      )}

      {isExpanded && hasChildren && (
        <div className="ml-4 sm:ml-6 mt-1">
          {children.map((child) => (
            <TreeNode
              key={child._id}
              node={child}
              onNodeAdded={onNodeAdded}
              onNodeDeleted={onNodeDeleted}
              level={level + 1}
              pendingDeleteId={pendingDeleteId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNode;
