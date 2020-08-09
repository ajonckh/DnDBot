const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = '!';
var initArr = [];
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./users');
}
client.once('ready', () => {
    console.log('DnD XP is online');
});

client.on('message', message => {
    if(message.content.includes('please')){
        message.react('🥺');
        message.react('👉');
        message.react('👈');
    }
    if(!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    
    console.log(args);

    if(args[0] === 'roll'){
        if(args[1] != null){
            message.channel.send('You rolled ' + Math.floor((Math.random() * parseInt(args[1])) + 1)); 
        }else{
            message.channel.send('Please state what dice you want to roll.');
        }
    }else if(args[0] == 'xp'){
        if(args[1] == 'add'){
            if(args[3] == null && args[2] == null){
                message.channel.send('Please enter to whom and how much xp you want to give!');
                return;
            }
            else if(args[2] == null){
                message.channel.send('Please enter who you want to give xp to!');
                return;
            }
            else if(args[3] == null){
                message.channel.send('Please enter how much xp you want to give!');
                return;
            }
            else if(args[2] == 'all'){
                for(var i = 0; i < localStorage.length; i++){
                    if(localStorage.key(i).includes('_xp')){
                        localStorage.setItem(localStorage.key(i),parseInt(localStorage.getItem(localStorage.key(i)))+parseInt(args[3]));
                    }
                }
                message.channel.send('You added ' + args[3] + 'XP to all players!');
            }
            else{
                var name = args[2] + '_xp'
                if(localStorage.getItem(name)!=null){
                    localStorage.setItem(name,parseInt(localStorage.getItem(name))+parseInt(args[3]));
                    message.channel.send('You added ' + args[3] + 'XP to ' + args[2] + ', they now have ' + localStorage.getItem(name) + 'XP');
                }else{
                    message.channel.send('Please enter a proper name.');
                }
            }
        }else if(args[1] == 'remove'){
            if(args[3] == null && args[2] == null){
                message.channel.send('Please enter from whom and how much xp you want to take!');
                return;
            }else if(args[2] == null){
                message.channel.send('Please enter who you want to take xp from!');
                return;
            }else if(args[3] == null){
                message.channel.send('Please enter how much xp you want to take!');
                return;
            }else if(args[2] == 'all'){
                for(var i = 0; i < localStorage.length; i++){
                    if(localStorage.key(i).includes('_xp')){
                        localStorage.setItem(localStorage.key(i),parseInt(localStorage.getItem(localStorage.key(i)))-parseInt(args[3]));
                    }
                }
                message.channel.send('You took ' + args[3] + 'XP from all players!');
            }else{
                var name = args[2] + '_xp'
                if(localStorage.getItem(name)!=null){
                    localStorage.setItem(name,parseInt(localStorage.getItem(name))-parseInt(args[3]));
                    message.channel.send('You took ' + args[3] + 'XP from ' + args[2] + ', they now have ' + localStorage.getItem(name) + 'XP');
                }else{
                    message.channel.send('Please enter a proper name.');
                }
            }
        }else if(args[1] == 'new'){
            if(args[3] == null && args[2] == null){
                message.channel.send('Please enter to whom and how much xp you want to give!');
                return;
            }else if(args[2] == null){
                message.channel.send('Please enter who you want to give xp to!');
                return;
            }else if(args[3] == null){
                var name = args[2] + '_xp'
                localStorage[name] = 0;
                message.channel.send('you started tracking ' + args[2] + '\'s XP');
            }else{
                var name = args[2] + '_xp'
                localStorage[name] = args[3];
                message.channel.send('you started tracking ' + args[2] + '\'s XP and they start with ' + args[3] + 'XP');
            }
        }else if(args[1] == 'get'){
            if(args[2] == null){
                message.channel.send('Please enter who\'s xp you want to know!');
                return;
            }
            else{
                var name = args[2] + '_xp'
                if(localStorage.getItem(name)!=null){
                    message.channel.send(args[2] + ' has ' + localStorage.getItem(name) + 'XP');
                }else{
                    message.channel.send('Please enter a proper name.');
                }
            }
        }else if(args[1] == 'delete'){
            if(args[2] == null){
                message.channel.send('Please enter who\'s xp you want to delete!');
                return;
            }
            if(args[2] === 'all'){
                var i = 0;
                while(localStorage.length-i){
                    if(localStorage.key(i).includes('_xp')){
                        localStorage.removeItem(localStorage.key(i));
                    }else{
                        i++;
                    }
                }
                message.channel.send('You deleted all of the data, you monster.');
            }
            else{
                var name = args[2] + '_xp'
                if(localStorage.getItem(name)!=null){
                    localStorage.removeItem(name);
                    message.channel.send('You have cleared ' + args[2] + '\'s data.');
                }else{
                    message.channel.send('Please enter a proper name.');
                }
            }
        }else{
            message.channel.send('My text detection is not perfect so please fix your command');
        }
    }else if(args[0] == 'init'){//fix rolloff
        if(args[1] == null){
            message.client.send('Please type either !init add *Name* *roll* or !init get');
        }else if(args[1] == 'add'){
            if(args[2] == null && args[3] == null){
                message.client.send('Please enter character and roll')
            }else if(args[3] == null){
                message.client.send('Please enter roll')
            }else{
                var name = args[3] + " " + args[2];
                initArr.push(name);
                //message.channel.send('You entered ' + args[2] + ' into the initiative list with a roll of ' + args[3]);
                message.react('👍');
            }
        }else if(args[1] == 'get'){
            initArr.sort((a,b) => parseInt(b.split(' ')[0])-parseInt(a.split(' ')[0]));
            var i = 1;
            message.channel.send('Initiative order:');
            initArr.forEach(element => {
                const name = element.split(' ')[1]
                message.channel.send(i + '. ' + name + ' ');
                i++;
            });
            initArr = [];
        }else{
            message.channel.send('My text detection is not perfect so please fix your command');
        }
    }else if(args[0] == 'count'){
        var total_string = '';
        if(args[1] == 'add'){
            for(var i = 2; i < args.length; i++){
                if(i < args.length-1){
                    total_string += (args[i] + ' ');
                }else{
                    total_string += args[i]; 
                }
            }
            if(localStorage.getItem(total_string +'_link')!=null){
                tempArr = localStorage.getItem(total_string+'_link').split(' ')
                localStorage.setItem(total_string+'_link',(parseInt(tempArr[0])+1) + ' ' + tempArr[1]);
                message.channel.send('You added 1 to the "' + total_string + '" count, this has happened ' + localStorage.getItem(total_string+'_link').split(' ')[0] + ' times. ' + tempArr[1]);
            }else if(localStorage.getItem(total_string)!=null){
                localStorage.setItem(total_string,parseInt(localStorage.getItem(total_string))+1);
                message.channel.send('You added 1 to the "' + total_string + '" count, this has happened ' + localStorage.getItem(total_string) + ' times.');
            }else{
                localStorage.setItem(total_string,1);
                message.channel.send('You added 1 to the "' + total_string + '" count, this is the first time this has happened.');
            }
        }else if(args[1] == 'correlate'){
            for(var i = 2; i < args.length-1; i++){
                if(i < args.length-2){
                    total_string += (args[i] + ' ');
                }else{
                    total_string += args[i]; 
                }
            }
            var name = total_string + '_link'
            var to_store = '1 ' + args[args.length-1]
            localStorage.setItem(name, to_store)
            message.channel.send('You have correlated "' + total_string + '" with a Link.')
        }else if(args[1] == 'clear'){
            for(var i = 2; i < args.length; i++){
                if(i < args.length-1){
                    total_string += (args[i] + ' ');
                }else{
                    total_string += args[i]; 
                }
            }
            if(localStorage.getItem(total_string)!=null){
                localStorage.removeItem(total_string);
                message.channel.send('You cleared the count of "' + total_string + '"');
            }
        }else{
            for(var i = 1; i < args.length; i++){
                if(i < args.length-1){
                    total_string += (args[i] + ' ');
                }else{
                    total_string += args[i]; 
                }
            }
            if(localStorage.getItem(total_string +'_link')!=null){
                var arr1 = localStorage.getItem(total_string + '_link').split(' ')
                message.channel.send('"' + total_string + '" has occured ' + arr1[0] + ' times. ' + arr1[1]);
            } 
            else if(localStorage.getItem(total_string)!=null){
                message.channel.send('"' + total_string + '" has occured ' + localStorage.getItem(total_string) + ' times');
            }else{
                message.channel.send('that has never happened before, do you want to start tracking it?');
            }
        }
    }else{
        message.channel.send('My text detection is not perfect so please fix your command');
    }
});
