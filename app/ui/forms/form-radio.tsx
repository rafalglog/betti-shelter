"use client";

import { useState } from "react";
import { Fieldset, Legend, Radio, RadioGroup } from "@headlessui/react";
import clsx from "clsx";
import FieldError from "../field-error";

interface Option {
  label: string;
  value: string;
}

interface FormRadioProps {
  className?: string;
  legendText: string;
  id: string;
  options: Option[];
  defaultValue?: string;
  errors?: string[];
  subLegendText?: string;
  canManage?: boolean;
}

const FormRadio = ({
  className,
  legendText,
  id,
  options,
  defaultValue,
  errors,
  subLegendText,
  canManage = false,
}: FormRadioProps) => {
  const [selected, setSelected] = useState(defaultValue || (options.length > 0 ? options[0].value : ""));

  return (
    <Fieldset className={className}>
      <Legend id={`${id}-legend`} className="text-sm font-medium leading-6 text-gray-900">
        {legendText}
      </Legend>
      {subLegendText && <p className="mt-1 text-xs text-gray-500">{subLegendText}</p>}
      <RadioGroup
        name={id}
        value={selected}
        onChange={setSelected}
        aria-labelledby={`${id}-legend`}
        className="mt-2 space-y-2"
        disabled={!canManage}
      >
        {options.map((option) => (
          <Radio
            key={`${id}-${option.value}`}
            value={option.value}
            aria-describedby={`${id}-error`}
            disabled={!canManage}
            className={clsx(
              "group flex items-center gap-x-2 rounded-md p-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2",
              canManage ? "cursor-pointer" : "cursor-not-allowed opacity-70"
            )}
          >
            {/* Render prop to access checked state for styling */}
            {({ checked }) => (
              <>
                {/* Custom visual for the radio button */}
                <span className={clsx(
                  "flex size-4 items-center justify-center rounded-full border",
                  checked && canManage ? "border-indigo-600 bg-indigo-600" : "border-gray-300 bg-white",
                  checked && !canManage ? "border-gray-400 bg-gray-400" : "",
                  !checked && !canManage ? "border-gray-300 bg-gray-100" : ""
                )}>
                  {/* Inner dot for checked state */}
                  {checked && <span className={clsx(
                    "size-1.5 rounded-full",
                    canManage ? "bg-white" : "bg-gray-300"
                  )} />}
                </span>
                <span className={clsx("block text-sm font-medium leading-6", !canManage ? "text-gray-500" : "text-gray-900")}>
                  {option.label}
                </span>
              </>
            )}
          </Radio>
        ))}
      </RadioGroup>
      <FieldError id={`${id}-error`} errors={errors} />
    </Fieldset>
  );
};

export default FormRadio;