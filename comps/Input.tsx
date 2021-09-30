import React, { forwardRef } from "react";
import { AddBranchInput } from "../Utility/MuiCompsStyles";
import { global } from "../Utility/Utility";

const Input = (
  props: { name: string; onInputError: () => void },
  ref: React.Ref<HTMLInputElement>
) => {
  const noSpacebar = (e: any) => {
    if (e.keyCode === 32) {
      // if spacebar
      e.preventDefault();
      props.onInputError();
    }
  };

  return (
    <AddBranchInput
      label={props.name}
      variant="outlined"
      size="small"
      inputRef={ref}
      onKeyDown={(e) => {
        noSpacebar(e);
      }}
      inputProps={{
        maxLength: global.maxInputLength,
        style: { textTransform: "lowercase" },
      }}
    />
  );
};

export default forwardRef(Input);
