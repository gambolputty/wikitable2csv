import { Button } from "components";
import { Options, useOptions } from "context";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { createApiUrl, startCase } from "utils";

const checkboxes: Array<keyof Options> = ["trimCells", "includeLineBreaks"];

export const Form = () => {
  const [formIsValid, setFormIsValid] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);
  const { options, updateOptions } = useOptions();
  const [localOptions, setLocalOptions] = useState({ ...options });
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formIsValid) return;

    const urlInput = inputRef.current?.value;
    const titleAndQueryUrl = urlInput && createApiUrl(urlInput);

    if (!titleAndQueryUrl || !titleAndQueryUrl.queryUrl.length) {
      setUrlError("Error parsing URL. Is this a valid URL to a Wiki page?");
      return;
    }

    updateOptions({
      ...localOptions,
      title: titleAndQueryUrl.title,
      url: titleAndQueryUrl.queryUrl,
      excludedCSSClassNames: localOptions.excludedCSSClassNames.map((val) => {
        val = val.trim();
        return val.charAt(0) === "." ? val.slice(1) : val;
      }),
    });
  };

  const handleFormChange = () => {
    setFormIsValid(formRef.current?.checkValidity() || false);
    setUrlError(null);
  };

  const updateLocalOption = (key: keyof Options, value: any) => {
    setLocalOptions((oldState) => ({
      ...oldState,
      [key]: value,
    }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      onChange={handleFormChange}
      ref={formRef}
      className="space-y-3"
    >
      <div className="flex items-center relative">
        <div className="w-full">
          <label htmlFor="page-url" className="sr-only">
            Wiki Page URL:
          </label>
          <input
            ref={inputRef}
            type="url"
            required
            name="page-url"
            id="page-url"
            placeholder="Enter a Wiki Page URL, e.g. https://en.wikipedia.org/wiki/Lists_of_earthquakes"
            className="w-full h-14 placeholder:text-gray-400 text-xl px-4 rounded-md"
          />
          {urlError && <p className="mt-1 text-sm text-red-500">{urlError}</p>}
        </div>
        <Button
          type="submit"
          roundedRight
          disabled={!formIsValid}
          className="absolute inset-y-0 right-0"
        >
          Send
        </Button>
      </div>

      <div className="p-3 rounded-md space-y-3 text-gray-800 bg-gray-100">
        <div className="text-sm font-bold">Options:</div>
        <div className="space-y-2 sm:space-y-0 sm:flex sm:space-x-4">
          {checkboxes.map((optName) => (
            <div key={optName} className="flex space-x-1.5 items-center">
              <input
                type="checkbox"
                id={`${optName}-checkbox`}
                name={optName}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                checked={localOptions[optName] === true}
                onChange={() =>
                  updateLocalOption(optName, !localOptions[optName])
                }
              />
              <label htmlFor={`${optName}-checkbox`}>
                {startCase(optName)}
              </label>
            </div>
          ))}
        </div>
        <div className="space-y-3 sm:space-y-0 sm:flex sm:space-x-4">
          <div className="grow flex flex-col">
            <label htmlFor="table-selector" className="text-sm font-bold">
              Table selector <span className="font-normal">(required)</span>
            </label>
            <input
              type="text"
              maxLength={50}
              required
              id="table-selector"
              value={localOptions.tableSelector}
              onChange={(e) =>
                updateLocalOption("tableSelector", e.target.value)
              }
              placeholder='Defaults to ".wikitable"'
              className="rounded-md mt-1 invalid:border-red-500 invalid:ring-red-500"
            />
          </div>
          <div className="grow flex flex-col">
            <label htmlFor="classnames-exclude" className="text-sm font-bold">
              CSS class names to exclude
            </label>
            <input
              type="text"
              maxLength={150}
              id="classnames-exclude"
              value={localOptions.excludedCSSClassNames.join(",")}
              onChange={(e) =>
                updateLocalOption(
                  "excludedCSSClassNames",
                  e.target.value.length ? e.target.value.split(",") : []
                )
              }
              placeholder="Comma separated list of CSS class names to exclude"
              className="rounded-md mt-1"
            />
          </div>
        </div>
      </div>
    </form>
  );
};
