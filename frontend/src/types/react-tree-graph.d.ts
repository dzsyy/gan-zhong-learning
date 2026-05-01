declare module 'react-tree-graph' {
  import React from 'react';

  export interface TreeNodeData {
    name: string;
    id?: number | string;
    level?: number;
    isCompleted?: boolean;
    children?: TreeNodeData[];
    [key: string]: any;
  }

  export interface TreeProps {
    data: TreeNodeData;
    width: number;
    height: number;
    onNodeClick?: (node: TreeNodeData, event: React.MouseEvent) => void;
    getNodeColor?: (node: TreeNodeData) => string;
    getNodeTextColor?: (node: TreeNodeData) => string;
    nodeRadius?: number;
    linkColor?: string;
    orientation?: 'horizontal' | 'vertical';
    className?: string;
    svgClassName?: string;
    nodeClassName?: string;
    linkClassName?: string;
  }

  const Tree: React.FC<TreeProps>;
  export default Tree;
}
