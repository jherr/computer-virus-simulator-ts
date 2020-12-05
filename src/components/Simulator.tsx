import React from "react";
import { SIMULATOR_SIZE, BOX_SIZE, COLORS } from "../constants";

import { Node, Status } from "../engine";

const Simulator = ({ nodes }: { nodes: Node[] }) => (
  <svg
    width={SIMULATOR_SIZE}
    height={SIMULATOR_SIZE}
    viewBox={`0 0 ${BOX_SIZE} ${BOX_SIZE}`}
    style={{
      overflow: "hidden",
    }}
  >
    {nodes.map(({ id, x, y, status, links }) => (
      <g key={`links-${id}`}>
        {links.map(({ id: id2, x: x2, y: y2 }) => (
          <line
            key={[id, id2, x, y, x2, y2].join(":")}
            x1={x}
            y1={y}
            x2={x2}
            y2={y2}
            stroke="#aaa"
            strokeWidth={0.5}
          />
        ))}
      </g>
    ))}
    {nodes.map(({ id, x, y, status, links }) => (
      <g key={id}>
        <circle
          cx={x}
          cy={y}
          r={3}
          style={{
            stroke: "none",
            strokeWidth: 0,
            fill: COLORS[status],
          }}
        />
        {status === Status.Sick && (
          <circle
            cx={x}
            cy={y}
            r={5}
            style={{
              stroke: COLORS[status],
              strokeWidth: 1,
              strokeOpacity: 0.2,
              fill: "none",
            }}
          />
        )}
      </g>
    ))}
  </svg>
);

export default Simulator;
