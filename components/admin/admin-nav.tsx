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
  FileText,
} from 'lucide-react';

export function AdminNav() {
  const pathname = usePathname();
  
  // Extract locale from pathname (e.g., /en/admin -> en)
  const locale = pathname?.split('/')[1] || 'en';
  
  const navigation = [
    { name: 'Dashboard', href: `/${locale}/admin`, icon: LayoutDashboard },
    { name: 'Leads', href: `/${locale}/admin/leads`, icon: UserPlus },
    { name: 'Students', href: `/${locale}/admin/students`, icon: Users },
    { name: 'Tasks', href: `/${locale}/admin/tasks`, icon: CheckSquare },
    { name: 'Appointments', href: `/${locale}/admin/appointments`, icon: Calendar },
    { name: 'CMS', href: `/${locale}/admin/cms`, icon: FileText },
  ];

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
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
