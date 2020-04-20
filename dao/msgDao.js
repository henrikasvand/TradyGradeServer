const pool = require('./poolConnection');
const Message = require('../models/ChatMessage');
const Msg = require('../models/Msg');


// GET chatmessages by chatID
exports.getChatMessages = async id => {
  try {
      let response = await pool.query(
          'SELECT chat_id, msg_id, msg_user_id, user_picture, user_name, msg_text, msg_timestamp FROM msg, users, chat WHERE msg_user_id = user_id AND msg_chat_id = chat_id AND chat_id = $1', [id]
      );
      let chatID = response.rows[0].chat_id;
      let messages = [];
      for (let row of response.rows) {
          let message = new Message(
              row.msg_id,
              row.msg_user_id,
              row.user_picture,
              row.user_name,
              row.msg_text,
              row.msg_timestamp
          );
          messages = [...messages, message];
      }
      return { chatID, messages };
  } catch (err) {
      console.error(err.message);
      return null;
  }
};

// POST new chatmessage to chat
exports.newChatMessage = async (userId, chatId, message, time) => {
  try {
      await pool.query('INSERT INTO msg( msg_user_id, msg_chat_id, msg_text, msg_timestamp) VALUES ($1, $2, $3, $4)', [userId, chatId, message, time])
      return 'Message sent to database'
  } catch (err) {
      console.error(err.message);
      return null;
  }
}



exports.getMsg = async id => {
  try {
    let response = await pool.query('SELECT msg_id, msg_user_id, msg_chat_id, msg_timestamp, msg_text, user_name, user_email, user_picture FROM msg JOIN users ON msg_user_id = user_id WHERE msg_id=$1;', [
      id
    ]);
    'SELECT chat_id, msg_id, msg_user_id, user_name, msg_text, msg_timestamp FROM msg, users, chat WHERE msg_user_id = user_id AND chat_id = $1', [id]
    let msg = new Msg(
      response.rows[0].msg_id,
      response.rows[0].msg_user_id,
      response.rows[0].msg_chat_id,
      response.rows[0].msg_timestamp,
      response.rows[0].msg_text,
      response.rows[0].user_name,
      response.rows[0].user_email,
      response.rows[0].user_picture
    );
    return msg;
  } catch (err) {
    console.error(err.message);
    return null;
  }
};

exports.updateMsg = async (id, msg) => {
  try {
    const { msgText } = msg;

    let response = await pool.query(
      'UPDATE msg SET msg_text=$1 WHERE msg_id=$2',
      [ msgText, id]
    );
    return response.rows;
  } catch (err) {
    console.error(err.message);
    return null;
  }
};

exports.deleteMsg = async id => {
  try {
    let response = await pool.query('DELETE FROM msg WHERE msg_id=$1 RETURNING *', [id]);
    return response.rows;
  } catch (err) {
    console.error(err.message);
    return null;
  }
};

exports.deleteAllMsgsFromItemTable = async () => {
    try {
      await pool.query('DELETE from msg RETURNING *');
      return true;
    } catch (err) {
      console.error(err.message);
      return null;
    }
  };


// exports.createUser = async msg => {
//   try {
//     const { user, chat, timestamp, msgText } = msg;

//     let response = await pool.query(
//       'INSERT INTO users (msg_user_id, user_password, user_email, user_picture) VALUES($1,$2,$3,$4)',
//       [name, password, email, picture]
//     );
//     return response.rows;
//   } catch (err) {
//     console.error(err.message);
//     return null;
//   }
// };

// exports.deleteUser = async id => {
//   try {
//     let response = await pool.query('DELETE FROM users WHERE user_id=$1', [id]);
//     return response.rows;
//   } catch (err) {
//     console.error(err.message);
//     return null;
//   }
// };

