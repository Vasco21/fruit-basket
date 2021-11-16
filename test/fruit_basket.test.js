let assert = require('assert');
const fruitBasketFuction = require("./../fruitBasketFuction.js");
const pg = require("pg");
const Pool = pg.Pool;


const connectionString = process.env.DATABASE_URL || 'postgresql://coder:pg123@localhost:5432/myfruit';

const pool = new Pool({
	connectionString,
	ssl : {
		rejectUnauthorized:false
	}
});

var Basket = fruitBasketFuction(pool);

describe('Fruit basket' , function(){
	beforeEach(async function(){
		await pool.query('DELETE FROM fruit_basket;');
	});

	it('Should create a new fruit basket for a given fruit type, qty & fruit price', async function(){
        await Basket.fruitBasket({fruitName: 'Orange', qty: 10, fruitPrice: 3.00});
			
		assert.deepEqual([{fruit_type: 'Orange', qty: 10, fruit_price: 3.00}], await Basket.getfruitBasket());
	});

    it('Should find all the fruit baskets for a given fruit type', async function(){
        await Basket.fruitBasket({fruitName: 'Orange', qty: 10, fruitPrice: 2.50});
		await Basket.fruitBasket({fruitName: 'Grape', qty: 15, fruitPrice: 1.50});
		await Basket.fruitBasket({fruitName: 'Apple', qty: 5, fruitPrice: 2.00});

		assert.deepEqual({fruit_type: 'Grape', qty: 15, fruit_price:1.50}, await Basket.findAll('Grape'));
		assert.deepEqual({fruit_type: 'Orange', qty: 10, fruit_price:2.50}, await Basket.findAll('Orange'));
		assert.deepEqual({fruit_type: 'Apple', qty: 5, fruit_price:2.00}, await Basket.findAll('Apple'));       
    })

    it('Should update the number of fruits in a given basket', async function(){
        
        await Basket.fruitBasket({fruitName: 'Banana', qty: 5, fruitPrice: 4.50});

		await Basket.updateNumFruit({fruitName: 'Banana', qty:9});

		assert.deepEqual({fruit_type: 'Banana', qty: 14, fruit_price: 4.50}, await Basket.findAll('Banana'));
	});

    it('Should show the total price for a given fruit basket', async function(){
        await Basket.fruitBasket({fruitName: 'Mango', qty: 5, fruitPrice: 4.50});
	
		assert.deepEqual({fruit_type: 'Mango', total_price: 22.50}, await Basket.sumTotal('Mango'));
	});


	it('Should show the sum of the total of the fruit baskets for a given fruit type', async function(){
		await Basket.fruitBasket({fruitName: 'Avocados', qty: 10, fruitPrice: 2.50});

		assert.deepEqual(10, await Basket.getQty('Avocados'));
	})
	after(function(){
		pool.end();
	});
});