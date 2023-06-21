import { config } from "dotenv";
import { v4 as uuid } from "uuid";
import { main } from "@cloudflare-ddns/app";

config();
const processId = uuid();
await main({ processId });
