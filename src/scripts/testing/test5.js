import fs from "fs";
import path from "path";
import parser from "@babel/parser";
import _traverse from "@babel/traverse";
import postcss from "postcss";
import postcssImport from "postcss-import";
import postcssScss from "postcss-scss";
const traverse = _traverse.default;

const codebasePath = "../../../../testinng-repos/project_modern_ui_ux_gpt3/src";
// Replace with the path to your codebase directory

// Function to recursively search for files with a given extension in a directory
function findFiles(directory, extension) {
  const files = [];

  function traverse(dir) {
    const contents = fs.readdirSync(dir);

    for (const file of contents) {
      const filePath = path.join(dir, file);
      const fileStat = fs.statSync(filePath);

      if (fileStat.isDirectory()) {
        traverse(filePath);
      } else if (path.extname(file) === extension) {
        files.push(filePath);
      }
    }
  }

  traverse(directory);
  return files;
}

// Function to parse imports from a JavaScript/TypeScript file
function parseImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const ast = parser.parse(content, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  });

  const imports = [];

  // Traverse the AST to find import declarations
  traverse(ast, {
    ImportDeclaration(path) {
      const importPath = path.node.source.value;
      imports.push(importPath);
    },
  });

  return imports;
}

// Function to parse style imports from a CSS/SCSS file
async function parseStyleImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Create a new PostCSS instance with the postcss-import plugin
  const processor = postcss([postcssImport()]);

  const result = await processor.process(content, { from: filePath });
  const styleImports = result.messages
    .filter((msg) => msg.type === 'import')
    .map((msg) => msg.params);

  return styleImports;
}

// Get all JavaScript and TypeScript files
const scriptFiles = findFiles(codebasePath, '.js').concat(findFiles(codebasePath, '.ts'));

// Get all CSS and SCSS files
const styleFiles = findFiles(codebasePath, '.css').concat(findFiles(codebasePath, '.scss'));

// Map to store the imports
const importsMap = {
  scriptsToStyles: {},
  stylesToScripts: {},
  stylesToStyles: {},
  scriptsToScripts: {},
};

// Process script files
for (const scriptFile of scriptFiles) {
  const scriptFilePath = path.relative(codebasePath, scriptFile);

  // Parse imports from script file
  const scriptImports = parseImports(scriptFile);
  importsMap.scriptsToScripts[scriptFilePath] = scriptImports;

  // Process style imports from script file
  for (const styleFile of styleFiles) {
    const styleFilePath = path.relative(codebasePath, styleFile);
    const styleImports = await parseStyleImports(styleFile);

    if (styleImports.includes(scriptFilePath)) {
      if (!importsMap.stylesToScripts[styleFilePath]) {
        importsMap.stylesToScripts[styleFilePath] = [];
      }
      importsMap.stylesToScripts[styleFilePath].push(scriptFilePath);
    }
  }
}

// Process style files
for (const styleFile of styleFiles) {
  const styleFilePath = path.relative(codebasePath, styleFile);

  // Parse style imports from style file
  const styleImports = await parseStyleImports(styleFile);
  importsMap.stylesToStyles[styleFilePath] = styleImports;

  // Process script imports from style file
  for (const scriptFile of scriptFiles) {
    const scriptFilePath = path.relative(codebasePath, scriptFile);
    const scriptImports = parseImports(scriptFile);

    if (scriptImports.includes(styleFilePath)) {
      if (!importsMap.scriptsToStyles[scriptFilePath]) {
        importsMap.scriptsToStyles[scriptFilePath] = [];
      }
      importsMap.scriptsToStyles[scriptFilePath].push(styleFilePath);
    }
  }
}

console.log('Imports Map:');
console.log(importsMap);
