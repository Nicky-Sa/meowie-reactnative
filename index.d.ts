import "axios";

declare module "*.jpg";
declare module "*.png";
declare module "*.svg";

declare module "axios" {
  export interface AxiosRequestConfig {
    _retry?: boolean;
  }
}
