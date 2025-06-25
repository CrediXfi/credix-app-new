import CxHeader from "./_components/cx-header";
import { CxTable } from "./_components/cx-table";
import { Wallet } from "./_components/wallet";


export default function CxPoint() {
  return (
    <div>
      <CxHeader />
      <Wallet />
      <CxTable />
    </div>
  );
}
