import "./AdPlaceholder.scss";

type AdPlaceholderProps = {
  type: "vertical" | "horizontal";
};
export default function AdPlaceholder({ type }: AdPlaceholderProps) {
  const height = type === "vertical" ? 600 : 90;
  const width = type === "vertical" ? 160 : 728;
  return (
    <div className="AdPlaceholder" style={{ height, width }}>
      Advertisement
    </div>
  );
}
