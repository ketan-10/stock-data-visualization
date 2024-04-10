import { twMerge } from 'tailwind-merge'

function cx(...args: ClassArray[]) {
  return args
    .flat()
    .filter((x) => typeof x === 'string')
    .join(' ')
    .trim()
}

export type ClassValue =
  | ClassArray
  | Record<string, any>
  | string
  | number
  | null
  | boolean
  | undefined
export type ClassArray = ClassValue[]

export function cn(...inputs: ClassArray) {
  return twMerge(cx(inputs))
}

export type ChartResponse = {
    time: number
    low: number
    open: number
    close: number
  }
  