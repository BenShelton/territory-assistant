/**
 * @type { import('vls').VeturConfig }
 */
module.exports = {
  settings: {
    'vetur.useWorkspaceDependencies': true,
    'vetur.experimental.templateInterpolationService': true,
    'vetur.validation.template': false
  },
  projects: [
    {
      root: '.',
      package: './package.json',
      tsconfig: './tsconfig.json'
    }
  ]
}
