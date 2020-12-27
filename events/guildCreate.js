
module.exports = (client, guild) => {
  const Discord = require("discord.js");

  client.logger.log(`Joined guild: ${guild.name} (${guild.id}) with ${guild.memberCount} members`);
  const embed0 = new Discord.MessageEmbed()
  .setTitle('Thanks For Adding Me to Your Server!')
  .setDescription("The prefix for `" + guild.name +"` is `" + client.getSettings("default").prefix +"`\n\n"+
  "**Useful Resources**\n"+
  "[Command List](https://twitchchat.ml/commands)\n"+
  "[Dashboard](https://twitchchat.ml/)\n"+
  "[Support Server](https://discord.gg/ns3RHwz)\n\n")
  .setColor(0x6441a5)
  .setFooter("\nTwitch Chat Bot Developed by @TheLickIn13Keys on Twitter!\n(TheLickIn13Keys#9999)")
  .addField('Help Command', 'chat! help')
  guild.systemChannel.send(embed0);

};
