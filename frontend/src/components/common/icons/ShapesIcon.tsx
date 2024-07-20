type ShapesIconProps = {
  size?: number;
  stroke?: string;
  rotate?: number;
};

export default function ShapesIcon({
  size = 24,
  stroke = "#000000",
  rotate = 0,
}: ShapesIconProps) {
  return (
    <svg height={size} viewBox="0 0 512 512" transform={`rotate(${rotate})`}>
      <g transform="matrix(1.25 0 0 1.25 127.9128440367 365)">
        <path
          stroke={stroke}
          strokeWidth={24}
          strokeDasharray="none"
          strokeLinecap="butt"
          strokeDashoffset={0}
          strokeLinejoin="miter"
          strokeMiterlimit={4}
          fill="rgb(255,255,255)"
          fillOpacity={0}
          fillRule="nonzero"
          opacity={1}
          transform=" translate(0, 0)"
          d="M -1.24046 -80 C -44.73815 -80 -80 -44.73815 -80 -1.2404599999999988 L -80 -0.4322299999999988 L -80 -0.4322299999999988 C -80 43.98926 -43.98926 80 0.4322300000000041 80 L 0.4322300000000041 80 L 0.4322300000000041 80 C 44.37630000000001 80 80 44.3763 80 0.4322300000000041 L 80 -1.650299999999996 L 80 -1.650299999999996 C 80 -44.92164999999999 44.92164 -80 1.6503000000000014 -80 z"
        />
      </g>
      <g transform="matrix(1.25 0 0 1.2499999844 385 367.8367346939)">
        <path
          stroke={stroke}
          strokeWidth={24}
          strokeDasharray="none"
          strokeLinecap="butt"
          strokeDashoffset={0}
          strokeLinejoin="miter"
          strokeMiterlimit={4}
          fill="rgb(255,255,255)"
          fillOpacity={0}
          fillRule="nonzero"
          opacity={1}
          transform=" translate(0, 0.000005)"
          d="M -47.53599 -80 C -65.46537 -80 -80 -65.46537000000001 -80 -47.53599 L -80 49.35546000000001 L -80 49.35546000000001 C -80 66.27997 -66.27997 80 -49.35546 80 L 50.28504 80 L 50.28504 80 C 66.69616 80 80 66.69616 80 50.285039999999995 L 80 -49.52716000000001 L 80 -49.52716000000001 C 80 -66.35685000000001 66.35684 -80.00001 49.52715 -80.00001 z"
        />
      </g>
      <g transform="matrix(1.3355651776 0 0 1.3355664069 254.2460329017 119.0402971142)">
        <path
          stroke={stroke}
          strokeWidth={24}
          strokeDasharray="none"
          strokeLinecap="butt"
          strokeDashoffset={0}
          strokeLinejoin="miter"
          strokeMiterlimit={4}
          fill="rgb(255,255,255)"
          fillOpacity={0}
          fillRule="nonzero"
          opacity={1}
          transform=" translate(0.0000065874, 0.0000014882)"
          d="M -81.19544 42.4572 C -85.04693 48.61958 -85.25086 56.38669 -81.72806 62.7427 C -78.20526 69.0987 -71.51067 73.04232 -64.24369 73.04232 L 65.01741 73.04232 L 65.01741 73.04232 C 72.00312 73.04232 78.43859 69.25134 81.82504 63.14135 C 85.21149 57.03136000000001 85.01545 49.56488 81.31304 43.64101 C 58.77359 7.57788 13.011660000000006 -65.6412 13.011660000000006 -65.6412 C 10.572000000000006 -69.54495 7.013500000000006 -71.95641 2.483490000000007 -72.77508 C -3.9906499999999934 -73.94509000000001 -10.147269999999994 -71.22031 -13.633949999999992 -65.6412 C -13.633949999999992 -65.6412 -58.90014999999999 6.784720000000007 -81.19545 42.45719 z"
        />
      </g>
    </svg>
  );
}
