/*
Custom storage module for bots. Overrides the default simple_storage
module to add a custom_storage_db database.
*/

var Store = require('jfs');

module.exports = function(config) {

    if (!config) {
        config = {
            path: './',
        };
    }

    var teams_db = new Store(config.path + '/teams', { saveId: 'id' });
    var users_db = new Store(config.path + '/users', { saveId: 'id' });
    var channels_db = new Store(config.path + '/channels', { saveId: 'id' });
    var custom_storage_db = new Store(config.path + '/custom_storage', { saveId: 'id' });

    var objectsToList = function(cb) {
        return function(err, data) {
            if (err) {
                cb(err, data);
            } else {
                cb(err, Object.keys(data).map(function(key) {
                    return data[key];
                }));
            }
        };
    };

    var storage = {
        teams: {
            get: function(team_id, cb) {
                teams_db.get(team_id, cb);
            },
            save: function(team_data, cb) {
                teams_db.save(team_data.id, team_data, cb);
            },
            delete: function(team_id, cb) {
                teams_db.delete(team_id.id, cb);
            },
            all: function(cb) {
                teams_db.all(objectsToList(cb));
            }
        },
        users: {
            get: function(user_id, cb) {
                users_db.get(user_id, cb);
            },
            save: function(user, cb) {
                users_db.save(user.id, user, cb);
            },
            delete: function(user_id, cb) {
                users_db.delete(user_id.id, cb);
            },
            all: function(cb) {
                users_db.all(objectsToList(cb));
            }
        },
        channels: {
            get: function(channel_id, cb) {
                channels_db.get(channel_id, cb);
            },
            save: function(channel, cb) {
                channels_db.save(channel.id, channel, cb);
            },
            delete: function(channel_id, cb) {
                channels_db.delete(channel_id.id, cb);
            },
            all: function(cb) {
                channels_db.all(objectsToList(cb));
            }
        },
        custom_storage: {
            get: function(custom_storage_id, cb) {
                custom_storage_db.get(custom_storage_id, cb);
            },
            save: function(custom_storage, cb) {
                custom_storage_db.save(custom_storage.id, custom_storage, cb);
            },
            delete: function(custom_storage_id, cb) {
                custom_storage_db.delete(custom_storage_id.id, cb);
            },
            all: function(cb) {
                custom_storage_db.all(objectsToList(cb));
            }
        }
    };

    return storage;
};