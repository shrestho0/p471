
import { BookOpenText, Contact2, Gauge, Palette } from 'lucide-svelte';

export const userPanelPages = [
    { title: 'Dashboard', icon: Gauge, href: 'dashboard' },
    { title: 'Pages', icon: BookOpenText, href: 'pages' },
    { title: 'Profile', icon: Contact2, href: 'profile' }
];

export const adminPanelPages = [
    { title: 'Dashboard', icon: Gauge, href: 'dashboard' },
    { title: 'Users', icon: Contact2, href: 'users' },
    { title: 'Pages', icon: BookOpenText, href: 'pages' },
]

export const customizationPages = [
    { title: 'Header', href: 'site-header' },
    { title: 'Footer', href: 'site-footer' },
    { title: 'Styling', href: 'site-styling' }
];