import { wrapper } from "./package.js";
import path from "path";


let dir = "../../testinng-repos/netflix-clone";
dir = path.resolve(dir);
wrapper(dir);