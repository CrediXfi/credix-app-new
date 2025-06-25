import { ToolTipIcon } from "@/app/components/atom/icons/market/tooltip";

export default function CxHeader() {
  return (
    <div>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="w-full md:w-[40%]">
          <h1 className="text-white text-2xl font-semibold leading-6">
            CX Points
          </h1>
          <p className="text-white text-base opacity-75 font-light">
            Find your CX Points here
          </p>
        </div>

        <div className="w-full md:w-2/6 grid lg:grid-cols-2 gap-4">
          <div className="rounded-[4px] border border-[#855ECA] bg-white/10 backdrop-blur-[25px] py-1.5 px-3">
            <h4 className="text-white text-xs font-light opacity-75 flex items-center gap-1">
              Points Distributed{" "}
              <ToolTipIcon className="size-4 cursor-pointer" />
            </h4>
            <h6 className="text-white text-lg font-semibold mt-1.5 flex items-center">
              4.0<span className="text-[#606060]">MN</span>
            </h6>
          </div>
          <div className="rounded-[4px] border border-[#855ECA] bg-white/10 backdrop-blur-[25px] py-1.5 px-3">
            <h4 className="text-white text-xs font-light opacity-75 flex items-center gap-1">
              Total Users
              <ToolTipIcon className="size-4 cursor-pointer" />
            </h4>
            <h6 className="text-white text-lg font-semibold mt-1.5 flex items-center">
              645
            </h6>
          </div>
        </div>
      </div>
    </div>
  );
}
