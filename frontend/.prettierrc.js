/**
 * {@type require('prettier').Config}
 */
module.exports = {
  printWidth: 100,
  singleQuote: true,
  bracketSameLine: false,
  semi: false,
  quoteProps: 'consistent',
  importOrder: [
    // external packages
    '^(react/(.*)$)|^(react$)',
    '^(next/(.*)$)|^(next$)',
    '<THIRD_PARTY_MODULES>',
    '',
    // internal packages
    '^@/',
    '^~/',
    '^types$',
    '^@/types/(.*)$',
    '^@/config/(.*)$',
    '^@/lib/(.*)$',
    '^@/hooks/(.*)$',
    '^@/components/ui/(.*)$',
    '^@/components/(.*)$',
    '^@/styles/(.*)$',
    '^@/app/(.*)$',
    '',
    // relative
    '^[../]',
    '^[./]',
  ],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrderTypeScriptVersion: '4.4.0',
  plugins: ['@ianvs/prettier-plugin-sort-imports'],
}
