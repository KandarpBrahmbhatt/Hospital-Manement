declare module "cors" {
  import type { RequestHandler } from "express";

  interface CorsOptions {
    origin?: boolean | string | RegExp | Array<string | RegExp>;
    credentials?: boolean;
  }

  function cors(options?: CorsOptions): RequestHandler;

  export default cors;
}
