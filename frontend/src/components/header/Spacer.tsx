import React from "react";

interface SpacerProps {
  height?: number;
  width?: number;
}

const Spacer: React.FC<SpacerProps> = ({ height, width }) => {
  return <div style={{ height: `${height}px`, width: `${width}px` }} />;
};

export default Spacer;
