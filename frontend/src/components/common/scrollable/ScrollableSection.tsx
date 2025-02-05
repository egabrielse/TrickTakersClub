import "./ScrollableSection.scss";

type ScrollableSectionProps = {
  children: React.ReactNode;
  expanded?: boolean;
  icon?: React.ReactNode;
  id: string;
  title: string;
};
export default function ScrollableSection({
  children,
  icon,
  id,
  title,
}: ScrollableSectionProps) {
  return (
    <section key={title} className="ScrollableSection">
      <div id={id} className="ScrollableSection-Header">
        {icon && icon}
        <h2>{title}</h2>
      </div>
      <div className="ScrollableSection-Body">{children}</div>
    </section>
  );
}
