type SpadeProps = {
  size?: number;
  fill?: string;
  rotate?: number;
};

export default function Spade({
  size = 24,
  fill = "#000000",
  rotate,
}: SpadeProps) {
  return (
    <svg height={size} viewBox="0 0 512 512" transform={`rotate(${rotate})`}>
      <g>
        <path
          fill={fill}
          d="M405.346,179.901C357.373,117.165,279.963,49.242,259.288,3.77c-1.344-2.964-2.322-3.77-3.29-3.77 c-0.814,0.065-1.946,0.806-3.29,3.77c-20.668,45.472-98.086,113.395-146.05,176.131c-44.03,57.565-60.919,137.556-5.904,184.713 c36.816,31.556,99.063,28.926,134.535-4.65c-3.094,54.967-10.969,107.67-27.068,152.036h95.553 c-16.107-44.365-23.965-97.068-27.06-152.036c35.456,33.575,97.719,36.205,134.527,4.65 C466.265,317.457,449.368,237.466,405.346,179.901z"
        />
      </g>
    </svg>
  );
}
