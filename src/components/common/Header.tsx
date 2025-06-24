'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useEffect } from 'react';

export default function Header() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin');
        }
    }, [status, router]);

    if (status === 'loading' || status === 'unauthenticated') {
        return null;
    }

    const username = session?.user?.name?.split(' ')[0] || 'User';

    return (
       <header className=" sticky  px-6 py-4 flex items-center justify-between z-10 relative">
            <h1 className="text-xl font-semibold text-gray-800">
                {username}&apos;s Todos
            </h1>
            <button
                onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                className="flex items-center cursor-pointer space-x-2 text-red-600 hover:text-red-700 font-medium"
            >
                <LogOut className="w-5 h-5 z-[1000]" />
                <span>Logout</span>
            </button>
        </header>
    );
}
