import type StudentInterface from './StudentInterface';

export default interface GroupInterface {
  id: number;
  name: string;
  students?: StudentInterface[];
}
