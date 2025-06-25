import { HomeLogo } from "@/app/components/atom/icons/home/home-logo";
import { RightArrowIcon } from "@/app/components/atom/icons/home/right-arrow";

const fundCards = [
  {
    title: "Lend Funds",
    description:
      "Maximize returns through lending yields and protocol incentives. Every deposit earns both interest and valuable reward points",
    action: "Lends Funds Now",
    icon: <HomeLogo className="size-[100px]" idPrefix="first" />,
  },
  {
    title: "Borrow Funds",
    description:
      "Leverage your assets intelligently with flexible borrowing Keep earning rewards while accessing the liquidity you need.",
    action: "Borrow Funds Now",
    icon: <HomeLogo className="size-[100px]" idPrefix="second" />,
  },
];
export function FundsCard() {
  return (
    <div className="grid md:grid-cols-2 md:gap-4 gap-2 md:mt-4 mt-1.5">
      {fundCards.map((card, index) => (
        <div
          key={index}
          className="p-4 md:p-[18px] rounded-[4px] bg-[rgba(135,72,255,0.02)] backdrop-blur-[25px]">
          <div className="flex justify-center">{card.icon}</div>
          <h5 className="text-white text-lg font-semibold leading-6 mt-6">
            {card.title}
          </h5>
          <p className="text-white text-base font-light leading-6 opacity-75 mt-1.5">
            {card.description}
          </p>
          <div className="mt-4 flex items-center gap-1.5 cursor-pointer text-white hover:text-gray-300 ">
            <h6 className="text-sm font-semibold leading-6">{card.action}</h6>
            <RightArrowIcon className="size-6" />
          </div>
        </div>
      ))}
    </div>
  );
}
