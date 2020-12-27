const Discord = require("discord.js");
const db = require('quick.db');;
var stringSimilarity = require('string-similarity');
var fs = require('fs');
var gis = require('g-i-s');
const { error } = require('console');
const { arch } = require('os');


    exports.run = async (client, message, [name, url], level) => {
        const settings = message.settings = client.getSettings(message.guild);

        if(!name || !url){
            return message.channel.send("USAGE: " + settings.prefix + "suggest <name of emote> <url>")
        }

        client.users.fetch('620845493957951498', false).then((user) => {
            user.send(message.author.tag + " suggested " + name + " with the image url " + url);
           });  
            const embed00 = new Discord.MessageEmbed()
                .addField('Successfully Suggested:', name)
                .setColor(0x6441a5)
            message.channel.send(embed00);
		    return;
            


    }
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "suggest",
    category: "General",
    description: 'Suggest an emote/emoji.',
    usage: "suggest <name of emote> <url>"
};