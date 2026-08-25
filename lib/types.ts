export type UserRole = "Alumni" | "Admin";

export type SessionUser = {
  id: number;
  userId: string;
  displayName: string;
  role: UserRole;
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
  candidateName: string | null;
};

export type AdminUserRecord = {
  id: number;
  userId: string;
  displayName: string;
  role: UserRole;
  hasVoted: boolean;
};

export type AdminStats = {
  users: number;
  voters: number;
  voted: number;
  candidates: number;
  totalVotes: number;
};
