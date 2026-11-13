import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const destination = path.resolve(process.argv[2] || path.join(root, "backups", new Date().toISOString().replace(/[:.]/g, "-")));
if (fs.existsSync(destination)) throw new Error("Le dossier de destination existe déjà.");
const source = path.join(root, "data");
if (destination.startsWith(source + path.sep)) throw new Error("Choisissez un dossier extérieur à data.");
fs.mkdirSync(destination, { recursive: true });
fs.cpSync(source, path.join(destination, "data"), { recursive: true, filter: entry => !entry.endsWith(".lock") && !entry.endsWith(".tmp") });
console.log("Sauvegarde créée dans " + destination);
