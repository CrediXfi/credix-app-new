"use client";

import Image from "next/image";
import { ChangeEvent, FC } from "react";

export interface USDXLInputProps {
  value: string;
  onChange: (v: string) => void;
  max: number;
  symbol: string;
}

const USDXLInput: FC<USDXLInputProps> = ({
  value,
  onChange,
  max,
  symbol,
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (/^\d*\.?\d*$/.test(v) && parseFloat(v || "0") <= max) {
      onChange(v);
    }
  };

  const parsed = parseFloat(value || "0");
  const formatted = isNaN(parsed) ? "0.00" : parsed.toFixed(2);

  return (
    <div className="grid grid-cols-7 justify-between border border-[#606060] rounded py-[7px] px-[13px] bg-[rgba(255,255,255,0.04)] w-full text-white">
      <div className="col-span-4 flex flex-col justify-center pr-16 border-r border-[#606060]">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="0.00"
          className="bg-transparent text-xl font-medium opacity-75 outline-none placeholder-white w-full"
        />
        <span className="text-base text-white opacity-75">
          ~${formatted}
        </span>
      </div>

      <div className="flex items-center space-x-2 pl-4">
        <Image
          src="/lastusd.svg"
          width={26}
          height={26}
          alt={symbol}
          className="size-[26px]"
        />
        <span className="text-white text-xl font-normal">{symbol}</span>
      </div>
    </div>
  );
};

export default USDXLInput;
