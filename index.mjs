import { config } from "dotenv";
import { main } from "./dist/index.js";

config();
await main();
