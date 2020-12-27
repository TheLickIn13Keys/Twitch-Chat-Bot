

const { DiscordAPIError } = require("discord.js");
const Discord = require("discord.js");

exports.run = (client, message, args, level) => {
  if (!args[0]) {
    const settings = message.settings;

    const myCommands = message.guild ? client.commands.filter(cmd => client.levelCache[cmd.conf.permLevel] <= level) : client.commands.filter(cmd => client.levelCache[cmd.conf.permLevel] <= level &&  cmd.conf.guildOnly !== true);

    const commandNames = myCommands.keyArray();
    const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
    const outputEmbed = new Discord.MessageEmbed()
    .setAuthor("Twitch Chat Bot Commands", client.user.avatarURL())
    .setDescription("The prefix for `" + message.guild.name +"` is `" + settings.prefix +"`\n\n"+
    "Individual Command Help: `" + settings.prefix +"help <command>`\n\n"+
    "Turn off emote replacement: `" + settings.prefix +"set edit replaceEmotes false`\n\n"+
    "Turn on emote replacement: `" + settings.prefix +"set edit replaceEmotes true`\n\n"+
    "**Useful Resources**\n"+
    "[Command List (Also down below!)](https://twitchchat.ml/commands)\n"+
    "[Dashboard](https://twitchchat.ml/)\n"+
    "[Support Server](https://discord.gg/ns3RHwz)\n")
    .setColor(0x6441a5)
    .setFooter("\nTwitch Chat Bot Developed by @TheLickIn13Keys on Twitter!\n(TheLickIn13Keys#9999)")
     message.channel.send(outputEmbed);
    let currentCategory = "";
    let output = `= Command List =\n\n[Use ${settings.prefix}help <command name> for details]\n`;
    const sorted = myCommands.array().sort((p, c) => p.help.category > c.help.category ? 1 :  p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1 );
    sorted.forEach( c => {
      const cat = c.help.category.toProperCase();
      if (currentCategory !== cat) {
        output += `\n== ${cat} ==\n`;
        currentCategory = cat;
      }
      output += `${settings.prefix}${c.help.name}${" ".repeat(longest - c.help.name.length)} :: ${c.help.description}\n`;
    });
    message.channel.send(output, {code:"asciidoc"});


  } else {
    let command = args[0];
    if (client.commands.has(command)) {
      command = client.commands.get(command);
      if (level < client.levelCache[command.conf.permLevel]) return;
      message.channel.send(`= ${command.help.name} = \n${command.help.description}\nUSAGE: ${command.help.usage}`, {code:"asciidoc"});
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["h", "halp"],
  permLevel: "User"
};

exports.help = {
  name: "help",
  category: "General",
  description: "Displays all the available commands for your permission level.",
  usage: "help [command]"
};
