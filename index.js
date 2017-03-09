'use strict';

let fs = require('fs'),
    JSONStream = require('JSONStream'),
    es = require('event-stream');

function getStream() {
    let jsonData = 'data.json',
        stream = fs.createReadStream(jsonData, {encoding: 'utf8'}),
        parser = JSONStream.parse('*');
    return stream.pipe(parser);
}

function writeJsonStream() {
    let jsonOut = 'out.json',
        stream = fs.createWriteStream(jsonOut);
    //return JSONStream.stringify().pipe(stream)
    return stream;
}

function translate(data) {
    return {
        name: data.greeting
    }
}

let schemaVersion = 1;

let op = `{\n\"schemaVersion\": ${schemaVersion},\n\"data\": [\n`;

let sep = "\n,\n";

let cls =  "\n]\n}\n";

getStream()
.pipe(es.mapSync(translate))
.pipe(JSONStream.stringify(op, sep, cls))
.pipe(writeJsonStream())
;
