import "./Section.scss";

type SectionProps = {
  children: React.ReactNode;
  expanded?: boolean;
  icon?: React.ReactNode;
  id: string;
  title: string;
};
export default function Section({ children, icon, id, title }: SectionProps) {
  return (
    <section key={title} className="Section">
      <div id={id} className="Section-Header">
        {icon && icon}
        <h2>{title}</h2>
      </div>
      <div className="Section-Body">{children}</div>
    </section>
  );
}
