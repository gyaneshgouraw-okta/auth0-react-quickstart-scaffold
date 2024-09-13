#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const cli = require('cac')()
const prompts = require('prompts');

async function main() {
  try {
    const projectDetails = await getProjectDetails();
    console.log("[details]1", projectDetails)
    const { name, domain, clientId } = projectDetails;
    const targetDir = path.join(process.cwd(), projectDetails.name);
    fs.mkdirSync(targetDir);

    const templateDir = path.join(__dirname, 'templates');
    copyTemplateFiles(templateDir, targetDir, name, domain, clientId);

    console.log(`Boilerplate project created successfully in ${targetDir}`);
  } catch (err) {
    console.error('Error creating boilerplate:', err);
  }
}

function copyTemplateFiles(source, destination, projectName, domain, clientId) {
  // console.log("[details]2", projectName, domain, clientId)
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  fs.readdirSync(source).forEach(file => {
    const sourcePath = path.join(source, file);
    const destPath = path.join(destination, file);

    if (fs.statSync(sourcePath).isDirectory()) {
      // Recursively handle directories
      copyTemplateFiles(sourcePath, destPath, projectName, domain, clientId);
    } else {
      // Handle file copying and replacement
      let content = fs.readFileSync(sourcePath, 'utf8');
      content = content.replace(/{DOMAIN}/g, domain);
      content = content.replace(/{CLIENT_ID}/g, clientId);
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
  const response = await prompts([{
    type: 'text',
    name: 'name',
    message: 'What should be your project name?',
  },
  {
    type: 'text',
    name: 'domain',
    message: 'What is your domain name?',
  },
  {
    type: 'text',
    name: 'clientId',
    message: 'What is your client name?',
  }]
  );
  return response
}

async function getProjectDetails() {
  const cliArgument = getCliArguments();
  if (cliArgument) {
    return cliArgument;
  } else {
    const response = await getUserPrompts();
    return response;
  }
}

main();


