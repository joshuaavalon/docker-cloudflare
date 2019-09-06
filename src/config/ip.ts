import { propEq } from "ramda";

export type IpJsonEcho = {
  type: "json";
  url: string;
  fields: string[];
};
export type IpTextEcho = {
  type: "text";
  url: string;
};

export type IpEcho = IpJsonEcho | IpTextEcho;
export const isIpJsonEcho = (ipEcho: IpEcho): ipEcho is IpJsonEcho =>
  propEq("type", "json", ipEcho);
