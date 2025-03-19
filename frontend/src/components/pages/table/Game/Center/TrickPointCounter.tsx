import "./TrickPointCounter.scss";

type TrickPointCounterProps = {
  points: number;
};

export default function TrickPointCounter({ points }: TrickPointCounterProps) {
  return (
    <div className="TrickPointCounter">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="50 50 100 100">
        {/* Circle Path Definition */}
        <defs>
          <path
            id="circlePath"
            d="M 100, 100 m -50, 0 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0"
          />
          <path id="bottomPath" d="M 50, 100 a 50,50 0 0,0 100,0" />
        </defs>

        {/* Circle Background */}
        <circle
          cx="100"
          cy="100"
          r="49"
          fill="#91c37a"
          stroke="white"
          stroke-width="2"
        />

        {/* Top Text */}
        <text
          font-size="18"
          text-anchor="middle"
          fill="white"
          dy="15"
          textLength="90"
          font-family="Courier, monospace"
        >
          <textPath href="#circlePath" startOffset="25%">
            T R I C K
          </textPath>
        </text>

        {/* Points */}
        <text
          x="100"
          y="110"
          font-size="36"
          text-anchor="middle"
          fill="white"
          font-family="Courier, monospace"
        >
          {points}
        </text>

        {/* Bottom Text */}
        <text
          font-size="18"
          text-anchor="middle"
          fill="white"
          font-family="Courier, monospace"
          dy="-5"
        >
          <textPath href="#bottomPath" startOffset="50%">
            P O I N T S
          </textPath>
        </text>
      </svg>
    </div>
  );
}
