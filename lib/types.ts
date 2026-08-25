export type UserRole = "Mahasiswa" | "Admin" | "Super Administrator";

export type SessionUser = {
  id: number;
  userId: string;
  displayName: string;
  role: UserRole;
  voterId: number | null;
  hasVoted: boolean;
};

export type Candidate = {
  id: number;
  name: string;
  vision: string;
  mission: string;
  featuredProgram: string;
  image: string;
  occupation: string;
  cohort: string;
  votes: number;
};

export type VoterRecord = {
  id: number;
  userRecordId: number | null;
  userId: string | null;
  displayName: string | null;
  hasVoted: boolean | null;
  name: string;
  cohort: string;
  candidateName: string | null;
};

export type AdminUserRecord = {
  id: number;
  userId: string;
  displayName: string;
  role: UserRole;
  voterId: number | null;
  voterName: string | null;
  cohort: string | null;
  hasVoted: boolean;
};

export type AdminStats = {
  users: number;
  voters: number;
  voted: number;
  candidates: number;
  totalVotes: number;
};
