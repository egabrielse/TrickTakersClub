export type MessageData<T> = T extends { data: infer U } ? U : never;
