import { HomeLogo } from "@/app/components/atom/icons/home/home-logo";
import { RightArrowIcon } from "@/app/components/atom/icons/home/right-arrow";

const fundCards = [
  {
    title: "Lend & Borrow",
    description:
      // "Maximize returns through lending yields and protocol incentives. Every deposit earns both interest and valuable reward points",
      "Lenders lend assets and earn interest, points and incentives. Borrowers borrow assets at efficient interest rates to do carry trades and looping strategies.",
    action: "Lend & Borrow Now",
    icon: <HomeLogo className="size-[100px]" idPrefix="first" />,
  },
  {
    title: "Stake",
    description:
      // "Leverage your assets intelligently with flexible borrowing Keep earning rewards while accessing the liquidity you need.",
      "Stake CX or cLP (CX/USDC LP) for veCX. The protocol shares revenue, token emissions and potential airdrops from other protocols with veCX holders",
    action: "Coming Soon...",
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
          {index === 0 ?
            <a
              href="/market"
              className="mt-4 flex items-center gap-1.5 cursor-pointer text-white hover:text-gray-300 "
            >
              <h6 className="text-sm font-semibold leading-6">{card.action}</h6>
              <RightArrowIcon className="size-6" />
            </a>
            :
            <div className="mt-4 flex items-center gap-1.5 cursor-pointer text-white hover:text-gray-300 ">
              <h6 className="text-sm font-semibold leading-6">{card.action}</h6>
            </div>
          }
        </div>
      ))}
    </div>
  );
}
