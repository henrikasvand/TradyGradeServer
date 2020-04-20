class User {
  constructor(id, name, password, email, picture) {
    (this.id = id),
      (this.name = name),
      (this.password = password),
      (this.email = email),
      (this.picture = picture);
  }
}

module.exports = User;
