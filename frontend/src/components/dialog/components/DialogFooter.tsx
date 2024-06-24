import './DialogFooter.scss';

type DialogFooterProps = {
  children: React.ReactNode;
}

export default function DialogFooter({ children }: DialogFooterProps) {
  return (
    <div className="DialogFooter">
      {children}
    </div>
  )
}