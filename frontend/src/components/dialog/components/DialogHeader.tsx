import "./DialogHeader.scss";

type DialogHeaderProps = {
  children: React.ReactNode;
};

export default function DialogHeader({ children }: DialogHeaderProps) {
  return <div className="DialogHeader">{children}</div>;
}
