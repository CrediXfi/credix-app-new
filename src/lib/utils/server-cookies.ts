import { cookies } from 'next/headers';
import { IsExpandedType } from '../hooks/use-sidebar-expand';
import { IsWalletConnectedType } from '../hooks/use-wallet-connection';

export async function getIsSidebarExpandedOnServer() {
  const cookieStore = await cookies();
  return cookieStore.get('sidebarExpanded')?.value as IsExpandedType;
}

export async function getIsWalletConnectedOnServer() {
  const cookieStore = await cookies();
  return cookieStore.get('walletConnected')?.value as IsWalletConnectedType;
}
