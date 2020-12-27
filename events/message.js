


const path = require('path');
const Discord = require("discord.js");
const DBL = require("dblapi.js");
const db = require('quick.db');
const ytdl = require('ytdl-core');
var gis = require('g-i-s');
var stringSimilarity = require('string-similarity');
const AntiSpam = require('discord-anti-spam');
const webhookk = require("webhook-discord");
const { isPrimitive } = require('util');
const { json } = require('express');
const { EmoteFetcher, EmoteParser } = require('twitch-emoticons-fork');
const fetcher = new EmoteFetcher();
const parser = new EmoteParser(fetcher, {
  template: '{link}'
});



module.exports = async (client, message) => {

  
  
  if (message.author.bot) return;
  var temp = message.content.toString();
  var message1 = temp.toLowerCase();
  
  
  



  const settings = message.settings = client.getSettings(message.guild);
  if(settings.replaceEmotes == "true"){
    var foundHook = await getWebhook(message)
    const Hook = new webhookk.Webhook(foundHook.url)
    var modStr = [];
    var res = message.content.split(" ");
    var foundEmoji = false;
    var useAPI = false;
    var apiEmoji;
    for(let i = 0; i<res.length; i++) {
      const guild = client.guilds.cache.find(guild => guild.id === "760966302947868732");
      const emoji = guild.emojis.cache.find(emoji => emoji.name == res[i]);
      if(emoji){
        let foo = `<:${emoji.name}:${emoji.id}>`;
        modStr.push(foo);
        foundEmoji = true;
      }
      if(!emoji){
        apiEmoji = await getAPIEmote(res[i], message.guild);
        if(apiEmoji == "NULL"){
          let foo1 = res[i];
          modStr.push(foo1);
        }
        else{
          modStr.push(`<:${apiEmoji.name}:${apiEmoji.id}>`)
          foundEmoji = true;
          useAPI = true;
        }

      }
    }
    if(foundEmoji){
      const msg = new webhookk.MessageBuilder()
      .setName(message.member.displayName)
      .setText(modStr.join(' '))
      .setAvatar(message.author.displayAvatarURL())
      Hook.send(msg).then(hi => {
        message.delete();
        if(useAPI){
          apiEmoji.delete();
        }
      });
    }

  }
 

  async function getAPIEmote(res, guild){
    return new Promise((resolve, reject) => {
      try{
        fetcher.fetchBTTVEmotes("207813352").then(() => {
          const foo = fetcher.emotes.get(res);
          if(foo){
            guild.emojis.create(foo.toLink(), res).then(emoji => {
              return resolve(emoji);
            }).catch(console.error)
          }
          else{
            fetcher.fetchTwitchEmotes(null).then(() => {
              const foo = fetcher.emotes.get(res);
              if(foo){
                guild.emojis.create(foo.toLink(), res).then(emoji => {
                  return resolve(emoji);
                }).catch(console.error)
              }
              else{
                fetcher.fetchFFZEmotes("hasanabi").then(() => {
                  const foo = fetcher.emotes.get(res);
                  if(foo){
                    guild.emojis.create(foo.toLink(), res).then(emoji => {
                      return resolve(emoji);
                    }).catch(console.error)
                  }
                  else{
                    return resolve("NULL");
                  }
                });
              }
            });
          }
         
        });

      }catch(err){
        return reject(err);
      }
    });
  }
  

 

  function getWebhook(message){
    return new Promise((resolve, reject) => {
      try{
        message.channel.fetchWebhooks().then(webhook => {
          var foundHook = webhook.find(webhook => webhook.name === "Twitch Chat Bot");
          if(!foundHook){
            message.channel.createWebhook('Twitch Chat Bot').then(webhook =>{
              return resolve(webhook);
            })
          }
          else {
            return resolve(foundHook);
          }
        })
      }
      catch(error){
        reject(error);
      }

    });
  }




  
  
  
  

  
  
  
  
  const mentionMatch = new RegExp(`^<@!?${client.user.id}> ?$`);
  if (message.content.match(mentionMatch)) {
    return message.channel.send(`My prefix on this guild is \`${settings.prefix}\``);
  }

  
  
  
  
  
  const prefixes = [settings.prefix.toLowerCase(), `<@!${client.user.id}>`];

  const content = message.content.toLowerCase();
  const prefix = prefixes.find(p => content.startsWith(p));
  if(message.channel.type === 'dm' && !prefix){
    message.channel.send("Make sure to use the global prefix: `chat!` for DMs")
  }
  if (!prefix) return;


  
  
  
  
  
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  
  const level = client.permlevel(message);

  
  
  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
  
  
  if (!cmd) return;

  
  
  if (cmd && !message.guild && cmd.conf.guildOnly)
    return message.channel.send("This command is unavailable via private message. Please run this command in a guild.");

  if (level < client.levelCache[cmd.conf.permLevel]) {
    if (settings.systemNotice === "true") {
      return message.channel.send(`You do not have permission to use this command.
  Your permission level is ${level} (${client.config.permLevels.find(l => l.level === level).name})
  This command requires level ${client.levelCache[cmd.conf.permLevel]} (${cmd.conf.permLevel})`);
    } else {
      return;
    }
  }

  
  
  message.author.permLevel = level;
  
  message.flags = [];
  while (args[0] && args[0][0] === "-") {
    message.flags.push(args.shift().slice(1));
  }
  
  client.logger.log(`${client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`, "cmd");
  cmd.run(client, message, args, level);

  function hook(message) { 

    

    
    message.channel.fetchWebhooks() 
        .then(webhook => {

            
            let foundHook = webhook.find(webhook => webhook.name === 'test'); 

            
            if (!foundHook) {
              message.channel.createWebhook(message.author.displayName, message.author.displayAvatarURL()) 
                    .then(webhook => {
                        
                        webhook.send(message.content.toString(), {
                            "name": "tesat",
                            "avatar": message.author.displayAvatarURL(),
                        })
                            .catch(error => { 
                                console.log(error);
                                return message.channel.send('**Something went wrong when sending the webhook. Please check console.**');
                            })
                    })
            } else { 
                foundHook.send(message.content.toString(), { 
                  "name": "tesat",
                  "avatar": message.author.displayAvatarURL(),
                })
                    .catch(error => { 
                        console.log(error);
                        return message.channel.send('**Something went wrong when sending the webhook. Please check console.**');
                    })
                }

        })

}

};
