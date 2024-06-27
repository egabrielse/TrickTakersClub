import "./DialogBody.scss";

type DialogBodyProps = {
  children: React.ReactNode;
};

export default function DialogBody({ children }: DialogBodyProps) {
  return <div className="DialogBody">{children}</div>;
}
