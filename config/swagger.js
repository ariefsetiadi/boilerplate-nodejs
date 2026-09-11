const fs = require('fs');
const path = require('path');
const YAML = require('yaml');
const swaggerUi = require('swagger-ui-express');

const filePath = path.join(__dirname, '../docs/openapi.yaml');
const file = fs.readFileSync(filePath, 'utf8');
const swaggerDocument = YAML.parse(file);

module.exports = {
  swaggerUi,
  swaggerDocument,
}
