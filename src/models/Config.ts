export type Config = {
  APIBaseUrl: string;
  ReportsBaseUrl: string;
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
  };
  appEnv: string;
  build: string;
};
