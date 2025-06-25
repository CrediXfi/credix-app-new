"use client";
import React from "react";

const assetOptions = ["FEUSD", "HYPE", "PURR"];

type Props = {
  isOpen: boolean;
  onToggle: () => void;
  selectedAssets: string[];
  onSelectAssets: (selected: string[]) => void;
};

export function SelectAssetsDropdown({
  isOpen,
  onToggle,
  selectedAssets,
  onSelectAssets,
}: Props) {
  const toggleAsset = (asset: string) => {
    if (selectedAssets.includes(asset)) {
      onSelectAssets(selectedAssets.filter((m) => m !== asset));
    } else {
      onSelectAssets([...selectedAssets, asset]);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={onToggle}
        className="inline-flex justify-between w-48 rounded-md border border-[rgba(255,255,255,0.3)] px-4 py-2 text-sm font-normal text-white opacity-75 shadow-sm bg-transparent"
      >
        {selectedAssets.length > 0
          ? selectedAssets.join(", ")
          : "Select Asset"}
        <svg
          className="-mr-1 ml-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.354a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-60 rounded-md bg-white shadow-lg border border-gray-200">
          <ul className="py-1">
            {assetOptions.map((asset) => (
              <li
                key={asset}
                className="px-4 py-2 hover:bg-gray-100 flex items-center"
              >
                <input
                  type="checkbox"
                  checked={selectedAssets.includes(asset)}
                  onChange={() => toggleAsset(asset)}
                  className="mr-2"
                />
                {asset}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}