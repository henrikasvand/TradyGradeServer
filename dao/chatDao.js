const pool = require('./poolConnection');
const ChatId = require('../models/ChatId');

// GET chatIDs for specific user
exports.getChatIDs = async (id) => {
    try {
        let people = [];
        let response = await pool.query(
            'SELECT user_id, chatter_chat_id FROM chatter, users WHERE chatter_user_id = user_id AND user_id = $1', [id]
        );
        for (let chatid of response.rows) {
            let response = await pool.query(
                'SELECT user_name, user_picture FROM users, chatter WHERE user_id = chatter_user_id AND chatter_chat_id = $1 AND user_id != $2', [chatid.chatter_chat_id, id]
            );
            for (onePerson of response.rows) {
                let person = { chatid: chatid.chatter_chat_id, name: onePerson.user_name, picture: onePerson.user_picture}
                people.push(person)
            }
        }
        return people
    } catch (err) {
        console.error(err.message);
        return null;
    }
}

exports.getChatID = async (user1, user2) => {
    try {
        let response = await pool.query(
            'SELECT chat.chat_id FROM chat, (SELECT chat_id FROM chat, chatter WHERE chat_id = chatter_chat_id AND chatter_user_id = $1) as user1, (SELECT chat_id FROM chat, chatter WHERE chat_id = chatter_chat_id AND chatter_user_id = $2) as user2 WHERE chat.chat_id = user2.chat_id AND user2.chat_id = user1.chat_id', [user1, user2]
        );
        return response.rows;
    } catch (err) {
        console.error(err.message);
        return null;
    }
}

// POST new chatID
exports.addChatID = async (user1, user2) => {
    try {
        newId = await pool.query('INSERT INTO public.chat(chat_id) VALUES (nextval(\'chat_chat_id_seq\'::regclass)) RETURNING chat_id')
        await pool.query('INSERT INTO chatter(chatter_user_id, chatter_chat_id) VALUES ($1, $3), ($2, $3)', [user1, user2, newId.rows[0].chat_id])
        user2name = await pool.query('SELECT user_name FROM users WHERE user_id = $1', [user2])
        return ({id: newId.rows[0].chat_id, name: user2name.rows[0].user_name})
    } catch (err) {
        console.error(err.message);
        return null;
    }
}

// ADD new user as a chatter to a chat
exports.addChatter = async (chat, user) => {
    try {
        chatter = await pool.query('INSERT INTO chatter(chatter_user_id, chatter_chat_id) VALUES ($1, $2) RETURNING *', [user, chat])
        return `User ${chatter.rows[0].chatter_user_id} added to chat ${chatter.rows[0].chatter_chat_id}`
    } catch (err) {
        console.error(err.message);
        return null;
    }
}