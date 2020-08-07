import React from "react";

import { Edge } from "comp-sci-maths-lib/dist/dataStructures/graph/Graph";
import { UseBuildGraph } from "./types";
import EdgesCell from "./EdgeCell";

interface Props {
  vertex: string;
  buildGraph: UseBuildGraph<string>;
}

const GET_EDGE_FROM = (edge: Edge<string>) => edge.from;
const GET_EDGE_TO = (edge: Edge<string>) => edge.to;

const VertexRow: React.FunctionComponent<Props> = ({
  vertex,
  buildGraph: {
    version,
    tickVersion,
    newEdgeWeight,
    graph,
    pendingFrom,
    prepareEdge,
    completeEdge,
    cancelEdge,
  },
}) => {
  const onPrepareEdge = React.useCallback(() => prepareEdge(vertex), [
    vertex,
    prepareEdge,
  ]);
  const onCompleteEdge = React.useCallback(
    () => completeEdge(vertex, newEdgeWeight),
    [vertex, newEdgeWeight, completeEdge]
  );
  const onCancelEdge = React.useCallback(() => cancelEdge(), [cancelEdge]);
  const onRemoveVertex = React.useCallback(() => {
    graph.removeVertex(vertex);
    tickVersion();
  }, [vertex, graph, tickVersion]);

  const filterOutgoing = React.useCallback(
    (edge: Edge<string>) => graph.equalityCheck(edge.from, vertex),
    [vertex, graph]
  );
  const filterIncoming = React.useCallback(
    (edge: Edge<string>) => graph.equalityCheck(edge.to, vertex),
    [vertex, graph]
  );

  return (
    <tr>
      <td>{vertex}</td>
      <td>
        <EdgesCell
          version={version}
          tickVersion={tickVersion}
          filter={filterOutgoing}
          getOtherEnd={GET_EDGE_TO}
          graph={graph}
        />
      </td>
      <td>
        <EdgesCell
          version={version}
          tickVersion={tickVersion}
          filter={filterIncoming}
          getOtherEnd={GET_EDGE_FROM}
          graph={graph}
        />
      </td>
      <td>
        <div className="btn-group">
          {pendingFrom === undefined && (
            <button className="btn btn-sm btn-primary" onClick={onPrepareEdge}>
              Edge From
            </button>
          )}
          {pendingFrom !== undefined && pendingFrom !== vertex && (
            <button className="btn btn-sm btn-success" onClick={onCompleteEdge}>
              Edge To
            </button>
          )}
          {pendingFrom === vertex && (
            <button className="btn btn-sm btn-warning" onClick={onCancelEdge}>
              Cancel
            </button>
          )}
          <button className="btn btn-sm btn-danger" onClick={onRemoveVertex}>
            Remove Vertex
          </button>
        </div>
      </td>
    </tr>
  );
};

export default VertexRow;
