import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const capitalize = (name: string) => {
  if (!name) return "";
  return name
    .trim()
    .split(" ")
    .map((part) => capitalizeFirst(part))
    .join(" ");
};

export const capitalizeFirst = (text: string) => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const formatNameLastCommaFirstInitial = (
  firstname: string,
  lastname: string
) => {
  if (!firstname || !lastname) return "";

  const firstInitial = firstname.trim().charAt(0).toUpperCase();
  const formattedLast = lastname.trim().charAt(0).toUpperCase() + lastname.trim().slice(1).toLowerCase();

  return `${formattedLast}, ${firstInitial}.`;
};
