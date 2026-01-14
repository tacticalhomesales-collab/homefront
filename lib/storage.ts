/**
 * Simple storage abstraction
 * In-memory storage for MVP - easy to swap for PostgreSQL, MongoDB, etc.
 */

export type Partner = {
  id: string;
  public_code: string;
  first_name: string;
  last_name: string;
  contact: string; // email or phone
  portal_token_hash: string;
  created_at: string;
};

export type Referral = {
  id: string;
  partner_id: string | null; // null if not from partner
  friend_name: string;
  friend_phone: string;
  friend_email?: string;
  friend_location?: string;
  friend_timeline?: string;
  friend_mission?: string;
  referrer_name: string;
  referrer_phone?: string;
  referrer_email?: string;
  created_at: string;
  status: "pending" | "contacted" | "converted" | "closed";
};

// In-memory storage (replace with actual DB in production)
const partners = new Map<string, Partner>();
const referrals = new Map<string, Referral>();
const publicCodeIndex = new Map<string, string>(); // public_code -> partner_id
const tokenHashIndex = new Map<string, string>(); // token_hash -> partner_id

export const storage = {
  // Partner operations
  async createPartner(partner: Partner): Promise<Partner> {
    partners.set(partner.id, partner);
    publicCodeIndex.set(partner.public_code, partner.id);
    tokenHashIndex.set(partner.portal_token_hash, partner.id);
    return partner;
  },

  async getPartnerById(id: string): Promise<Partner | null> {
    return partners.get(id) || null;
  },

  async getPartnerByPublicCode(publicCode: string): Promise<Partner | null> {
    const partnerId = publicCodeIndex.get(publicCode);
    return partnerId ? partners.get(partnerId) || null : null;
  },

  async getPartnerByTokenHash(tokenHash: string): Promise<Partner | null> {
    const partnerId = tokenHashIndex.get(tokenHash);
    return partnerId ? partners.get(partnerId) || null : null;
  },

  async getAllPartners(): Promise<Partner[]> {
    return Array.from(partners.values());
  },

  // Referral operations
  async createReferral(referral: Referral): Promise<Referral> {
    referrals.set(referral.id, referral);
    return referral;
  },

  async getReferralById(id: string): Promise<Referral | null> {
    return referrals.get(id) || null;
  },

  async getReferralsByPartnerId(partnerId: string): Promise<Referral[]> {
    return Array.from(referrals.values()).filter(
      (r) => r.partner_id === partnerId
    );
  },

  async getAllReferrals(): Promise<Referral[]> {
    return Array.from(referrals.values());
  },

  async updateReferralStatus(
    id: string,
    status: Referral["status"]
  ): Promise<Referral | null> {
    const referral = referrals.get(id);
    if (!referral) return null;
    referral.status = status;
    referrals.set(id, referral);
    return referral;
  },
};

// TODO: Replace with actual database
// Example PostgreSQL implementation:
/*
import { Pool } from 'pg';
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const storage = {
  async createPartner(partner: Partner): Promise<Partner> {
    const result = await pool.query(
      `INSERT INTO partners (id, public_code, first_name, last_name, contact, portal_token_hash, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [partner.id, partner.public_code, partner.first_name, partner.last_name, partner.contact, partner.portal_token_hash, partner.created_at]
    );
    return result.rows[0];
  },
  // ... etc
};
*/
