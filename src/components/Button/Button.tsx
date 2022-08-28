import clsx from "clsx";
import { Spinner } from "components";
import { forwardRef } from "react";

// credits: https://dev.to/frehner/polymorphic-button-component-in-typescript-c28

const themes = {
  primary:
    "text-white bg-blue-600 shadow md:hover:bg-blue-700 focus:ring focus:ring-blue-300",
  outline: `border border-solid border-blue-600 text-blue-600`,
};

const sizes = {
  xs: "px-2.5 py-1.5 text-xs",
  sm: "px-3.5 py-2 text-sm",
  md: "px-5 h-14 text-base",
  lg: "px-5 py-3 text-xl",
};

const iconSizes = {
  xs: "space-x-1.5",
  sm: "space-x-2",
  md: "space-x-2.5",
  lg: "space-x-2.5",
};

type BaseProps = {
  children: React.ReactNode;
  theme?: keyof typeof themes;
  size?: keyof typeof sizes;
  isLoading?: boolean;
  roundedRight?: true;
};

type ButtonAsButton = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    as?: "button";
  };

type ButtonAsExternal = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & {
    as: "externalLink";
  };

type ButtonProps = ButtonAsButton | ButtonAsExternal;

export const Button = forwardRef(
  (
    {
      theme = "primary",
      size = "md",
      isLoading = false,
      roundedRight,
      children,
      className,
      ...props
    }: ButtonProps,
    ref: any
  ) => {
    const content = (
      <>
        {isLoading && <Spinner size="sm" className="text-current" />}
        {children !== "" && (
          <span className="max-w-xs truncate sm:max-w-[260px]">{children}</span>
        )}
      </>
    );
    const classNames = clsx(
      "min-w-fit inline-flex items-center justify-center font-medium transition ease-out",
      "focus:outline-none hover:no-underline",
      "disabled:cursor-not-allowed disabled:opacity-70 disabled:bg-gray-400 hover:disabled:bg-gray-400",
      roundedRight ? "rounded-r-md" : "rounded-md",
      themes[theme],
      sizes[size],
      { [iconSizes[size]]: isLoading },
      className
    );

    if (props.as === "externalLink") {
      const { as, target, rel, ...rest } = props;
      return (
        <a
          ref={ref}
          className={classNames}
          target="_blank"
          rel="noopener noreferrer"
          {...rest}
        >
          {content}
        </a>
      );
    } else {
      const { as, type, ...rest } = props;
      return (
        <button
          ref={ref}
          type={type || "button"}
          className={classNames}
          {...rest}
        >
          {content}
        </button>
      );
    }
  }
);

Button.displayName = "Button";
