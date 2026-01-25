declare module 'next/font/google' {
  export interface FontOptions {
    weight?: string | string[]
    style?: string | string[]
    subsets?: string[]
    axes?: Array<{ axis: string; min?: number; max?: number }>
    display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional'
    preload?: boolean
    fallback?: string[]
    adjustFontFallback?: boolean | string
    variable?: string
    declarations?: Array<{ [key: string]: string | number }>
  }

  export interface Font {
    className: string
    style: { [key: string]: string }
    variable: string
  }

  export function Geist(options?: FontOptions): Font
  export function Geist_Mono(options?: FontOptions): Font
  export function Inter(options?: FontOptions): Font
  export function Roboto(options?: FontOptions): Font
  export function Poppins(options?: FontOptions): Font
  export function Open_Sans(options?: FontOptions): Font
  export function Raleway(options?: FontOptions): Font
  export function Montserrat(options?: FontOptions): Font
  export function Lato(options?: FontOptions): Font
  export function Merriweather(options?: FontOptions): Font
  
  // Add other Google fonts as needed
}
