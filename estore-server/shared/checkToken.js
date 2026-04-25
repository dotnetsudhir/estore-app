const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    console.log("TOKEN 👉", token);

    const decoded = jwt.verify(token, 'estore-secret-key');
                                      
    console.log("DECODED 👉", decoded);

    next();
  } catch (error) {
    console.log("JWT ERROR 👉", error.message);  // 🔥 IMPORTANT
    res.status(401).send({ message: 'Authorization failed', error: error.message });
  }
};
// const jwt = require('jsonwebtoken');
// module.exports = (req, res, next) => {
//     try{
//     const token = req.headers.authorization;
//     console.log("TOKEN RECEIVED 👉", req.headers.authorization);
//     if(!token){
//         return res.status(401).send({message: 'No token provided'});
//     }

//     if(token.startsWith('Bearer')){
//         token = token.split(' ')[1];
//     }
//     console.log("After:", token);

//     jwt.verify(token, 'estore-secret-key');
//     next()
//     }
//     catch(error) {
//         res.status(401).send({ message: 'Authorization failed'});
//     }
// }