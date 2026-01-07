import { ElkExtendedEdge, ElkNode } from 'elkjs';

export interface ElkRoot<TNodeData = unknown, TEdgeData = unknown>
  extends ElkNode {
  readonly children: ElkNodeWithData<TNodeData>[];
  readonly edges: ElkEdgeWithData<TEdgeData>[];
}

export interface ElkNodeWithData<TData = unknown> extends ElkNode {
  readonly data: TData;
}

export interface ElkEdgeWithData<TData = unknown> extends ElkExtendedEdge {
  readonly data: TData;
}
