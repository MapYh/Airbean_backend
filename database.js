const Datastore = require("nedb-promise");
//Central databas
//Alla nya databaser skapas här

const userData = new Datastore({
  filename: "./model/users.db",
  autoload: true,
});

const orderData = new Datastore({
  filename: "./model/orders.db",
  autoload: true,
});

const beansMenu = new Datastore({
    filename: "./model/menu.db",
    autoload: true,
  });

  const aboutText = new Datastore({
    filename: "./model/about.db",
    autoload: true,
  });

  //exporteras här
  module.exports = {userData, orderData, beansMenu, aboutText};