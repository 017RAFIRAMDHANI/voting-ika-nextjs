import { neon } from "@neondatabase/serverless";
import type { AdminStats, AdminUserRecord, Candidate, UserRole, VoterRecord } from "@/lib/types";

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL belum dikonfigurasi.");
  }
  return neon(databaseUrl);
}

export async function findUserByLogin(userId: string) {
  const sql = getSql();
  const rows = await sql`
    SELECT
      id::int AS id,
      user_id AS "userId",
      password_hash AS "passwordHash",
      display_name AS "displayName",
      role,
      has_voted AS "hasVoted"
    FROM users
    WHERE user_id = ${userId}
    LIMIT 1
  `;
  return (rows[0] ?? null) as
    | {
        id: number;
        userId: string;
        passwordHash: string;
        displayName: string;
        role: "Mahasiswa" | "Admin" | "Super Administrator";
        hasVoted: boolean;
      }
    | null;
}

export async function findSessionUser(id: number) {
  const sql = getSql();
  const rows = await sql`
    SELECT
      id::int AS id,
      user_id AS "userId",
      display_name AS "displayName",
      role,
      has_voted AS "hasVoted"
    FROM users
    WHERE id = ${id}
    LIMIT 1
  `;
  return (rows[0] ?? null) as
    | {
        id: number;
        userId: string;
        displayName: string;
        role: "Mahasiswa" | "Admin" | "Super Administrator";
        hasVoted: boolean;
      }
    | null;
}

export async function upgradeLegacyPassword(id: number, passwordHash: string) {
  const sql = getSql();
  await sql`
    UPDATE users
    SET password_hash = ${passwordHash}, updated_at = NOW()
    WHERE id = ${id}
  `;
}

export async function getCandidates(): Promise<Candidate[]> {
  const sql = getSql();
  const rows = await sql`
    SELECT
      id,
      name,
      vision,
      mission,
      featured_program AS "featuredProgram",
      image,
      occupation,
      cohort,
      votes
    FROM candidates
    ORDER BY id ASC
  `;
  return rows as Candidate[];
}

export async function castVote(userId: number, candidateId: number) {
  const sql = getSql();
  const rows = await sql`
    WITH candidate_exists AS (
      SELECT id FROM candidates WHERE id = ${candidateId}
    ), updated_user AS (
      UPDATE users
      SET has_voted = TRUE, updated_at = NOW()
      WHERE id = ${userId}
        AND has_voted = FALSE
        AND EXISTS (SELECT 1 FROM candidate_exists)
      RETURNING id
    ), new_voter AS (
      INSERT INTO voters (user_id, candidate_id)
      SELECT id, ${candidateId}
      FROM updated_user
      RETURNING id
    )
    UPDATE candidates
    SET votes = votes + 1, updated_at = NOW()
    WHERE id = ${candidateId} AND EXISTS (SELECT 1 FROM new_voter)
    RETURNING id
  `;
  return rows as Candidate[];
}

export async function getVoters(search = ""): Promise<VoterRecord[]> {
  const sql = getSql();
  const query = `%${search.trim()}%`;
  const rows = await sql`
    SELECT
      u.id,
      u.id::int AS "userRecordId",
      u.user_id AS "userId",
      u.display_name AS "displayName",
      u.has_voted AS "hasVoted",
      c.name AS "candidateName"
    FROM users u
    LEFT JOIN voters v ON v.user_id = u.id
    LEFT JOIN candidates c ON c.id = v.candidate_id
    WHERE (${search.trim() === ""}
       OR u.user_id ILIKE ${query}
       OR c.name ILIKE ${query}
       OR u.display_name ILIKE ${query})
    ORDER BY u.created_at ASC
  `;
  return rows as VoterRecord[];
}

export async function getVoter(id: number) {
  const sql = getSql();
  const rows = await sql`
    SELECT
      u.id,
      u.id::int AS "userRecordId",
      u.user_id AS "userId",
      u.display_name AS "displayName",
      u.has_voted AS "hasVoted",
      c.name AS "candidateName"
    FROM users u
    LEFT JOIN voters v ON v.user_id = u.id
    LEFT JOIN candidates c ON c.id = v.candidate_id
    WHERE u.id = ${id}
    LIMIT 1
  `;
  return (rows[0] ?? null) as VoterRecord | null;
}

export async function importUsers(
  users: Array<{ userId: string; displayName: string; passwordHash: string }>
) {
  const sql = getSql();
  const payload = JSON.stringify(
    users.map((user) => ({
      user_id: user.userId,
      display_name: user.displayName,
      password_hash: user.passwordHash
    }))
  );
  const rows = await sql`
    WITH imported AS (
      SELECT *
      FROM jsonb_to_recordset(${payload}::jsonb) AS source(
        user_id TEXT,
        display_name TEXT,
        password_hash TEXT
      )
    ), saved AS (
      INSERT INTO users (user_id, display_name, password_hash, role, has_voted)
      SELECT user_id, display_name, password_hash, 'Mahasiswa', FALSE
      FROM imported
      ON CONFLICT (user_id) DO UPDATE SET
        display_name = EXCLUDED.display_name,
        password_hash = EXCLUDED.password_hash,
        updated_at = NOW()
      RETURNING id
    )
    SELECT COUNT(*)::int AS count FROM saved
  `;
  return Number(rows[0]?.count ?? 0);
}

export async function createCandidate(data: Omit<Candidate, "id" | "votes">) {
  const sql = getSql();
  const rows = await sql`
    INSERT INTO candidates (
      name, vision, mission, featured_program, image, occupation, cohort, votes
    ) VALUES (
      ${data.name}, ${data.vision}, ${data.mission}, ${data.featuredProgram},
      ${data.image}, ${data.occupation}, ${data.cohort}, 0
    )
    RETURNING id
  `;
  return rows[0] as { id: number };
}

export async function getAdminStats(): Promise<AdminStats> {
  const sql = getSql();
  const rows = await sql`
    SELECT
      (SELECT COUNT(*)::int FROM users) AS users,
      (SELECT COUNT(*)::int FROM users WHERE role = 'Mahasiswa') AS voters,
      (SELECT COUNT(*)::int FROM users WHERE has_voted = TRUE) AS voted,
      (SELECT COUNT(*)::int FROM candidates) AS candidates,
      (SELECT COALESCE(SUM(votes), 0)::int FROM candidates) AS "totalVotes"
  `;
  return rows[0] as AdminStats;
}

export async function getAdminUsers(): Promise<AdminUserRecord[]> {
  const sql = getSql();
  const rows = await sql`
    SELECT
      u.id::int AS id,
      u.user_id AS "userId",
      u.display_name AS "displayName",
      u.role,
      u.has_voted AS "hasVoted"
    FROM users u
    ORDER BY u.created_at ASC
  `;
  return rows as AdminUserRecord[];
}

export async function createAdminUser(data: {
  userId: string;
  displayName: string;
  role: UserRole;
  passwordHash: string;
}) {
  const sql = getSql();
  const rows = await sql`
    INSERT INTO users (user_id, display_name, role, password_hash, has_voted)
    VALUES (${data.userId}, ${data.displayName}, ${data.role}, ${data.passwordHash}, FALSE)
    RETURNING id::int AS id
  `;
  return rows[0] as { id: number };
}

export async function updateAdminUser(
  id: number,
  data: { userId: string; displayName: string; role: UserRole; passwordHash: string | null }
) {
  const sql = getSql();
  const rows = await sql`
    UPDATE users
    SET
      user_id = ${data.userId},
      display_name = ${data.displayName},
      role = ${data.role},
      password_hash = COALESCE(${data.passwordHash}, password_hash),
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING id
  `;
  return rows.length === 1;
}

export async function deleteAdminUser(id: number) {
  const sql = getSql();
  const rows = await sql`
    WITH previous AS (
      SELECT u.id, u.has_voted, v.candidate_id
      FROM users u
      LEFT JOIN voters v ON v.user_id = u.id
      WHERE u.id = ${id}
    ), removed_user AS (
      DELETE FROM users WHERE id = (SELECT id FROM previous)
      RETURNING id
    ), reduced AS (
      UPDATE candidates
      SET votes = GREATEST(votes - 1, 0), updated_at = NOW()
      WHERE id = (SELECT candidate_id FROM previous)
        AND (SELECT has_voted FROM previous) = TRUE
      RETURNING id
    )
    SELECT COUNT(*)::int AS count FROM removed_user
  `;
  return Number(rows[0]?.count ?? 0) === 1;
}

export async function resetUserVote(id: number) {
  const sql = getSql();
  const rows = await sql`
    WITH previous AS (
      SELECT u.id, v.candidate_id
      FROM users u
      JOIN voters v ON v.user_id = u.id
      WHERE u.id = ${id} AND u.has_voted = TRUE
      FOR UPDATE OF u, v
    ), reset_user AS (
      UPDATE users
      SET has_voted = FALSE, updated_at = NOW()
      WHERE id = (SELECT id FROM previous)
      RETURNING id
    ), reset_voter AS (
      DELETE FROM voters
      WHERE user_id = (SELECT id FROM previous)
      RETURNING id
    ), reduced AS (
      UPDATE candidates
      SET votes = GREATEST(votes - 1, 0), updated_at = NOW()
      WHERE id = (SELECT candidate_id FROM previous)
      RETURNING id
    )
    SELECT COUNT(*)::int AS count FROM reset_user
  `;
  return Number(rows[0]?.count ?? 0) === 1;
}

export async function updateCandidate(
  id: number,
  data: Omit<Candidate, "id" | "votes" | "image"> & { image: string | null }
) {
  const sql = getSql();
  const rows = await sql`
    UPDATE candidates
    SET
      name = ${data.name},
      vision = ${data.vision},
      mission = ${data.mission},
      featured_program = ${data.featuredProgram},
      image = COALESCE(${data.image}, image),
      occupation = ${data.occupation},
      cohort = ${data.cohort},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING id
  `;
  return rows.length === 1;
}

export async function deleteCandidate(id: number) {
  const sql = getSql();
  const rows = await sql`
    DELETE FROM candidates c
    WHERE c.id = ${id}
      AND c.votes = 0
      AND NOT EXISTS (SELECT 1 FROM voters v WHERE v.candidate_id = c.id)
    RETURNING id
  `;
  return rows.length === 1;
}
