const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'root',
  port: 5432,
});

const getFacilities = () => {
  return new Promise(function(resolve, reject) {
    pool.query('SELECT * FROM facility ORDER BY facilityid ASC', (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  }) 
}

const createFacility = (body) => {
  return new Promise(function(resolve, reject) {
    const { facilityname,location,phonenumber,emailaddress } = body
    pool.query('INSERT INTO facility (facilityname,location,phonenumber,emailaddress) VALUES ($1, $2, $3, $4) RETURNING *', [facilityname,location,phonenumber,emailaddress], (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(`A new facility has been added: ${results.rows[0]}`)
    })
  })
}

const deleteFacility = () => {
  return new Promise(function(resolve, reject) {
    const id = parseInt(request.params.facilityid)
    pool.query('DELETE FROM facility WHERE facilityid = $1', [facilityid], (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(`Facility deleted with ID: ${id}`)
    })
  })
}



module.exports = {
  getFacilities,
  createFacility,
  deleteFacility,
}