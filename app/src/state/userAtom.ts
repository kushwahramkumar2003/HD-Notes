import { atom } from 'recoil';

export interface User {
  id: string;
  name: string;
  email: string;
  dob?: string | Date;
}

export const userState = atom<User | null>({
  key: 'userState',
  default: null,
});