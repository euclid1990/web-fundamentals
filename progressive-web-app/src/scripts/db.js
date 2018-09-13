import Dexie from 'dexie';

const db = new Dexie('coinmarketapp');

db.version(1).stores({
  /* IndexedDB out-of-line primary key */
  user: ',id, name, avatar, username, email, birthday, password, created_at, signed_in_at',
  /* IndexedDB in-line primary key */
  cryptocurrencies: '++id, name, symbol'
});

export default db;
