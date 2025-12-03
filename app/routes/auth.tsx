import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import CyberpunkBg from '~/components/Cyberpunkbg';
import Navbar from '~/components/Navbar';
import { usePuterStore } from '~/lib/puter'

export const meta = () => ([
    {title: 'Resumind | Auth'},
    {name: 'description', content: 'Log into your account'},
]);

const auth = () => {
    const { isLoading, auth } = usePuterStore();
    const location = useLocation();
    const next = location.search.split('next=')[1];
    const navigate = useNavigate();

    useEffect(() => {
            if (auth.isAuthenticated) navigate(next);
        }, [auth.isAuthenticated, next]);

    return (
        <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Cyberpunk background */}
      <CyberpunkBg className="absolute inset-0 w-full h-full fixed" />

      {/* Navbar sits on top */}
      <Navbar />

      {/* Auth box */}
      <div className="gradient-border shadow-lg relative z-10">
        <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1>Welcome</h1>
            <h2>Log In To Continue Your Job Journey</h2>
          </div>
          <div>
            {isLoading ? (
              <button className="auth-button animate-pulse">
                <p>Signing in ...</p>
              </button>
            ) : (
              <>
                {auth.isAuthenticated ? (
                  <button className="auth-button" onClick={auth.signOut}>
                    <p>Log Out</p>
                  </button>
                ) : (
                  <button className="auth-button" onClick={auth.signIn}>
                    <p>Log In</p>
                  </button>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default auth;

// Provide a hydrate fallback while client-side modules initialize
export const hydrateFallback = (
  <main className="pt-16 p-4 container mx-auto">
    <h2>Loading authentication…</h2>
  </main>
);