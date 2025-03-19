import * as fs from 'fs';

export const loadJsonFile = function (pathToFile: string): JSON {
  const file = fs.readFileSync(`${pathToFile}.json`, 'utf-8');
  return JSON.parse(file);
};
