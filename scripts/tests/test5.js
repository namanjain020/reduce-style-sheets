import { Project } from "ts-morph";

const project = new Project();
const dir = "../../../../testinng-repos/space-tourism/src/App.js";


const sourceFile = project.addSourceFileAtPath(dir);
const importDeclaration = sourceFile.addImportDeclaration({
    defaultImport: "MyClass",
    moduleSpecifier: "./file",
  });
// const imports = sourceFile.getImportDeclarations();
const moduleSpecifierValue = importDeclaration.getModuleSpecifierValue();
console.log(moduleSpecifierValue)