import * as fs from 'fs';
import * as path from 'path';

const directoryPath = path.join(__dirname, './schemas');
const filesInDirectory = fs.readdirSync(directoryPath);
const schemas = filesInDirectory
  .map((file) => path.join(directoryPath, file))
  .filter((file) => file.endsWith('.prisma'));

let schema = `datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
}

generator client {
    provider = "prisma-client-js"
    binaryTargets = ["native", "linux-musl-openssl-3.0.x"]
}\n`;

schema += schemas.reduce((currentSchema, filename) => {
  const partialSchama = fs.readFileSync(filename).toString();
  const cleanSchema = partialSchama.split(
    '// GENERATE-PRISMA-SCHEMA-DELETE //',
  )[0];
  return `${currentSchema}\n${cleanSchema}`;
}, '');

fs.writeFileSync(path.join(__dirname, './schema.prisma'), schema);
