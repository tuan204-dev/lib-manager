import { twMerge } from "tailwind-merge";
import classNames from "classnames";

export default function cn(...args: classNames.ArgumentArray) {
  return twMerge(classNames(...args));
}
