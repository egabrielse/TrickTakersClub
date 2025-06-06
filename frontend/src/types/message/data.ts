export type MessageData<T> = T extends { data: infer U } ? U : never;

export type MessagePayload<T> = T extends { payload: infer U } ? U : never;
