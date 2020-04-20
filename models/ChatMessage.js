class Message {
    constructor(
        msg_id,
        user_id,
        user_picture,
        name,
        text,
        time
    ) {
        this.message_id =  msg_id;
        this.user = user_id;
        this.picture = user_picture;
        this.username = name;
        this.message = text;
        this.timestamp = time;
    }
}

module.exports = Message;