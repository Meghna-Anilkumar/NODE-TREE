import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Plus, Trash2 } from 'lucide-react';
import type { Node } from '../types';
import AddNodeForm from './AddNodeForm';
import { nodeService } from '../services/nodeService';

interface TreeNodeProps {
  node: Node;
  onNodeAdded: (newNode: Node, parentId?: string) => void;
  onNodeDeleted: (id: string) => void;
  level?: number;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  onNodeAdded,
  onNodeDeleted,
  level = 0,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const children = node.children || [];
  const hasChildren = children.length > 0;

  const handleToggle = () => {
    if (hasChildren) setIsExpanded(!isExpanded);
  };

  const handleAddChild = async (name: string) => {
    try {
      const newNode = await nodeService.createNode({
        name,
        parentId: node._id,
      });
      onNodeAdded(newNode, node._id);
      setShowAddForm(false);
      setIsExpanded(true);
    } catch (err) {
      alert('Failed to add child node');
    }
  };

  const handleDelete = () => {
    onNodeDeleted(node._id);  
  };

  return (
    <div className="select-none">
      <div
        className={`flex items-center gap-2 py-2 px-3 hover:bg-gray-100 rounded-lg group ${
          level > 0 ? 'ml-6 border-l-2 border-gray-200' : ''
        }`}
      >
        {/* Toggle Button */}
        <button
          onClick={handleToggle}
          className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
        >
          {hasChildren ? (
            isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />
          ) : (
            <div className="w-6 h-6" />
          )}
        </button>

        {/* Node Name */}
        <span
          onClick={handleToggle}
          className="flex-1 text-gray-800 font-medium cursor-pointer"
        >
          {node.name}
        </span>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="p-1.5 hover:bg-green-100 rounded text-green-600 hover:text-green-700 transition"
            title="Add child node"
          >
            <Plus size={16} />
          </button>

          <button
            onClick={handleDelete}
            className="p-1.5 hover:bg-red-100 rounded text-red-600 hover:text-red-700 transition"
            title="Delete node and all children"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Add Child Form */}
      {showAddForm && (
        <div className="ml-10 mt-2 mb-3">
          <AddNodeForm 
            onSubmit={handleAddChild} 
            onCancel={() => setShowAddForm(false)} 
            placeholder="New child node name"
            buttonText="Add Child"
          />
        </div>
      )}

      {/* Recursive Children */}
      {isExpanded && hasChildren && (
        <div className="ml-6 mt-1">
          {children.map((child: Node) => (
            <TreeNode
              key={child._id}
              node={child}
              onNodeAdded={onNodeAdded}
              onNodeDeleted={onNodeDeleted}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNode;