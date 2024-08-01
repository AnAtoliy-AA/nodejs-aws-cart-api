const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

// Define paths
const distPath = path.resolve(__dirname, 'dist');
const nodeModulesPath = path.resolve(__dirname, 'node_modules');
const outputZipPath = path.resolve(__dirname, 'myLambdaArchive.zip');

// Create a file to stream archive data to
const output = fs.createWriteStream(outputZipPath);

// Initialize archiver with zip format and compression level
const archive = archiver('zip', {
  zlib: { level: 9 },
});

// Listen for all archive data to be written
output.on('close', () => {
  console.log(`Successfully created ZIP archive at ${outputZipPath}`);
});

// Handle any archive errors
archive.on('error', (err) => {
  throw err;
});

// Pipe archive data to the file
archive.pipe(output);

// Append directories to the archive
archive.directory(distPath, false);
archive.directory(nodeModulesPath, 'node_modules');

// Finalize the archive (no more files to append)
archive.finalize();
