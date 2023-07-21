import { wrapper } from "./package.js";
import path from "path";


let dir = "../../testinng-repos/space-tourism";
dir = path.resolve(dir);
wrapper(dir);