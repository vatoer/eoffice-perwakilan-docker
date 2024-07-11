export type FieldErrors<T> = {
  [K in keyof T]?: string[];
};

export type ActionState<Tinput, Toutput> = {
  fieldErrors?: FieldErrors<Tinput>;
  error?: any | null;
  data?: Toutput;
};

export const createAction = <Tinput, Toutput>(
  handler: (input: Tinput) => Promise<ActionState<Tinput, Toutput>>
) => {
  return async (input: Tinput): Promise<ActionState<Tinput, Toutput>> => {
    const state = await handler(input);
    return state;
  };
};
