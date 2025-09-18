// lib/types.ts

// Define and export the possible status types as a distinct type
export type Status = 'Pending review' | 'Needs changes';

// Define and export the type for a single activity item
export interface Activity {
  id: number;
  user: {
    name: string;
    initials: string;
    avatarUrl?: string;
  };
  action: string;
  target?: string;
  status?: Status; // Use the exported Status type here
  timestamp: string;
}
