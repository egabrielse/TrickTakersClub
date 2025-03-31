import "./PageTopper.scss";

type PageTopperProps = {
  pre?: string;
  post?: string;
  title: string;
};

export default function PageTopper({ pre, post, title }: PageTopperProps) {
  return (
    <div className="PageTopper">
      <div className="PageTopper-Title">
        <h3>{pre || ""}</h3>
        <span>{title.toUpperCase()}</span>
        <h4>{post || ""}</h4>
      </div>
    </div>
  );
}
