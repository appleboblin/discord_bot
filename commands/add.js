module.exports = {
    commands: ['add', 'addition'],
    expectedArgs: '<num1> <num2>',
    permissionError: 'You need administrator permission to run this command',
    minArgs: 2,
    maxArgs: 2,
    callback: (message, arguments, text)=> {
        // addition
        const num1 = +arguments[0]
        const num2 = +arguments[1]
    
        message.reply(`The sum is ${num1 + num2}`)
    },
    permissions: ['SEND_MESSAGES'],
    requiredRoles: [`test`],
}