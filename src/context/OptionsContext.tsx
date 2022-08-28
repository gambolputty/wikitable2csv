import { createContext, ReactNode, useContext, useState } from "react";

export type Options = {
  url?: string;
  title?: string;
  tableSelector: string;
  trimCells: boolean;
  includeLineBreaks: boolean;
  excludedCSSClassNames: string[];
};

type OptionsContextType = {
  options: Options;
  updateOptions: (val: Options) => void;
};

const OptionsContext = createContext<OptionsContextType | null>(null);

export const OptionsProvider = ({
  initialOptions,
  children,
}: {
  initialOptions: Options;
  children: ReactNode;
}) => {
  const [options, setOptions] = useState<Options>(initialOptions);
  const updateOptions: OptionsContextType["updateOptions"] = (newOptions) => {
    setOptions((oldOptions) => ({
      ...oldOptions,
      ...newOptions,
    }));
  };

  return (
    <OptionsContext.Provider
      value={{
        options,
        updateOptions,
      }}
    >
      {children}
    </OptionsContext.Provider>
  );
};

export const useOptions = () => {
  const context = useContext(OptionsContext);

  if (!context)
    throw new Error("useOptions must be used inside a `OptionsProvider`");

  return context;
};
