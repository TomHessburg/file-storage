import React from "react";

const ProgressBar = ({ pctg }) => {
  return (
    <div>
      <div className="progress">
        <div
          className="progress-bar bg-info"
          role="progressbar"
          style={{ width: `${pctg}%` }}
        />
      </div>
      {pctg}%
    </div>
  );
};

export default ProgressBar;
