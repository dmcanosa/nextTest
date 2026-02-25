/**
 * Supabase Authentication Service Layer
 * Centralizes all auth-related Supabase operations to prevent scattered DB calls
 */

import { createClient } from './server';

export interface SignUpData {
  email: string;
  password: string;
  name: string;
}

export interface SignInData {
  email: string;
  password: string;
}

/**
 * Register a new user with Supabase Auth and create user profile
 * Passwords are never stored in the user table - only managed by Supabase Auth
 */
export async function signUpUser(data: SignUpData) {
  const supabase = await createClient();

  try {
    // Create auth user
    const authRes = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (authRes.error) {
      throw new Error(`Auth signup failed: ${authRes.error.message}`);
    }

    if (!authRes.data.user?.id) {
      throw new Error('No user ID returned from signup');
    }

    // Create user profile (without password)
    const profileRes = await supabase.from('users').insert({
      id: authRes.data.user.id,
      name: data.name,
      email: data.email,
    });

    if (profileRes.error) {
      throw new Error(`User profile creation failed: ${profileRes.error.message}`);
    }

    return { success: true, userId: authRes.data.user.id };
  } catch (error) {
    throw error;
  }
}

/**
 * Sign in user with email and password
 */
export async function signInUser(data: SignInData) {
  const supabase = await createClient();

  try {
    const res = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (res.error) {
      throw new Error(`Sign in failed: ${res.error.message}`);
    }

    return { success: true, user: res.data.user };
  } catch (error) {
    throw error;
  }
}

/**
 * Sign out current user
 */
export async function signOutUser() {
  const supabase = await createClient();

  try {
    const res = await supabase.auth.signOut();

    if (res.error) {
      throw new Error(`Sign out failed: ${res.error.message}`);
    }

    return { success: true };
  } catch (error) {
    throw error;
  }
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser() {
  const supabase = await createClient();

  try {
    const res = await supabase.auth.getUser();

    if (res.error) {
      throw new Error(`Failed to get user: ${res.error.message}`);
    }

    return res.data.user;
  } catch (error) {
    throw error;
  }
}

/**
 * Get current user ID
 */
export async function getCurrentUserId(): Promise<string> {
  const user = await getCurrentUser();
  if (!user?.id) {
    throw new Error('No authenticated user found');
  }
  return user.id;
}
