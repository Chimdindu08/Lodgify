export type User = { id: string; fullName: string; email: string; level: string; createdAt?: string };
export type AuthResponse = { token: string; user: User };

export type Ratings = {
  security: number;
  water: number;
  electricity: number;
  cleanliness: number;
  management: number;
  value: number;
};

export type Lodge = {
  id: string;
  name: string;
  area: string;
  address: string;
  distance: string;
  roomType: string;
  annualRent: number;
  waterSupply: string;
  powerSupply: string;
  security: string;
  academicSession: string;
  reviewText: string;
  ratings: Ratings;
  overallRating: number;
  photos: string[];
  author: { name: string; level: string };
  createdAt: string;
};

export type LodgeList = { items: Lodge[]; total: number };
