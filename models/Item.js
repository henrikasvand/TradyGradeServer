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
    picture,
    sellerId,
    seller
  ) {
    this.item = {
      id,
      name,
      description,
      category,
      price,
      condition,
      sold,
      listedAt,
      expires,
      pictureURL: picture
    };
    this.seller = {
      id: sellerId,
      name: seller
    };
  }
}

module.exports = Item;
