import React from "react";
import GraphBuilder, { useGraphBuilder } from "./GraphBuilder";
import simpleGraph from "./cannedGraphs/simpleStringGraph";
import GraphPickerWithSketch, {
  usePicker as useGraphPicker,
} from "./GraphPickerWithSketch";
import { StringDataItem } from "src/components/p5/Boid/types";
import DataItemBoid from "src/components/p5/Boid/DataItemBoid";
import Checkbox from "src/components/Bootstrap/Checkbox";
import NewGraphDialog, {
  useDialog as useNewGraphDialog,
} from "./NewGraphDialog";
import ButtonBar, {
  Props as ButtonBarProps,
} from "src/components/Bootstrap/Buttons/ButtonBar";

const initialGraph = simpleGraph();

const GraphManager: React.FunctionComponent = () => {
  const {
    graphName,
    graph,
    savedGraphUse: { createNew, save, reset },
    componentProps: graphPickerProps,
    sketchUse: { updateConfig, sketchContainer },
  } = useGraphPicker(initialGraph);

  const {
    showDialog: showNewGraphDialog,
    componentProps: newGraphProps,
  } = useNewGraphDialog(createNew);

  const graphBuilder = useGraphBuilder(graph);
  const { changeGraph } = graphBuilder;

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

    save(graphName, graph, vertexPositions);
  }, [save, graphName, graph, sketchContainer]);

  const buttonBarProps: ButtonBarProps = React.useMemo(
    () => ({
      buttons: [
        {
          onClick: showNewGraphDialog,
          text: "Create New",
          styleType: "primary",
        },
        {
          onClick: onSave,
          text: "Sae",
          styleType: "primary",
        },
        {
          onClick: reset,
          text: "Reset",
          styleType: "danger",
        },
      ],
    }),
    [showNewGraphDialog, onSave, reset]
  );

  return (
    <div>
      <GraphPickerWithSketch {...graphPickerProps} />

      <div className="form-group">
        <Checkbox
          id="chkPhysics"
          checked={physicsEnabled}
          onChange={onPhysicsEnabledChange}
          label="Physics Enabled"
        />
      </div>
      <ButtonBar {...buttonBarProps} />

      <GraphBuilder graphBuilder={graphBuilder} />
      <NewGraphDialog {...newGraphProps} />
    </div>
  );
};

export default GraphManager;
