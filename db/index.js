const pg = require('pg')
const uuid = require('uuid')
const bcrypt = require('bcrypt')

const client = new pg.Client(`postgres://localhost/${process.env.DB_NAME}`)

const createTables = async () => {
  const SQL = /*SQL*/ `
    DROP TABLE IF EXISTS favorite;
    DROP TABLE IF EXISTS product;
    DROP TABLE IF EXISTS users;

    CREATE TABLE users(
      id UUID PRIMARY KEY,
      username VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(100) NOT NULL
    );
    CREATE TABLE product(
      id UUID PRIMARY KEY,
      name VARCHAR(100) 
    );
    CREATE TABLE favorite(
      id UUID PRIMARY KEY,
      product_id UUID REFERENCES products table NOT NULL,
      user_id UUID REFERENCES users(id) NOT NULL, 
      Product_id UUID REFERENCES product(id) NOT NULL
    );
    `
  await client.query(SQL);
}

const createUser = async ({username, password}) => {
  const SQL = /*SQL*/ `
    INSERT INTO users(id, username, password) VALUES($1, $2, $3) RETURNING *;
  `
  const response = await client.query(SQL, [uuid.v4(), username, await bcrypt.hash(password, 10)]);
  return response.rows[0];
}



const createProduct = async ({ name }) => {
  const SQL = /*SQL*/ `INSERT INTO product(id, name) VALUES($1, $2) RETURNING *`
  const response = await client.query(SQL, [uuid.v4(), name])
  return response.rows[0]
}

const fetchUsers = async () => {
  const SQL = /*SQL*/ `SELECT * from users`
  const response = await client.query(SQL);
  return response.rows
}

const fetchProduct = async () => {
  const SQL = /*SQL*/ `SELECT * from product`
  const response = await client.query(SQL);
  return response.rows
  }

const createUserProduct = async ({user_id, Product_id}) => {
  const SQL = /*SQL*/ `INSERT INTO favorite(id, user_id, Product_id) VALUES($1, $2, $3) RETURNING *;`
  const response = await client.query(SQL, [uuid.v4(), user_id, Product_id])
  return response.rows[0];
}

const fetchUserproduct = async (user_id) => {
  const SQL = /*SQL*/ `SELECT * from favorite WHERE user_id='${user_id}'`
  const response = await client.query(SQL);
  return response.rows
}

const destroyUserProduct = async ({user_id, Product_id}) => {
  const SQL = /*SQL*/ `DELETE * from favorite WHERE user_id='${user_id}' AND Product_id='${Product_id}'`;
const response = await client.query(SQL);


}
 /*
*/

const seed = async () => {

  await Promise.all([
    createUser({username: 'iheartcoding', password: 'p@ssword'}),
    createUser({username: 'vanessa', password: 'pwd1234'}),
    createUser({username: 'jeff', password: 'p.w.d.'}),
    createProduct({name: 'Shampoo'}),
    createProduct({name: 'Chipotle'}),
    createProduct({name: 'Chewy'})
  ]); 

  const users =  await fetchUsers()
  console.log('Users are ', await fetchUsers())
  const product = await fetchProduct()
  console.log('product are ', await fetchProduct())
  await Promise.all([
    createUserProduct({user_id: users[0].id, Product_id: product[2].id}),
    createUserProduct({user_id: users[1].id, Product_id: product[1].id}),
    createUserProduct({user_id: users[2].id, Product_id: product[0].id})
  ])
  console.log('User product ', await fetchUserproduct(users[0].id))
}

module.exports = {
  client,
  createTables,
  createUser,
  createProduct,
  fetchUsers,
  fetchProduct,
  fetchUserproduct,
  createUserProduct,
  destroyUserProduct,
  seed,
}