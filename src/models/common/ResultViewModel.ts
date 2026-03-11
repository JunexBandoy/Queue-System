export interface ResultViewModel {
  isSuccess: boolean;
  errorMessages?: string[];
}

export const successResult: ResultViewModel = {
  isSuccess: true,
  errorMessages: [],
};

export const failureResult: ResultViewModel = {
  isSuccess: false,
  errorMessages: ['An error occurred'],
};
