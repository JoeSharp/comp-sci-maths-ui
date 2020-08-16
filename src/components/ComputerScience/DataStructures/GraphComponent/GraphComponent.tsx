import React from "react";
import GraphBuilder, { useGraphBuilder } from "./GraphBuilder";
import simpleGraph from "./cannedGraphs/simpleStringGraph";
import Graph from "comp-sci-maths-lib/dist/dataStructures/graph/Graph";
import GraphPicker from "./GraphPicker";
import useSavedGraph from "./useSavedGraph";
import { StringDataItem } from "src/components/p5/Boid/types";
import DataItemBoid from "src/components/p5/Boid/DataItemBoid";
import useGraphSketch from "./useGraphSketch";
import Checkbox from "src/components/Bootstrap/Checkbox";

const initialGraph = simpleGraph();

const GraphComponent: React.FunctionComponent = () => {
  const { addOrUpdate, reset } = useSavedGraph();
  const [graphName, setGraphName] = React.useState<string>("");

  const onGraphNameChange: React.ChangeEventHandler<HTMLInputElement> = React.useCallback(
    ({ target: { value } }) => setGraphName(value),
    [setGraphName]
  );

  const [graph, setGraph] = React.useState<Graph<StringDataItem>>(initialGraph);
  const onGraphChange = React.useCallback(
    (name: string, graph: Graph<StringDataItem>) => {
      setGraph(graph);
      setGraphName(name);
    },
    [setGraph, setGraphName]
  );
  const graphBuilder = useGraphBuilder(graph);
  const { changeGraph } = graphBuilder;

  const { updateConfig, sketchContainer, refContainer } = useGraphSketch(graph);

  const [physicsEnabled, setPhysicsEnabled] = React.useState<boolean>(false);
  const onPhysicsEnabledChange: React.ChangeEventHandler<HTMLInputElement> = React.useCallback(
    ({ target: { checked } }) => setPhysicsEnabled(checked),
    [setPhysicsEnabled]
  );

  React.useEffect(() => {
    updateConfig({ physicsEnabled });
  }, [physicsEnabled, updateConfig]);

  React.useEffect(() => {
    changeGraph(graph);
  }, [graph, changeGraph]);

  const onSave = React.useCallback(() => {
    const vertexPositions = graph.vertices
      .map((v) => sketchContainer.getBoid(v))
      .filter((b) => b !== undefined)
      .map((b) => b as DataItemBoid<StringDataItem>)
      .map((b: DataItemBoid<StringDataItem>) => ({
        key: b.entity.key,
        position: { x: b.position.x, y: b.position.y },
      }))
      .reduce((acc, { key, position }) => ({ ...acc, [key]: position }), {});

    addOrUpdate(graphName, graph, vertexPositions);
  }, [addOrUpdate, graphName, graph, sketchContainer]);

  return (
    <div>
      <form>
        <div className="form-group">
          <label htmlFor="txtNewGraph">Graph Name</label>
          <input
            id="txtNewGraph"
            className="form-control"
            value={graphName}
            onChange={onGraphNameChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="selectGraph">Graph</label>
          <GraphPicker className="form-control" onChange={onGraphChange} />
        </div>

        <div className="form-group">
          <Checkbox
            id="chkPhysics"
            checked={physicsEnabled}
            onChange={onPhysicsEnabledChange}
            label="Physics Enabled"
          />
        </div>
      </form>
      <button className="btn btn-primary" onClick={onSave}>
        Save
      </button>
      <button className="ml-3 btn btn-danger" onClick={reset}>
        Reset
      </button>

      <div className="sketch mt-3" ref={refContainer} />

      <GraphBuilder graphBuilder={graphBuilder} />
    </div>
  );
};

export default GraphComponent;
