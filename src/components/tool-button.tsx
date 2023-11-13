type Props = {
  children: React.ReactNode;
  desc: string;
  onClick: () => void;
};

export function ToolButton({ children, desc, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center p-0.5 rounded hover:outline outline-1 outline-neutral-300 space-y-0.5"
    >
      <div className="flex-1">{children}</div>
      <div className="text-xs">{desc}</div>
    </button>
  );
}
