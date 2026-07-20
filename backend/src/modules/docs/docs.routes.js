import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Read and parse the YAML file
const fileContents = fs.readFileSync(path.join(__dirname, '../../../docs/openapi.yaml'), 'utf8');
const swaggerDocument = yaml.parse(fileContents);

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerDocument));

export default router;
