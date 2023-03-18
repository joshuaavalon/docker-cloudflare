import { config } from "dotenv";
import { main } from "@cloudflare-ddns/app";

config();
await main();
