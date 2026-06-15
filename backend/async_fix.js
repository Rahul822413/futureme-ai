const fs = require('fs');
const path = require('path');

const dirs = [path.join(__dirname, 'controllers'), path.join(__dirname, 'middleware')];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.js')) {
      let filePath = path.join(dir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      
      let modified = content.replace(/const\s+(\w+)\s*=\s*\((req,\s*res.*?)\)\s*=>/g, (match, name, args) => {
          return `const ${name} = async (${args}) =>`;
      });
      
      modified = modified.replace(/exports\.(\w+)\s*=\s*\((req,\s*res.*?)\)\s*=>/g, (match, name, args) => {
          return `exports.${name} = async (${args}) =>`;
      });

      if (content !== modified) {
          fs.writeFileSync(filePath, modified, 'utf8');
          console.log(`Made async: ${path.basename(filePath)}`);
      }
    }
  });
});
