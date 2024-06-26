type CardFanIconProps = {
  size?: number;
  stroke?: string;
};

export default function CardFanIcon({ size = 24, stroke = "#000000" }: CardFanIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      version="1.1"
      fill="none"
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1"
    >
      <rect height="11.5" width="8.25" y="2.75" x="1.75" />
      <path d="m10 3.75 4.25 2-4.25 7.5" />
    </svg>
  );
}
