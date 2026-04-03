import React, { useEffect, useState, useCallback } from "react";
import { Plus } from "lucide-react";
import TreeNode from "../components/TreeNode";
import AddNodeForm from "../components/AddNodeForm";
import LoadingSpinner from "../components/LoadingSpinner";
import DeleteModal from "../components/DeleteModal";
import type { Node } from "../types";
import { nodeService } from "../services/nodeService";
import toast, { Toaster } from "react-hot-toast";

const insertNode = (nodes: Node[], parentId: string, newNode: Node): Node[] =>
  nodes.map((n) => {
    if (n._id === parentId) {
      return { ...n, children: [...(n.children || []), newNode] };
    }
    if (n.children?.length) {
      return { ...n, children: insertNode(n.children, parentId, newNode) };
    }
    return n;
  });

const removeNode = (nodes: Node[], id: string): Node[] =>
  nodes
    .filter((n) => n._id !== id)
    .map((n) =>
      n.children?.length ? { ...n, children: removeNode(n.children, id) } : n,
    );

const findNode = (nodes: Node[], id: string): Node | undefined => {
  for (const n of nodes) {
    if (n._id === id) return n;
    const found = findNode(n.children || [], id);
    if (found) return found;
  }
};

const Home: React.FC = () => {
  const [rootNodes, setRootNodes] = useState<Node[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    show: boolean;
    nodeId: string;
    nodeName: string;
  } | null>(null);

  const fetchRootNodes = async () => {
    try {
      setLoading(true);
      setError(null);
      const roots = await nodeService.getRootNodes();
      setRootNodes(roots);
    } catch (err) {
      console.error("Failed to fetch nodes:", err);
      setError(
        "Could not connect to backend. Make sure the server is running on port 5000.",
      );
      toast.error("Failed to load node tree");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRootNodes();
  }, []);

  const handleNodeAdded = useCallback((newNode: Node, parentId?: string) => {
    if (!parentId) {
      setRootNodes((prev) => [...prev, newNode]);
      toast.success("Root node created successfully");
    } else {
      setRootNodes((prev) => insertNode(prev, parentId, newNode));
      toast.success("Child node added");
    }
  }, []);

  const handleNodeDeleted = useCallback(
    (id: string) => {
      const nodeToDelete = findNode(rootNodes, id);
      if (nodeToDelete) {
        setDeleteModal({ show: true, nodeId: id, nodeName: nodeToDelete.name });
      }
    },
    [rootNodes],
  );

  const confirmDelete = async () => {
    if (!deleteModal) return;
    try {
      await nodeService.deleteNode(deleteModal.nodeId);
      setRootNodes((prev) => removeNode(prev, deleteModal.nodeId));
      toast.success("Node and all descendants deleted successfully");
    } catch (err) {
      toast.error("Failed to delete node");
    } finally {
      setDeleteModal(null);
    }
  };

  const cancelDelete = () => setDeleteModal(null);

  const handleAddRootNode = async (name: string) => {
    try {
      const newNode = await nodeService.createNode({ name });
      setRootNodes((prev) => [...prev, newNode]);
      toast.success("Root node created");
    } catch (err) {
      toast.error("Failed to create root node");
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md px-6">
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={fetchRootNodes}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-4xl font-bold text-green-600 mb-1 sm:mb-2">
            {" "}
            Recursive Node Tree
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Build and manage hierarchical data with infinite nesting
          </p>
        </div>


        <div className="bg-white rounded-2xl shadow-sm border p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-xl shrink-0">
              <Plus className="text-blue-600" size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-semibold text-gray-800">
                Add Root Node
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Start your tree by creating a root node
              </p>
            </div>
          </div>
          <AddNodeForm
            onSubmit={handleAddRootNode}
            placeholder="Enter root node name"
          />
        </div>

        {/* Tree View */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="px-4 sm:px-8 py-4 sm:py-5 border-b bg-gray-50 flex justify-between items-center">
            <h2 className="font-semibold text-gray-700 text-sm sm:text-base">
              Your Tree Structure
            </h2>
          </div>

          <div className="p-4 sm:p-8">
            {rootNodes.length === 0 ? (
              <div className="text-center py-12 sm:py-16 text-gray-400">
                <div className="text-5xl sm:text-7xl mb-4">🌳</div>
                <p className="text-lg sm:text-xl mb-2">Your tree is empty</p>
                <p className="text-sm sm:text-base">
                  Create a root node to begin building…
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {rootNodes.map((rootNode) => (
                  <TreeNode
                    key={rootNode._id}
                    node={rootNode}
                    onNodeAdded={handleNodeAdded}
                    onNodeDeleted={handleNodeDeleted}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-8 sm:mt-10">
          Full Stack Recursive Node Tree • React + TypeScript + Tailwind +
          MongoDB
        </p>
      </div>

      <DeleteModal
        isOpen={deleteModal?.show || false}
        nodeName={deleteModal?.nodeName || ""}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      <Toaster
        position="top-center"
        toastOptions={{
          success: {
            duration: 3000,
            style: { background: "#10b981", color: "#fff" },
          },
          error: {
            duration: 4000,
            style: { background: "#ef4444", color: "#fff" },
          },
        }}
      />
    </div>
  );
};

export default Home;
