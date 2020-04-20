const pool = require('./poolConnection');
const User = require('../models/User');

exports.getUsers = async () => {
  try {
    let response = await pool.query('SELECT * from users');
    let users = [];
    for (let row of response.rows) {
      let user = new User(
        row.user_id,
        row.user_name,
        row.user_password,
        row.user_email,
        row.user_picture
      );
      users = [...users, user];
    }
    return users;
  } catch (err) {
    console.error(err.message);
    return null;
  }
};

exports.getUser = async id => {
  try {
    let response = await pool.query('SELECT * FROM users WHERE user_id=$1', [
      id
    ]);

    if (response.rows.length === 0) {
      return null;
    }

    let user = new User(
      response.rows[0].user_id,
      response.rows[0].user_name,
      response.rows[0].user_password,
      response.rows[0].user_email,
      response.rows[0].user_picture
    );
    return user;
  } catch (err) {
    console.error(err.message);
    return null;
  }
};

exports.getUserByName = async name => {
  try {
    let response = await pool.query('SELECT * FROM users WHERE user_name=$1', [
      name
    ]);
    if (response.rows.length === 0) {
      return null;
    }
    let user = new User(
      response.rows[0].user_id,
      response.rows[0].user_name,
      response.rows[0].user_password,
      response.rows[0].user_email,
      response.rows[0].user_picture
    );
    return user;
  } catch (err) {
    console.error(err.message);
    return null;
  }
};

exports.updateUser = async (id, user) => {
  try {
    const { name, password, email, picture } = user;

    let response = await pool.query(
      'UPDATE users SET user_name=$1, user_password=$2, user_email=$3, user_picture=$4 WHERE user_id=$5 RETURNING user_id',
      [name, password, email, picture, id]
    );
    if (response.rows.length === 0) {
      return null;
    } else {
      return response.rows;
    }
  } catch (err) {
    console.error(err.message);
    return null;
  }
};

exports.createUser = async newUser => {
  try {
    const { name, password, email, picture } = newUser;

    let response = await pool.query(
      'INSERT INTO users (user_name, user_password, user_email, user_picture) VALUES($1,$2,$3,$4) RETURNING user_id',
      [name, password, email, picture]
    );
    if (response.rows.length > 0) {
      return response.rows[0].user_id;
    } else {
      return null;
    }
  } catch (err) {
    console.error(err.message);
    return null;
  }
};

exports.deleteUser = async id => {
  try {
    let response = await pool.query(
      'DELETE FROM users WHERE user_id=$1 RETURNING *',
      [id]
    );
    if (response.rows.length === 0) return null;
    else return response.rows;
  } catch (err) {
    console.error(err.message);
    return null;
  }
};

//ONLY FOR TESTING WITH LOCAL DB!

exports.deleteAllUsersFromDB = async () => {
  try {
    await pool.query('DELETE FROM users RETURNING *');
    return true;
  } catch (err) {
    console.error(err.message);
    return null;
  }
};
