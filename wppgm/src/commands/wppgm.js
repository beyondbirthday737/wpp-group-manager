const command = {
  name: 'add',
  description: '<contactsJson file> <group name>',
  run: async toolbox => {
    const { print, run, parameters} = toolbox

    const jsonPath = parameters.first
    const groupName = parameters.second
    print.info('Welcome to wpp group manager')
    await run(jsonPath,groupName)
  },
}

module.exports = command
