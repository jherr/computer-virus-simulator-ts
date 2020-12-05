import React from "react";
import { Slider, Typography } from "@material-ui/core";

import { State } from "../engine";

const Controls: React.FC<{
  onChange: (key: string, value: number) => void;
  state: State;
}> = ({ onChange, state }) => (
  <>
    <Typography id="infectionRate-slider" gutterBottom>
      Infection Rate
    </Typography>
    <Slider
      defaultValue={0.5}
      value={state.infectionRate}
      aria-labelledby="infectionRate-slider"
      valueLabelDisplay="on"
      step={0.01}
      onChange={(evt, value) => onChange("infectionRate", value as number)}
      marks
      min={0.01}
      max={0.3}
    />

    <Typography id="infectionLength-slider" gutterBottom>
      Infection Length
    </Typography>
    <Slider
      defaultValue={14}
      value={state.infectionLength}
      aria-labelledby="infectionLength-slider"
      valueLabelDisplay="on"
      step={1}
      onChange={(evt, value) => onChange("infectionLength", value as number)}
      marks
      min={7}
      max={21}
    />
  </>
);

export default Controls;
