/**
 * Signature Service
 * Centralizes signature-related database operations
 */

import { createClient } from './server';
import { AES, CBC, Pkcs7, PBKDF2, Utf8 } from 'crypto-es';

const secretSigKey = process.env.SECRET_SIGNATURE_KEY as string;
const saltKey = process.env.SECRET_SIGNATURE_KEY_SALT as string;
const iv = process.env.SECRET_SIGNATURE_KEY_IV as string;

// Initialize crypto keys
const salt = Utf8.parse(saltKey);
const key256 = PBKDF2(secretSigKey, salt, { keySize: 256 / 32 });
const iv_wa = Utf8.parse(iv);

export interface CreateSignatureData {
  canvasString: string;
  userId: string;
}

/**
 * Encrypt and store a signature
 */
export async function createSignature(data: CreateSignatureData) {
  const supabase = await createClient();

  try {
    // Encrypt signature data
    const encryptedSig = AES.encrypt(data.canvasString, key256, {
      iv: iv_wa,
      mode: CBC,
      padding: Pkcs7,
    }).toString();

    // Deactivate previous signatures
    const updateRes = await supabase
      .from('signatures')
      .update({ active: false })
      .eq('user_id', data.userId);

    if (updateRes.error) {
      throw new Error(`Failed to deactivate previous signatures: ${updateRes.error.message}`);
    }

    // Insert new signature
    const insertRes = await supabase.from('signatures').insert({
      data: encryptedSig,
      active: true,
      user_id: data.userId,
    });

    if (insertRes.error) {
      throw new Error(`Failed to create signature: ${insertRes.error.message}`);
    }

    return { success: true };
  } catch (error) {
    throw error;
  }
}

/**
 * Deactivate a signature
 */
export async function deactivateSignature(signatureId: string) {
  const supabase = await createClient();

  try {
    const res = await supabase
      .from('signatures')
      .update({ active: false })
      .eq('id', signatureId);

    if (res.error) {
      throw new Error(`Failed to deactivate signature: ${res.error.message}`);
    }

    return { success: true };
  } catch (error) {
    throw error;
  }
}

/**
 * Get active signature for user
 */
export async function getActiveSignature(userId: string) {
  const supabase = await createClient();

  try {
    const res = await supabase
      .from('signatures')
      .select('*')
      .eq('user_id', userId)
      .eq('active', true)
      .single();

    if (res.error && res.error.code !== 'PGRST116') {
      throw new Error(`Failed to fetch signature: ${res.error.message}`);
    }

    return res.data || null;
  } catch (error) {
    throw error;
  }
}
