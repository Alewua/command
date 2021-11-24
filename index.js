const Discord = require('discord.js')
const ms = require('ms')
const fs = require('fs')
const chalk = require('chalk')

const {
    token,
    PREFIX
} = require('./config.json')
const client = new Discord.Client()

const colors = require('./colors.json')
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

client.commands = new Discord.Collection()


for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {

    console.log(chalk.bgGreenBright.black("[" + client.user.username + "]"), "Bot açıldı");
    client.user.setActivity('Made By Alewua with 💖', {
        type: "PLAYING"
    });
});

client.on('message', async message => {

    const prefixMention = new RegExp(`^<@!?${client.user.id}> `);
    const prefix = message.content.match(prefixMention) ? message.content.match(prefixMention)[0] : PREFIX;

    let mentionEmbed = new Discord.MessageEmbed()
        .setTimestamp()
        .setAuthor(`${message.client.user.username}`, message.client.user.avatarURL())
        .setDescription("👋 Mrb prefixim " + PREFIX)
        .setColor(colors.orange)
        .setFooter(message.client.user.username, message.client.user.displayAvatarURL({
            dynamic: true
        }))

        
    if (message.mentions.users.has(message.client.user.id)) message.channel.send(`<@${message.author.id}>`, mentionEmbed)

    if (!message.content.startsWith(prefix)) return;


    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;
    try {
        command.execute(message, args, client);
        console.log(chalk.greenBright('[KOMUT]'), `${message.author.tag} kişisi şu komutu kullandı ` + commandName)
    } catch (error) {
        console.log(error);
        message.reply('Komut çalıştırılırken bir sıkıntı oluştu ```\n' + error + "\n```");
    }
});

client.login(token).catch(error => {
    console.log(chalk.red('[ERROR] ') + error)
})