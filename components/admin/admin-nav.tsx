/**
 * Admin Navigation Component
 * Sprint 05: Admin Dashboard
 * Sidebar navigation for admin dashboard
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  CheckSquare, 
  Calendar,
  Settings,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Leads', href: '/admin/leads', icon: UserPlus },
  { name: 'Students', href: '/admin/students', icon: Users },
  { name: 'Tasks', href: '/admin/tasks', icon: CheckSquare },
  { name: 'Appointments', href: '/admin/appointments', icon: Calendar },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {navigation.map((item) => {
        const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
        const Icon = item.icon;

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`
              flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
              ${isActive 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }
            `}
          >
            <Icon className="h-5 w-5" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
