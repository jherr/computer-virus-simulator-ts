import createKDTree from "static-kdtree";
import { NODES, BOX_SIZE, HISTORY } from "./constants";

export enum Status {
  Recovered = -1, // Recovered is when someone was sick and is now immune
  Healthy = 0, // A healthy node who can potentially become infected
  Sick = 1, // A node who is actively sick and contageous
}

export interface Node {
  id: number; // Unique ID
  x: number; // X Position
  y: number; // Y Position
  status: Status; // Health status
  sickness: number; // Countdown timer when sick
  links: Node[]; // Links to other nodes
  isBeingAttacked: boolean; // True if the node is being attacked
}

export interface Counts {
  [Status.Recovered]: number; // Number of recovered nodes
  [Status.Sick]: number; // Number of sick nodes
  [Status.Healthy]: number; // Number of healthy nodes
}

export interface Generation {
  generation: number; // The generation index
  counts: Counts; // The counts of the current generation
}

export interface State {
  paused: boolean; // True if the simulation is paused
  nodes: Node[]; // The nodes in the simulation
  infectionRate: number; // How contageous the infection is
  infectionLength: number; // How long the infection lasts
  generations: Generation[]; // The history of the generations
  generation: number; // The current generation index
}

// Create a generation of nodes and set the first node to get sick
export const generateNodes = (state: State): Node[] => {
  type Position = { x: number; y: number };

  // Come up with a grid of locations
  const lines = Math.floor(Math.sqrt(NODES)) + 5;
  const separation = (BOX_SIZE - 10) / lines;
  const offset = 5;
  const positions: Position[] = [];
  const randomFactor = () => Math.random() * 2;
  for (let x = 0; x < lines; x++) {
    for (let y = 0; y < lines; y++) {
      positions.push({
        x: offset + x * separation + randomFactor(),
        y: offset + y * separation + randomFactor(),
      });
    }
  }

  // A local function that grabs a random position
  const grabPosition = (): Position =>
    positions.splice(Math.floor(Math.random() * positions.length), 1)[0];

  // Create the initial set of nodes
  const nodes: Node[] = new Array(NODES).fill({}).map((n, i) => ({
    id: i,
    ...grabPosition(),
    status: i === 0 ? Status.Sick : Status.Healthy,
    sickness: state.infectionLength,
    links: [] as Node[],
    isBeingAttacked: false,
  }));

  // Build the kd-tree from the nodes
  const tree = createKDTree(nodes.map(({ x, y }) => [x, y]));

  // Use the KD tree to find neighbors to link to
  nodes.forEach((node) => {
    tree
      .knn([node.x, node.y], 10)
      .slice(0, 4)
      .filter((i: number) => nodes[i].id !== node.id)
      .forEach((i: number) => {
        node.links.push(nodes[i]);
      });
  });

  return nodes;
};

// Run an entire generation on all the nodes in the simulation
export const runGeneration = (state: State) => {
  if (state.paused) {
    return state;
  }

  // Adjust each node's status
  state.nodes.forEach((node: Node) => {
    node.isBeingAttacked = false;
    if (node.status === Status.Sick && node.sickness > 0) {
      node.sickness -= 0.2;
      if (node.sickness < 1) {
        node.status = Status.Recovered;
      }
    }
  });

  // Go through all the sick nodes and see if they infect anyone
  state.nodes
    .filter(({ status }) => status === Status.Sick)
    .forEach((node) => {
      node.links.forEach((target: Node) => {
        if (target.status === Status.Healthy) {
          if (Math.random() < state.infectionRate) {
            target.status = Status.Sick;
            target.sickness = state.infectionLength;
          } else {
            target.isBeingAttacked = true;
          }
        }
      });
    });

  // Record the statistics of this generation
  const counts: Counts = state.nodes.reduce(
    (a: Counts, { status }) => {
      a[status] += 1;
      return a;
    },
    {
      [Status.Healthy]: 0,
      [Status.Sick]: 0,
      [Status.Recovered]: 0,
    }
  );
  state.generations.push({
    generation: state.generation,
    counts,
  });
  if (state.generations.length > HISTORY) {
    state.generations.splice(0, 1);
  }

  return {
    ...state,
    generations: state.generations,
    generation: state.generation + 1,
    paused: counts[Status.Sick] === 0,
  };
};

// Create the initial status
export const createInitialState = (
  state: State = {
    infectionRate: 0.02,
    infectionLength: 14,
    generations: [],
    generation: 0,
    paused: false,
    nodes: [],
  }
): State => {
  const initialState: State = {
    ...state,
    paused: false,
    generations: [],
    nodes: [],
  };
  initialState.nodes = generateNodes(initialState);
  return initialState;
};
