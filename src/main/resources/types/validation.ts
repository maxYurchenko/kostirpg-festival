export interface Valid {
  error: boolean;
  message?: string;
  code?: number;
  data?: object;
}

export function instanceOfValid(object: any): object is Valid {
  return object.hasOwnProperty("error");
}
export function validationFailed(object: any): object is Valid {
  return object && object.error && object.error === true;
}
