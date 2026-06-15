const fs = require('fs');
const path = require('path');

const controllersDir = path.join(__dirname, 'controllers');
const middlewareDir = path.join(__dirname, 'middleware');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace db.prepare(SQL).method(ARGS)
    // We use a regex that handles balanced parentheses roughly or we can do a simpler match
    // Luckily, our codebase uses simple arguments for get/run/all
    
    // Pattern: db.prepare( ... ).get( ... )
    // Since SQL can contain backticks, we use [\s\S]*? to match lazily inside prepare()
    // We must be careful not to match too much. 
    // All our db.prepare calls end with ).get(...), ).run(...) or ).all(...)
    
    const regex = /db\.prepare\(([\s\S]*?)\)\.(get|run|all)\(([\s\S]*?)\)/g;
    
    let modified = content.replace(regex, (match, sql, method, args) => {
        if (args && args.trim().length > 0) {
            return `await db.${method}(${sql}, ${args})`;
        } else {
            return `await db.${method}(${sql})`;
        }
    });

    if (content !== modified) {
        fs.writeFileSync(filePath, modified, 'utf8');
        console.log(`Updated ${path.basename(filePath)}`);
    }
}

// Process controllers
fs.readdirSync(controllersDir).forEach(file => {
    if (file.endsWith('.js')) {
        processFile(path.join(controllersDir, file));
    }
});

// Process middleware
fs.readdirSync(middlewareDir).forEach(file => {
    if (file.endsWith('.js')) {
        processFile(path.join(middlewareDir, file));
    }
});

console.log('Migration complete.');
