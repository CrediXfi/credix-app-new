import { AmountCard } from "./amount-card";
import { FundsCard } from "./funds-card";

export function HomePage() {
  return (
    <div className="md:[771px] md:mt-11 mt-10  ">
      {" "}
      <h1 className="gradient-heading md:block hidden">
        Abstracting Money <br /> Markets
      </h1>
      <h1 className="gradient-heading md:hidden block">
        The most advanced Lending Protocol <br /> Credix
      </h1>
      <AmountCard />
      <FundsCard />
    </div>
  );
}
