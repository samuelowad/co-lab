'use strict';


var socketIo = require('socket.io');
var ot = require('ot');
var roomlist = {};
const Task = require('./models/task')

module.exports = server => {
    var str = 'Welcome to Co-Lab'
    const io = socketIo(server);
    io.on('connection', socket => {
        socket.on('joinRoom', data => {
            if (!roomlist[data.room]) {
                var socketIOServer = new ot.EditorSocketIOServer(str, [], data.room, (socket, cb) => {
                    var self = this;
                    Task.findByIdAndUpdate(data.room, {
                        content: self.document
                    }, err => {
                        if (err) {
                            console.log(err);
                            return cb(false)
                        }
                        console.log(self.document)
                        cb(true)
                    })
                });
                roomlist[data.room] = socketIOServer;
            }
            roomlist[data.room].addClient(socket);
            roomlist[data.room].setName(socket, data.username);
            socket.room = data.room;
            socket.join(data.room);
        })
        console.log('connected')
        socket.on('chatMessage', data => {
            console.log(data)
            io.to(socket.room).emit('chatMessage', data);
        });

        socket.on('disconnect', () => {
            console.log('disconncted')
            socket.leave(socket.room);
        })
    })
}