'use client';

import Link from 'next/link';
import { Logo } from './atom/logo';
import { getIsSidebarExpandedOnClient, IsExpandedType, useSidebarExpand } from '@/lib/hooks/use-sidebar-expand';
import { cn } from '@/lib/utils';
import { DashboardIcon } from './atom/icons/sidebar/dashboard';
import { JSX, SVGProps } from 'react';
import { MarketIcon } from './atom/icons/sidebar/market';
import { EarnIcon } from './atom/icons/sidebar/earn';
import { CxPointIcon } from './atom/icons/sidebar/cx-point';
import { CollapseArrow } from './atom/icons/sidebar/collapse-arrow';
import { usePathname } from 'next/navigation';
import { AggregatorIcon } from './atom/icons/sidebar/aggregator';
import { DiscordIcon } from './atom/icons/sidebar/discord';
import { AuditIcon } from './atom/icons/sidebar/audit';

type Props = {
  isSidebarExpandedServerState: IsExpandedType;
};

const menuLinks = [
  {
    href: '/market',
    label: 'Market',
    icon: MarketIcon,
  },
  {
    href: '/earn',
    label: 'Earn',
    icon: EarnIcon,
  },
  {
    href: '/cx-point',
    label: 'CX Points',
    icon: CxPointIcon,
  },
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: DashboardIcon,
  },
  {
    href: '',
    label: 'Aggregator',
    icon: AggregatorIcon,
    badge: 'Coming Soon',
  },
];
const bottomMenuLinks = [
  {
    href: '',
    label: 'Discord',
    icon: DiscordIcon,
  },
  {
    href: '',
    label: 'Audit',
    icon: AuditIcon,
  },
];

export function SideBar({ isSidebarExpandedServerState }: Props) {
  const { isExpanded, toggle } = useSidebarExpand(isSidebarExpandedServerState);
  const IS_EXPANDED = getIsSidebarExpandedOnClient(isSidebarExpandedServerState, isExpanded);
  return (
    <aside
      className={cn(
        'fixed hidden xl:block left-0 top-0 h-screen border-r border-white/20 duration-500',
        IS_EXPANDED ? 'w-[240px]' : 'w-[114px]'
      )}
    >
      <div className="relative h-full p-5 ">
        <div className='flex flex-col h-full justify-between'>
          <div>
            <Link href="/">
              <div className={cn('duration-500 overflow-hidden', IS_EXPANDED ? 'w-[130px]' : 'w-10 ms-5')}>
                <Logo className="w-[130px] h-auto" />
              </div>
            </Link>
            <div className="flex flex-col gap-4 mt-10 mb-10 items-center">
              {menuLinks.map((link, index) => (
                <SingleLink key={index} {...link} isExpanded={IS_EXPANDED} />
              ))}
            </div>
          </div>
          <BottomMenuItems isExpanded={IS_EXPANDED} />
        </div>
        <button
          onClick={() => toggle(!IS_EXPANDED)}
          className={cn(
            'text-white absolute bottom-6 -right-[18px] border rounded-full border-white w-9 h-9 flex items-center justify-center bg-[#0D0416] duration-500',
            !IS_EXPANDED && 'rotate-180'
          )}
        >
          <CollapseArrow />
        </button>
      </div>
    </aside>
  );
}

function BottomMenuItems({ isExpanded }: { isExpanded: boolean }) {
  return (
    <div className="flex flex-col gap-4 mt-10 mb-10 items-center">
      {bottomMenuLinks.map((link, index) => (
        <SingleLink key={index} {...link} isExpanded={isExpanded} />
      ))}
    </div>
  );
}

function SingleLink({
  href,
  label,
  isExpanded,
  badge,
  icon,
}: {
  href: string;
  label: string;
  isExpanded: boolean;
  badge?: string;
  icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
}) {
  const pathname = usePathname();
  const className = cn(
    'text-white relative inline-flex w-[unset] items-center gap-2.5 rounded-md p-3 px-2',
    pathname === href && 'text-white bg-[#8748FF]',
    isExpanded && 'w-full'
  );
  const textElement = (
    <>
      <span className={cn('w-[100px] whitespace-nowrap duration-500 overflow-hidden inline-flex', !isExpanded && 'w-0')}>{label} </span>
      {isExpanded && badge && <span className="absolute right-1 top-2.5 text-[9px] bg-[#8748FF] px-1 pt-0.5 rounded">{badge}</span>}
    </>
  );

  const DynamicIcon = icon;

  return (
    <span className={cn('duration-500', isExpanded && 'w-full')}>
      {' '}
      <Link href={href} className={className}>
        <DynamicIcon className={cn('size-6 relative', !isExpanded && '-right-1.5')} />
        {textElement}
      </Link>
    </span>
  );
}
