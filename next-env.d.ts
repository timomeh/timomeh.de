/// <reference types="next" />
/// <reference types="next/types/global" />

type ThenArg<T> = T extends PromiseLike<infer U> ? ThenArg<U> : T
type PageProps<T> = ThenArg<ReturnType<T>>['props']