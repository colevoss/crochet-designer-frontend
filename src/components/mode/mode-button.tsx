import { cva } from "class-variance-authority";

type Props = {
  children: React.ReactNode;
  selected: boolean;
  hotkey?: string;
};

const buttonVariance = cva("relative p-3 rounded", {
  variants: {
    mode: {
      selected: "bg-cyan-100 hover:bg-cyan-200 text-cyan-700",
      default: "bg-transparent",
    },
  },
});

export function ModeButton({ children, selected }: Props) {
  return (
    <div
      className={buttonVariance({
        mode: selected ? "selected" : "default",
      })}
    >
      {children}
    </div>
  );
}
