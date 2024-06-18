import './AppName.scss'

type AppNameProps = {
  size: "small" | "medium" | "large" | "xlarge" | "xxlarge";
};

export default function AppName({ size }: AppNameProps) {
  return (
    <span className="AppName" style={{ fontSize: size }}>
      Trick Takers Club
    </span>
  );
}
