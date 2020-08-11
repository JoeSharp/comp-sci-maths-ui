import React from "react";
import { HeuristicCostById } from "./types";
import Table from "src/components/Bootstrap/Table";
import { roundTo2Dp } from "comp-sci-maths-lib/dist/algorithms/pageRank/pageRank";

interface Props {
  heuristicCostsById: HeuristicCostById;
}

const HeuristicCostTable: React.FunctionComponent<Props> = ({
  heuristicCostsById,
}) => {
  const tableData = React.useMemo(
    () =>
      Object.entries(heuristicCostsById).map(
        ([
          id,
          {
            position: { x, y },
            distance,
          },
        ]) => ({
          id,
          position: `x: ${roundTo2Dp(x)}, y: ${roundTo2Dp(y)}`,
          distance: roundTo2Dp(distance),
        })
      ),
    [heuristicCostsById]
  );

  return <Table data={tableData} headings={["id", "position", "distance"]} />;
};

export default HeuristicCostTable;
