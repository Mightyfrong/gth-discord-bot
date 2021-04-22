import { createRequire } from 'module'
const require = createRequire(import.meta.url);
const fs = require('fs');

//checks user permission saved in users.json
export async function permUser(msg, level) {
    // level 0 = blacklist
    // level 1 = new user
    // level 2 = translator user
    // level 3 = admin
    let rawdata = fs.readFileSync('../data/users.json');
    let users = JSON.parse(rawdata);
    let author = msg.author.id;
    let user;
    for (var i = 0; i < users.users.length; i++) {
        if (users.users[i].id == author) {
            user = users.users[i];
            break;
        }
    }
    let manager = await msg.guild.member(author).hasPermission('MANAGE_GUILD', {}, true, true);
    if (user !== undefined) {
        if (user.permission >= level || manager) {
            logger("user perm granted");
            return true;
        }
        else if (level == 2) {
            let result = await disclaimer(msg, user);
            if (result) {
              updateUserPerm(author, 2);
              msg.reply('You can now use the translate feature');
            }
            return result;
        }
        logger(user.id + " permLevel " + user.permission + " needs " + level);
        msg.reply("Sorry. You can't do that");
        return false;
    }
    newUser(msg, users);
    return 1 == level;
}

//creates and seves new user in users.json
function newUser(msg, users) {
    logger("new user");
    users.users.push({ "id": msg.author.id, "permission": 1 });
    let data = JSON.stringify(users);
    fs.writeFileSync('../data/users.json', data);
}

//updates permission of user
function updateUserPerm(userId, level) {
    let rawdata = fs.readFileSync('../data/users.json');
    let users = JSON.parse(rawdata);
    for (var i = 0; i < users.users.length; i++) {
        if (users.users[i].id == userId) {
            logger(userId + " was permLevel " + users.users[i].permission + " now " + level);
            users.users[i].permission = level;
            break;
        }
    }
    let data = JSON.stringify(users);
    fs.writeFileSync('../data/users.json', data);
}

//displays disclaimer and
async function disclaimer(msg, pUser) {
    //:white_check_mark: = ✅
    //:x: = ❌
    return new Promise(async function (resolve) {
        //Ugly but better than a one liner
        let message = await msg.reply(
`This seems to be the first time you are using the translation feature.
Please note that this tool should only be used for getting a quick impressions of writing syntax, decoration and layout,
but should never be used for a finished work, particularly without human verification.
Do you understand?`
        );
        message.react('✅');
        message.react('❌');
        const yFilter = (reaction, user) => reaction.emoji.name === '✅' && user.id === pUser.id;
        const yCollector = message.createReactionCollector(yFilter, { time: 30000 });
        yCollector.on('collect', r => {
            logger(`Collected ${r.emoji.name}`);
            message.delete();
            resolve(true);
        });
        const nFilter = (reaction, user) => reaction.emoji.name === '❌' && user.id === pUser.id;
        const nCollector = message.createReactionCollector(nFilter, { time: 30000 });
        nCollector.on('collect', r => {
            logger(`Collected ${r.emoji.name}`)
            message.delete();
            resolve(false);
        });
        yCollector.on('end', (collected, reason) => {
            if (reason == 'time') {
                message.delete();
                msg.channel.send('You took to long. Please try again.');
                resolve(false);
            }
        });
    });
}

export function logger(input){
  console.log(getTimestamp() + ' ' + input);
}

function getTimestamp() {
  var unix = Date.now()
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var date = new Date(unix);
  var year = date.getFullYear();
  var month = months[date.getMonth()];
  var day = date.getDate();
  var hours = date.getHours();
  var minutes = "0" + date.getMinutes();
  var seconds = "0" + date.getSeconds();
  var timestamp ='[' + month + '-' + day + '-' + year + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2) + ']';
  return timestamp
}
