import { nanoid } from "nanoid";

export const GenerateUniqueId = () => {
  // return nanoid(5);
  return nanoid(6).toUpperCase();
};
