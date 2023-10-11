import { isIPv4, isIPv6 } from "node:net";
import { FormatRegistry } from "@sinclair/typebox";

FormatRegistry.Set("ipv4", isIPv4);
FormatRegistry.Set("ipv6", isIPv6);
