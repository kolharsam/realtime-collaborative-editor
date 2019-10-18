const redis = require('ioredis');
const host = '127.0.0.1';

class RedisHandler {
    constructor() {
        this.Redis = new redis.Cluster([
                { port: 7000, host },
                { port: 7001, host },
                { port: 7002, host },
        ]);
        this.RedisKey = 'data-collab-editor';
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
