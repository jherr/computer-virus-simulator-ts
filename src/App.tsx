import React, { useState } from "react";
import { Container, CssBaseline, Button, makeStyles } from "@material-ui/core";

import { createInitialState, runGeneration, State } from "./engine";
import { SIMULATOR_SIZE } from "./constants";
import useRequestAnimationFrame from "./useRequestAnimationFrame";

import GenerationsGraph from "./components/GenerationsGraph";
import Simulator from "./components/Simulator";
import Controls from "./components/Controls";

const useStyles = makeStyles({
  root: {
    display: "grid",
    gridTemplateColumns: `450px ${SIMULATOR_SIZE}px`,
    marginTop: "1em",
    gridGap: 10,
  },
  graphBox: {
    padding: 2,
    border: "1px solid #ccc",
    margin: 5,
  },
});

const initialState = createInitialState();

const App = () => {
  const classes = useStyles();

  const [state, setState] = useState<State>(initialState);

  const onRestart = () => {
    setState(createInitialState(state));
  };

  const onPause = () => {
    setState({
      ...state,
      paused: !state.paused,
    });
  };

  useRequestAnimationFrame(() => {
    setState(runGeneration(state));
  });

  return (
    <Container>
      <CssBaseline />
      <div className={classes.root}>
        <div>
          <Controls
            state={state}
            onChange={(key: string, value: number) =>
              setState({
                ...state,
                [key]: value,
              })
            }
          />
          <Button variant="contained" onClick={onPause} fullWidth>
            {state.paused ? "Play" : "Pause"}
          </Button>
          <Button
            variant="contained"
            onClick={onRestart}
            fullWidth
            style={{ marginTop: "1rem" }}
          >
            Restart
          </Button>
        </div>
        <div>
          <div className={classes.graphBox}>
            <GenerationsGraph generations={state.generations} />
          </div>
          <div className={classes.graphBox}>
            <Simulator nodes={state.nodes} />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default App;
