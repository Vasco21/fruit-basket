module.exports = (dataBase) => {

    const pool = dataBase;

    var fruitBasket = async function(basket){
        var fruitBasket = [
            basket.fruitName,
            basket.qty,
            basket.fruitPrice
        ];

        const fruitType = await pool.query('SELECT fruit_type FROM fruit_basket WHERE fruit_type = $1', [basket.fruitName]);
        if(fruitType.rowCount === 0){
            await pool.query('INSERT INTO fruit_basket (fruit_type, qty, fruit_price) VALUES ($1, $2, $3)', fruitBasket); 
        }
    }

    var getfruitBasket = async function(){
        const getFruit = await pool.query('SELECT fruit_type, qty, fruit_price FROM fruit_basket');
        return getFruit.rows;
    }

    var getQty = async function(number){
        const amount = await pool.query('SELECT qty FROM fruit_basket WHERE fruit_type = $1', [number]);
        return amount.rows[0].qty
    }

    var findAll = async function(fruit_type){
        const findFruit = await pool.query('SELECT fruit_type,qty ,fruit_price FROM fruit_basket WHERE fruit_type = $1', [fruit_type]);
        return findFruit.rows[0];
    }
    
    var updateNumFruit = async function(update){
        var updateNum = [update.fruitName, update.qty] 
        await pool.query('UPDATE fruit_basket SET qty = qty + $2 WHERE fruit_type = $1', updateNum)
    }

    var sumTotal = async function(totalPrice){
        const price = await pool.query('SELECT fruit_type, (qty * fruit_price) AS total_price FROM fruit_basket WHERE fruit_type = $1', [totalPrice]);
        return price.rows[0];
    }


    return{
        fruitBasket,
        getfruitBasket,
        getQty,
        findAll,
        updateNumFruit,
        sumTotal
    } 


}