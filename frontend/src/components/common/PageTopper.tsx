import AppLogo from "./AppLogo";
import "./PageTopper.scss";
import StyledTitle from "./StyledTitle";

type PageTopperProps = {
  pre?: string;
  post?: string;
  title: string;
};

export default function PageTopper({ pre, post, title }: PageTopperProps) {
  return (
    <div className="PageTopper">
      <AppLogo size="xlarge" color="white" />
      <div className="PageTopper-Title">
        <h3>{pre || ""}</h3>
        <StyledTitle title={title.toUpperCase()} size="xxlarge" color="white" />
        <h4>{post || ""}</h4>
      </div>
    </div>
  );
}
