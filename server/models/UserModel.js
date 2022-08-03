const { Pool } = require('pg');
const { PG_URI } = require('../secrets');

//Object with connectionString to our postgresURL
const pool = new Pool({
  connectionString: PG_URI
});


//Export object with query method
module.exports = {
  // query (as specified in userController) params ($1, etc.), callback (???)
  // ex: const text = 'SELECT id FROM residents WHERE email = $1';
  // const idFound = await db.query(text, [email]);
  
  query: (text, params, callback) => {
    console.log('Query: ', text);
    return pool.query(text, params, callback);
  }
}


// Not an impacting changegit 
// in terminal: npm i psql
// psql <connect string>
// \d (will get the list of dbs relations)


            // List of relations
// Schema |        Name        |   Type   |  Owner   
// --------+--------------------+----------+----------
// public | pg_stat_statements | view     | postgres
// public | residents          | table    | llrsxwel
// public | residents_id_seq   | sequence | llrsxwel


                                                            // Residents table Schema

//   Column      |          Type          | Collation | Nullable |                Default                | Storage  | Stats target | Description 
// --------------+------------------------+-----------+----------+---------------------------------------+----------+--------------+-------------
//  id           | integer                |           | not null | nextval('residents_id_seq'::regclass) | plain    |              | 
//  name         | character varying(100) |           | not null |                                       | extended |              | 
//  photo        | character varying(250) |           |          |                                       | extended |              | 
//  cohort       | character varying(150) |           | not null |                                       | extended |              | 
//  organization | character varying(150) |           |          |                                       | extended |              | 
//  linkedin     | character varying(150) |           | not null |                                       | extended |              | 
//  message      | character varying(100) |           |          |                                       | extended |              | 
//  email        | character varying(100) |           |          |                                       | extended |              | 
// Indexes:



// SELECT * FROM residents;

//  id |          name          |                                                                photo                                                                 | cohort  | organization |                      linkedin                       |   message   |            email            
// ----+------------------------+--------------------------------------------------------------------------------------------------------------------------------------+---------+--------------+-----------------------------------------------------+-------------+-----------------------------
//  89 | Crystal Agoncillo, MPA |                                                                                                                                      | FTRI 10 | undefined    | https://www.linkedin.com/in/agoncillo/              |             | crystal.agoncillo@gmail.com
//  73 | Tyler Wilson           | https://hips.hearstapps.com/wdy.h-cdn.co/assets/17/39/cola-0247.jpg                                                                  | FTRI 10 | Google       | https://www.linkedin.com/in/tyler-wilson-bb029b24/  | Now hiring! | wilsontyler95@gmail.com
//  82 | David Jakubiec         | https://hips.hearstapps.com/ghk.h-cdn.co/assets/17/30/pembroke-welsh-corgi.jpg?crop=1xw:0.9997114829774957xh;center,top&resize=480:* | FTRI 10 | Apple        | www.linkedin.com/in/david-jakubiec-16783384         |             | dj38@zips.uakron.edu
//  81 | Nicholas Krug          | https://www.dogandpuptown.com/wp-content/uploads/2018/11/featured.jpg                                                                | FTRI 10 | Google       | https://www.linkedin.com/in/nicholas-krug-a7a6a067/ | No vacancy. | n.e.krug@gmail.com
//  86 | Seok Jung              | https://cdn.discordapp.com/attachments/1002601884323950764/1003807856916713572/1647874988610.jpg                                     | FTRI 10 | Yahoo        | undefined                                           |             | andrewjung89@icloud.com
//  87 | Luke Roberts           |                                                                                                                                      | FTRI 10 | Codesmith    |                                                     |             | d94cowboys@gmail.com
//  88 | Samee Vohra            |                                                                                                                                      | FTRI 10 | Codesmith    | https://www.linkedin.com/in/sameev/                 |             | eemas91@hotmail.com




// Residents table in database
// residents (
// 	  id serial PRIMARY KEY,
// 	  name varchar( 100 )  NOT NULL,
//    photo varchar( 150 ),
// 	  cohort varchar( 150 ) NOT NULL,
//    organization varchar( 150 ),
//    linkedin varchar( 150 ) NOT NULL
// );













// MAYBE
// case 'species':
//       const { classification, average_height, average_lifespan, language, homeworld } = details;
//       info = (
//         <ul className="modalList">
//           <li className="modalDetail">Classification: {classification}</li>
//           <li className="modalDetail">Average Height: {average_height}</li>
//           <li className="modalDetail">Average Lifespan: {average_lifespan}</li>
//           <li className="modalDetail">Language: {language}</li>
//           <li className="modalDetail">Homeworld: {homeworld}</li>
//         </ul>
//       );
//       break;
//     case 'homeworld':
//       const { rotation_period, orbital_period, diameter, climate, gravity, terrain, surface_water, population } = details;
//       info = (
//         <ul className="modalList">
//           <li className="modalDetail">Rotation Period: {rotation_period}</li>
//           <li className="modalDetail">Orbital Period: {orbital_period}</li>
//           <li className="modalDetail">Diameter: {diameter}</li>
//           <li className="modalDetail">Climate: {climate}</li>
//           <li className="modalDetail">Gravity: {gravity}</li>
//           <li className="modalDetail">Terrain: {terrain}</li>
//           <li className="modalDetail">Surface Water: {surface_water}</li>
//           <li className="modalDetail">Population: {population}</li>
//         </ul>
//       );
//       break;
//     case 'film':
//       const { episode_id, director, producer, release_date } = details;
//       info = (
//         <ul className="modalList">
//           <li className="modalDetail">Episode: {episode_id}</li>
//           <li className="modalDetail">Director {director}</li>
//           <li className="modalDetail">Producer: {producer}</li>
//           <li className="modalDetail">Release Date: {new Date(release_date).toDateString().slice(4)}</li>
//         </ul>
//       );
//       break;
//     default:
//       info = (<p>Unexpected modal type</p>);
// >>>>>>> a5cbb72 (initial commit)
//   }
