module.exports = {
  bracketSpacing: true,
  bracketSameLine: true,
  singleQuote: true,
  trailingComma: 'all',
  // A person has his limits, and 80 is not it.
  printWidth: 100,
  overrides: [
    {
      files: '*.js',
      options: {
        parser: 'babel',
      },
    },
  ],
  // Sort and group imports using the @serverless-guru/prettier-import-order plugin.
  importOrder: [
    // TYPE imports will be at the the top.
    '^react(-native)?$', // 1. React and react-native
    '<THIRD_PARTY_MODULES>', // 2. Third party modules (this is a plugin keyword)
    '', // use empty strings to separate groups with empty lines
    '^@gasbuddyapp/(.*)$', // 3. GasBuddy modules
    '', // use empty strings to separate groups with empty lines
    '^../(.*)$', // 4. Local imports in parent directories
    '^./(.*)$', // 4. Local imports in current directory
    '^..?/styles?$', // 5. Style imports from anywhere
  ],
  importOrderSeparation: false, // turn this on to see the sorting groups.
  importOrderTypeImportsToTop: true,
  importOrderSortIndividualImports: true,
  importOrderMergeDuplicateImports: true,
  importOrderSortIndividualImports: true,
  // End sort options
};