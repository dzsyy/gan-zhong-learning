import { useMemo } from 'react';
import type { Node } from '../../stores/appStore';

interface SimpleMindMapProps {
  nodes: Node[];
  projectName: string;
  selectedNodeId: number | null;
  onNodeClick: (nodeId: number) => void;
}

interface TreeNode {
  id: number;
  name: string;
  level: number;
  isCompleted: boolean;
  children: TreeNode[];
}

const LEVEL_COLORS: Record<number, string> = {
  0: '#06b6d4',
  1: '#06b6d4',
  2: '#0ea5e9',
  3: '#22c55e',
  4: '#f59e0b',
};

const NODE_RADIUS = 24;
const LEVEL_GAP_X = 80;
const NODE_GAP_Y = 80;

function buildTree(nodes: Node[], parentId: number | null, level: number): TreeNode[] {
  return nodes
    .filter(n => n.parentId === parentId && n.level === level)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(node => ({
      id: node.id,
      name: node.name,
      level: node.level,
      isCompleted: node.isCompleted,
      children: buildTree(nodes, node.id, level + 1),
    }));
}

interface LayoutNode extends TreeNode {
  x: number;
  y: number;
  children: LayoutNode[];
}

function calculateLayout(tree: TreeNode[], startX: number, startY: number): LayoutNode[] {
  const result: LayoutNode[] = [];
  const totalWidth = (tree.length - 1) * NODE_GAP_Y;
  let currentX = startX - totalWidth / 2;

  for (const node of tree) {
    const layoutNode: LayoutNode = {
      ...node,
      x: currentX,
      y: startY,
      children: calculateLayout(node.children, currentX, startY + LEVEL_GAP_X),
    };
    result.push(layoutNode);

    const subtreeWidth = calculateSubtreeWidth(node);
    currentX += subtreeWidth * NODE_GAP_Y;
  }

  return result;
}

function calculateSubtreeWidth(node: TreeNode): number {
  if (node.children.length === 0) return 1;
  let total = 0;
  for (const child of node.children) {
    total += calculateSubtreeWidth(child);
  }
  return Math.max(1, total);
}

function flattenTree(nodes: LayoutNode[], result: LayoutNode[] = []): LayoutNode[] {
  for (const node of nodes) {
    result.push(node);
    flattenTree(node.children, result);
  }
  return result;
}

function TreeNodeComponent({
  node,
  onClick,
  selectedNodeId,
}: {
  node: LayoutNode;
  onClick: (id: number) => void;
  selectedNodeId: number | null;
}) {
  const color = LEVEL_COLORS[node.level] || LEVEL_COLORS[1];
  const isSelected = selectedNodeId === node.id;

  return (
    <g>
      {node.children.map((child) => {
        const midY = node.y + LEVEL_GAP_X / 2;
        return (
          <path
            key={`line-${node.id}-${child.id}`}
            d={`M ${node.x} ${node.y + NODE_RADIUS} Q ${node.x} ${midY} ${(node.x + child.x) / 2} ${midY} T ${child.x} ${child.y - NODE_RADIUS}`}
            stroke="#cbd5e1"
            strokeWidth={2}
            fill="none"
          />
        );
      })}

      <circle
        cx={node.x}
        cy={node.y}
        r={NODE_RADIUS}
        fill={node.isCompleted ? '#9ca3af' : color}
        stroke={isSelected ? '#f59e0b' : 'transparent'}
        strokeWidth={isSelected ? 3 : 0}
        style={{ cursor: 'pointer' }}
        onClick={() => onClick(node.id)}
      />

      <text
        x={node.x}
        y={node.y + 4}
        fontSize={13}
        fill="#374151"
        textAnchor="middle"
        style={{ pointerEvents: 'none' }}
      >
        {node.name.length > 12 ? node.name.slice(0, 12) + '...' : node.name}
      </text>

      {node.children.map(child => (
        <TreeNodeComponent
          key={child.id}
          node={child}
          onClick={onClick}
          selectedNodeId={selectedNodeId}
        />
      ))}
    </g>
  );
}

export function SimpleMindMap({
  nodes,
  projectName,
  selectedNodeId,
  onNodeClick,
}: SimpleMindMapProps) {
  const tree = useMemo(() => buildTree(nodes, null, 1), [nodes]);

  const layoutNodes = useMemo(() => {
    if (tree.length === 0) return [];
    const nodes = calculateLayout(tree, 150, 120);
    // Center the tree horizontally
    const allNodes = flattenTree(nodes);
    const minX = Math.min(...allNodes.map(n => n.x));
    const maxX = Math.max(...allNodes.map(n => n.x));
    const centerOffset = (1200 - minX - maxX) / 2;
    allNodes.forEach(n => n.x += centerOffset);
    return nodes;
  }, [tree]);

  const flatNodes = useMemo(() => flattenTree(layoutNodes), [layoutNodes]);

  const rootCx = useMemo(() => {
    if (flatNodes.length === 0) return 600;
    const minX = Math.min(...flatNodes.map(n => n.x));
    const maxX = Math.max(...flatNodes.map(n => n.x));
    return (minX + maxX) / 2;
  }, [flatNodes]);

  const bounds = useMemo(() => {
    if (flatNodes.length === 0) return { width: 1200, height: 400 };
    const maxX = Math.max(...flatNodes.map(n => n.x)) + NODE_RADIUS + 50;
    const maxY = Math.max(...flatNodes.map(n => n.y)) + 60;
    return {
      width: Math.max(maxX, 1200),
      height: Math.max(maxY + 50, 400),
    };
  }, [flatNodes]);

  if (tree.length === 0) return null;

  return (
    <svg
      width={bounds.width}
      height={bounds.height}
      style={{ overflow: 'visible' }}
    >
      <g>
        <circle
          cx={rootCx}
          cy={40}
          r={NODE_RADIUS}
          fill={LEVEL_COLORS[0]}
        />
        <text
          x={rootCx + NODE_RADIUS + 8}
          y={44}
          fontSize={14}
          fontWeight={600}
          fill="#111827"
        >
          {projectName}
        </text>

        {layoutNodes.map(node => (
          <path
            key={`root-line-${node.id}`}
            d={`M ${rootCx} ${40 + NODE_RADIUS} L ${node.x} ${node.y - NODE_RADIUS}`}
            stroke="#cbd5e1"
            strokeWidth={2}
          />
        ))}
      </g>

      {layoutNodes.map(node => (
        <TreeNodeComponent
          key={node.id}
          node={node}
          onClick={onNodeClick}
          selectedNodeId={selectedNodeId}
        />
      ))}
    </svg>
  );
}