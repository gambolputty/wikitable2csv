import clsx from "clsx";
import { ReactNode } from "react";

const themes = {
  blue: "text-blue-900 bg-blue-100/40 border-2 border-dashed border-blue-300",
  error: "text-red-900 bg-red-100/40 border-2 border-dashed border-red-300",
  gray: "text-gray-900 bg-gray-100/40 border-2 border-dashed border-gray-300",
  yellow:
    "text-yellow-900 bg-yellow-100/40 border-2 border-dashed border-yellow-300",
};

export const InfoContainer = ({
  title,
  theme = "blue",
  className,
  children,
}: {
  title?: string;
  theme?: keyof typeof themes;
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div
      className={clsx(
        "p-6 sm:px-10 sm:py-8 rounded-lg",
        themes[theme],
        className
      )}
    >
      {title && <h2 className="text-2xl font-bold mb-0.5">{title}</h2>}
      {children}
    </div>
  );
};
