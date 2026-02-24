import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`bg-white rounded-2xl border border-zinc-100 p-5 shadow-[var(--shadow-card)] ${className}`}
    >
      {children}
    </div>
  );
}
