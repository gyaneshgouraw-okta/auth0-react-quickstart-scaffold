#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const cli = require('cac')()
const prompts = require('prompts');

async function main() {
  try {
    const projectName = await getProjectName();
    const targetDir = path.join(process.cwd(), projectName);
    fs.mkdirSync(targetDir);

    const templateDir = path.join(__dirname, 'templates');
    copyTemplateFiles(templateDir, targetDir, projectName);

    console.log(`Boilerplate project created successfully in ${targetDir}`);
  } catch (err) {
    console.error('Error creating boilerplate:', err);
  }
}

function copyTemplateFiles(source, destination, projectName) {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  fs.readdirSync(source).forEach(file => {
    const sourcePath = path.join(source, file);
    const destPath = path.join(destination, file);

    if (fs.statSync(sourcePath).isDirectory()) {
      // Recursively handle directories
      copyTemplateFiles(sourcePath, destPath, projectName);
    } else {
      // Handle file copying and replacement
      let content = fs.readFileSync(sourcePath, 'utf8');
      content = content.replace(/{{ projectName }}/g, projectName);
      fs.writeFileSync(destPath, content, 'utf8');
    }
  });
}


function getCliArguments() {
  cli.option('--name <name>', 'Provide your name')
  const parsed = cli.parse()
  const projectName = parsed.args[0]
  return projectName;
}

async function getUserPrompts() {
  const response = await prompts({
    type: 'text',
    name: 'value',
    message: 'What should be your project name?',
  });
  return response
}

async function getProjectName() {
  const cliArgument = getCliArguments();
  if (cliArgument) {
    return cliArgument;
  } else {
    const response = await getUserPrompts();
    return response.value;;
  }
}

main();


