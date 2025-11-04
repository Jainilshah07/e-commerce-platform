import fs from "fs";
import path from "path";

export const moveFile = async (oldPath, newPath) => {
  await fs.promises.mkdir(path.dirname(newPath), { recursive: true });
  await fs.promises.rename(oldPath, newPath);
};
