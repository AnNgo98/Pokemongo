const mongo = require('mongodb').MongoClient;
const client = require('socket.io').listen(4000).sockets;

// Connect to mongo
mongo.connect('mongodb://merncrudex1:thuy123@ds127535.mlab.com:27535/expenses', function(err, db){
    if(err){
        throw err;
    }

    console.log('MongoDB connected ...');


    // Connect to socket.io
    client.on('connection', function(socket){
        let chat = db.collection('chats');

        // Create function to send status
        sendStatus = function(s){
            socket.emit('status', s);
        }

        // Get chats from mongo collection
        chat.find().limit(100).sort({_id:1}).toArray(function(err, res){
            if(err){
                throw err;
            }

            // Emit the messages  
            socket.emit('output', res);
        });

        // Handle input events
        socket.on('input', function(data){
            let name = date.name;
            let message = date.message;
            
            // Check for name  and message
            if(name == '' || message == ''){
                // Send error status
                sendStatus('Please enter the name and message');
            } else {
                // Insert message
                chat.insert({name: name , message: message}, function(){
                    client.emit('output', [data]);

                    // Send status object
                    sendStatus({
                        message: 'Message sent',
                        clear: true
                    });
                });
            }
        });

        // Handle clear
        socket.on('clear', function(data){
            // Remove all chats from collection
            chat.remove({}, function(){
                // Emit clear
                socket.emit('cleared');
            });
        });
    });
});

