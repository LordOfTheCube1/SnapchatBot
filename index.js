const Discord = require("discord.js");
const config = require("./config.json");

const client = new Discord.Client({intents: ["GUILD_MESSAGES", "GUILDS"]});
client.login(config.BOT_TOKEN);

client.queue = {}; // using an object here meaning that if the bot goes down then the message won't be deleted. if you actually intend on using this i would recommend adding something where this is backed up to a database.
client.times = [];

function loop() {
  const timesSent = client.times.filter(e => e < Date.now());
  if (timesSent.length > 0) {
    for (let i = 0; i < timesSent.length; i++) {
      for (let j = 0; j < client.queue[timesSent[i]].length; j++) {
        client.channels.cache.get(config.channelID).messages.cache.get(client.queue[timesSent[i]][j]).delete();
      }
      client.times.shift();
    }
  }
}
client.on("ready", async () => {
  console.log("READY!");
  setInterval(loop, 1000);
})
client.on("messageCreate", async msg => {
  if(!msg.channel.id == config.channelID) return;
  const b = Date.now();
  if(client.queue[b + config.delay]) client.queue[b + config.delay].push(msg.id);
   else {
     client.queue[b + config.delay] = [msg.id];
     client.times.push(b + config.delay);
   }

})
