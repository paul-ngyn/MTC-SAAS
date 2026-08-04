// lib/google-auth.ts – Google sign-in via Supabase OAuth + an in-app browser session
//
// Supabase has no native Google SDK integration here — instead we open its
// hosted Google OAuth URL in an auth browser session and capture the
// access/refresh tokens Supabase appends to the redirect back into the app
// (registered via the "mtcsupply" scheme, see app.json).

import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { supabase } from './supabase';

export async function signInWithGoogle(): Promise<boolean> {
  const redirectTo = Linking.createURL('auth/callback');

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      skipBrowserRedirect: true,
    },
  });
  if (error) throw error;
  if (!data?.url) throw new Error('Supabase did not return a Google auth URL.');

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  if (result.type !== 'success' || !result.url) {
    return false; // user cancelled or dismissed the browser
  }

  const { accessToken, refreshToken } = parseTokensFromUrl(result.url);
  if (!accessToken || !refreshToken) {
    throw new Error('Google sign-in did not return a valid session.');
  }

  const { error: sessionError } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
  if (sessionError) throw sessionError;

  return true;
}

function parseTokensFromUrl(url: string) {
  // Supabase appends tokens after a "#" fragment, e.g. mtcsupply://auth/callback#access_token=...&refresh_token=...
  const fragment = url.split('#')[1] ?? url.split('?')[1] ?? '';
  const params = new URLSearchParams(fragment);
  return {
    accessToken: params.get('access_token') ?? undefined,
    refreshToken: params.get('refresh_token') ?? undefined,
  };
}
