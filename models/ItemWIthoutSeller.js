class Item {
  constructor(
    id,
    name,
    description,
    sold,
    category,
    price,
    listedAt,
    expires,
    condition,
    picture
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.category = category;
    this.price = price;
    this.condition = condition;
    this.sold = sold;
    this.listedAt = listedAt;
    this.expires = expires;
    this.pictureURL = picture;
  }
}

module.exports = Item;
