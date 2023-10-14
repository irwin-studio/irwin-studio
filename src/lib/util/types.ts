export type PartialExcept<T, K extends keyof T> = Pick<T, K> & Partial<T>
export type PartialWithout<T, K extends keyof T> = Partial<Pick<T, K>>
export type RequiredKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? never : K }[keyof T];
export type OptionalKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? K : never }[keyof T];
