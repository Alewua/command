const Discord = require('discord.js')
const colors = require('../colors.json')
const {
  config
} = require('../config.json')

module.exports = {
  name: 'eval',
  description: 'evallio',
  usage: 'eval <kod>',
  required: 'DEVELOPER',
  aliases: ['ev', 'evaluate'],
  category: 'Developer',
  guildOnly: true,
  async execute(message, args) {
    if (message.author.id != "847765269937651723") return;

    function clean(text) {
      if (typeof (text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
      else
        return text;
    }

    try {
      const code = args.join(" ");
      let evaled = eval(code);

      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);

      message.channel.send(clean(evaled), {
        code: "xl"
      });
    } catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
  }
}