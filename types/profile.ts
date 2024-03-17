import { Gender } from './user';

export type UpdateProfileDto = {
  username: string;
  gender: Gender;
  phoneNumber: string;
};
