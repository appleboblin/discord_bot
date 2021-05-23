module.exports = {
  commands: ['add', 'addition'],
  expectedArgs: '<num1> <num2>',
  description: 'This is add command',
  permissionError: 'You need administrator permission to run this command',
  minArgs: 2,
  maxArgs: 2,
  //permissions: ['SEND_MESSAGES'],
  //requiredRoles: [`test`],
  callback: (message, args, text) => {
    // addition
    const num1 = +args[0];
    const num2 = +args[1];

    message.channel.send(`The sum is ${num1 + num2}`);
  },
};
