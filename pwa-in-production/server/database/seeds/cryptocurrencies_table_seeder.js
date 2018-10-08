exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('cryptocurrencies').del()
    .then(function () {
      let now = knex.fn.now();
      // Inserts seed entries
      return knex('cryptocurrencies').insert([
        { name: 'Bitcoin', symbol: 'btc', market_cap: 109498832139, price: 6344.22, volume: 3725883427, circulating_supply: 17259625, change: 1.92, is_mineable: true, created_at: now },
        { name: 'Ethereum', symbol: 'eth', market_cap: 20318548499, price: 199.46 , volume: 1573305823, circulating_supply: 101866495, change: 4.00, is_mineable: true, created_at: now },
        { name: 'XRP', symbol: 'xrp', market_cap: 11015419620, price: 0.277815, volume: 192478592, circulating_supply: 39650153121, change: 0.24, is_mineable: false, created_at: now },
        { name: 'Bitcoin Cash ', symbol: 'bch', market_cap: 8427488266, price: 486.01, volume: 288908784, circulating_supply: 17340250, change: 3.15, is_mineable: true, created_at: now },
        { name: 'EOS', symbol: 'eos', market_cap: 4595875010, price: 5.07, volume: 652504532, circulating_supply: 906245118, change: 6.37, is_mineable: false, created_at: now },
        { name: 'Stellar', symbol: 'xlm', market_cap: 3650791948, price: 0.194364, volume: 53722400, circulating_supply: 18783274041, change: -0.02, is_mineable: false, created_at: now },
        { name: 'Litecoin', symbol: 'ltc', market_cap: 3225012430, price: 55.39, volume: 258898743, circulating_supply: 58226403, change: 4.60, is_mineable: true, created_at: now },
        { name: 'Tether', symbol: 'usdt', market_cap: 2759243451, price: 1.00, volume: 2521413987, circulating_supply: 2756421736, change: -0.20, is_mineable: false, created_at: now },
        { name: 'Cardano', symbol: 'ada', market_cap: 2003300188, price: 0.077267, volume: 3725883427, circulating_supply: 43369399, change: 1.55, is_mineable: false, created_at: now },
        { name: 'Monero', symbol: 'xmr', market_cap: 1789107919, price: 109.13, volume: 3725883427, circulating_supply: 38711507, change: 4.86, is_mineable: false, created_at: now },
      ]);
    });
};
