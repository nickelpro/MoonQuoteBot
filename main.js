
/**
MoonBot

Takes quotes -> website

yay!!!!
*/

//Discord.js
var Discord = require("discord.js");

//Settings
var Settings = require("./settings/settings.json");
var Responses = require("./responses.json");

var client = new Discord.Client();

var express = require('express');
var app = express();
var fs = require('fs');

/*
Maybe load quotes here
*/
var sqlite = require('sqlite3').verbose();


if (fs.existsSync('./quotes.db')) {
    var db = new sqlite.Database('quotes.db');
} else{
    var db = new sqlite.Database('quotes.db');
    db.run("CREATE TABLE quotes (quote TEXT, author TEXT)");
}

var meme = db.prepare("INSERT INTO quotes VALUES (?,?)");

/*
Discord bot
*/
client.login(Settings.token);
console.log(Responses.LOGGED_INTO_DISCORD);

client.on('message', function(message) {
    var messageSplit = message.content.match(/("[^"]*")|[^ ]+/g);
    console.log(messageSplit);

    if(messageSplit.length > 1 && messageSplit[0] == "/quote"){

        if(messageSplit[1] == "-a" || messageSplit[1] == "--add"){
            if(messageSplit.length == 4 && messageSplit[2] != "" && messageSplit[3] != ""){
                meme.run(messageSplit[2].replace(/\"/g,""),messageSplit[3].replace(/\"/g,""));

            } else {
                message.reply(Responses.ADD_QUOTES_PROPER_USAGE)
            }

        } else if (messageSplit[1] == "-l" || messageSplit[1] == "--list") {
            var response = "";

            db.each("SELECT quote, author FROM quotes", function(err, row){
                response += '"' + row.quote + '"', row.author;
            });

            message.reply(response);
        } else if (messageSplit[1] == "-h" || messageSplit[1] == "--help"){
            message.reply(Responses.HELP_MESSAGE);
        }
    } else if (messageSplit.length > 0 && messageSplit[0] == "@everyone") {
        message.reply(Responses.SOMEONE_SAID_ATEVERYONE);
    }
});


/*
Web Client
*/
app.get('/', function (req, res) {
    var response = "";

    db.each("SELECT quote, author FROM quotes", function(err, row){
        response += '"' + row.quote + '"', row.author;
    });
    res.send(response);
});

app.listen(Settings.port, function () {
    console.log('Example app listening on port',Settings.port,'!');
});


/*
Shell
*/