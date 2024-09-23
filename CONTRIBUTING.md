---

## Contributing to `ux-testing-lab`

This document provides a step-by-step guide to setting up your development environment for working on the modified ux-testing-lab project.

### Overview

This project is a fork of [Mr.Theara’s project](https://github.com/Thearakim/ux-testing-lab), with the goal of modularizing the functions from `script.js`. The modules are written using ES modules, which aren't natively supported in the Figma plugin environment. To overcome this, we use a bundler to package the modules into a single file. For this project, we use **Webpack**. Here’s how to set up your development environment:

### Setting Up Webpack

1. **Install Webpack**:

   First, install Webpack and its CLI tool:

   ```bash
   npm install --save-dev webpack webpack-cli
   ```

2. **Install the Clean Webpack Plugin**:

   To ensure that the `dist/` folder is automatically cleaned before each build, install the `clean-webpack-plugin`:

   ```bash
   npm install clean-webpack-plugin --save-dev
   ```

3. **Create a Webpack Configuration File (`webpack.config.js`)**:

   Create a file named `webpack.config.js` in the root of your project with the following content:

   ```js
   const path = require('path');
   const { CleanWebpackPlugin } = require('clean-webpack-plugin');

   module.exports = {
     mode: 'production', // Use 'development' for development builds
     entry: './modules/main.js', // Entry point for your main JS file
     output: {
       filename: 'main.js', // Output bundle file in the `dist/` directory
       path: path.resolve(__dirname, 'dist'), // Output directory
     },
     plugins: [
       new CleanWebpackPlugin(), // Automatically clean the dist folder before each build
     ],
     module: {
       rules: [
         {
           test: /\.js$/, // Process all .js files
           exclude: /node_modules/, // Exclude node_modules
         },
       ],
     },
   };
   ```

4. **Build the Plugin**:

   Run the following command to bundle your modules and create the output file:

   ```bash
   npx webpack --config webpack.config.js
   ```

This will generate the bundled file in the `dist/` directory, ready to be used in the Figma plugin environment.

### Additional Information

- **ES Modules**: As Figma plugins don't support ES modules natively, Webpack (or another bundler) is necessary to package the modules into a format that Figma can use.
- **Contribution Guidelines**: If you have any questions or need further assistance, please reach out through the project's issue tracker or contact the maintainers directly.

Thank you for contributing!

---