class Msg {
    constructor(msg_id,
        msg_user_id,
        msg_chat_id,
        msg_timestamp,
        msg_text,
        user_name,
        user_email,
        user_picture) {
        this.id = msg_id,
            this.user = msg_user_id,
            this.chat = msg_chat_id,
            this.timestamp = msg_timestamp,
            this.msgText = msg_text,
            this.userName = user_name,
            this.userEmail = user_email,
            this.userPic = user_picture
    }
};

module.exports = Msg;