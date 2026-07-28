'use client';

import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const handleLogin = () => {
    signIn('github', { callbackUrl: '/admin/projects' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black p-4">
      <div className="w-full max-w-sm bg-white dark:bg-[#050505] p-8 rounded-[24px] border border-zinc-200 dark:border-white/10 shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-white">Admin Login</h2>
        <p className="text-zinc-500 text-sm mb-8">Sign in securely with your GitHub account</p>
        
        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 bg-zinc-900 dark:bg-white text-white dark:text-black py-3.5 rounded-xl font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.103-.253-.447-1.27.098-2.646 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.748-1.025 2.748-1.025.546 1.376.202 2.394.1 2.646.64.699 1.026 1.591 1.026 2.682 0 3.841-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
          </svg>
          Sign in with GitHub
        </button>
      </div>
    </div>
  );
}
