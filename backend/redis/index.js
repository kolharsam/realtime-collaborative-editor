const redis = require('ioredis');
const fs = require('fs');
const host = 'localhost';

class RedisHandler {
    constructor() {
        this.Redis = new redis({
            sentinels: [
                { host, port: 5000 },
                { host, port: 5001 },
                { host, port: 5002 }
            ],
            name: 'collab_master'
        });
        // this.Redis = new redis();
        this.RedisKey = 'data-collab-editor';
        this.Redis.monitor((err, monitor) => {
            let message;
            monitor.on('monitor', (time, args, source, database) => {
                message = `${time} : "args" : ${args} "source" : ${source} "database" : ${database}`;
                fs.writeFile('redis_logs', message, (err) => {
                    if (err) {
                        return console.log('There was an error writing to file.');
                    }
                });
            });
        });
    }

    Set(value) {
        this.Redis.set(this.RedisKey, value);
    }

    async Get() {
        const data = await this.Redis.get(this.RedisKey).then(res => res);
        console.log(data);
        return data;
    }
}

const RDBHandler = new RedisHandler();

exports.Redis = RDBHandler;
