/** @type {import('prettier').Config} */
export default {
  plugins: ["@trivago/prettier-plugin-sort-imports"],
  importOrder: ["<THIRD_PARTY_MODULES>", "^@monorepo(.*)$", "^[./]"],
  importOrderParserPlugins: ["typescript", "jsx", "explicitResourceManagement"],
  importOrderSeparation: true,
};
