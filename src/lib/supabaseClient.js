import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ SUPABASE CONFIGURATION ERROR ❌');
    console.error('Missing environment variables:');
    if (!supabaseUrl) console.error('  - VITE_SUPABASE_URL is not defined');
    if (!supabaseAnonKey) console.error('  - VITE_SUPABASE_ANON_KEY is not defined');
    console.error('Please add these to your Vercel Environment Variables.');

    // Create a fallback mock client that will throw helpful errors
    const errorMessage = 'Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel Environment Variables.';

    // Display visual error to user
    if (typeof document !== 'undefined') {
        setTimeout(() => {
            const errorDiv = document.createElement('div');
            errorDiv.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(239, 68, 68, 0.95);
                color: white;
                padding: 2rem;
                border-radius: 1rem;
                max-width: 500px;
                z-index: 99999;
                text-align: center;
                font-family: system-ui, -apple-system, sans-serif;
                box-shadow: 0 10px 40px rgba(0,0,0,0.5);
            `;
            errorDiv.innerHTML = `
                <h2 style="margin-top: 0; font-size: 1.5rem;">⚠️ Configuration Error</h2>
                <p style="margin: 1rem 0;">Supabase environment variables are missing.</p>
                <p style="font-size: 0.9rem; opacity: 0.9;">Please set <code style="background: rgba(0,0,0,0.3); padding: 0.2rem 0.5rem; border-radius: 0.25rem;">VITE_SUPABASE_URL</code> and <code style="background: rgba(0,0,0,0.3); padding: 0.2rem 0.5rem; border-radius: 0.25rem;">VITE_SUPABASE_ANON_KEY</code> in your Vercel Project Settings.</p>
                <button onclick="window.location.reload()" style="margin-top: 1rem; padding: 0.5rem 1.5rem; background: white; color: #ef4444; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: bold;">Reload Page</button>
            `;
            document.body.appendChild(errorDiv);
        }, 1000);
    }
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder-key');
