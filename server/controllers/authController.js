const pool = require("../db");
const bcrypt = require("bcrypt");
module.exports.handlelogin=(req,res)=>{
    if (req.session.user && req.session.user.username) {
        res.json({ loggedIn: true, username: req.session.user.username });
      }else{
        res.json({loggedIn:false})
      }
}
module.exports.attemptLogin=async(req,res)=>{
    const potentialLogin = await pool.query(
        "SELECT id, username, passhash FROM users u WHERE u.username=$1",
        [req.body.username]
      );
    
      if (potentialLogin.rowCount > 0) {
        const issamapass = await bcrypt.compare(
          req.body.password, // Compare password
          potentialLogin.rows[0].passhash
        );
    
        if (issamapass) {
          req.session.user = {
            username: req.body.username,
            id: potentialLogin.rows[0].id,
          };
          res.json({
            loggedIn: true,
            username: req.body.username,
          });
          console.log("logged in")
        } else {
          res.json({
            loggedIn: false,
            status: "Wrong password or username",
          });
          console.log("Invalid login attempt: wrong password.");
        }
      } else {
        res.json({
          loggedIn: false,
          status: "Wrong password or username!",
        });
        console.log("Invalid login attempt: user not found.");
      }
}
module.exports.attemptRegister= async (req, res) => {
    const existingUser = await pool.query(
      "SELECT username FROM users WHERE username = $1",
      [req.body.username]
    );
  
    if (existingUser.rowCount === 0) {
      const hashedpass = await bcrypt.hash(req.body.password, 10);
      const newUserQuery = await pool.query(
        "INSERT INTO users(username, passhash) VALUES($1, $2) RETURNING id, username",
        [req.body.username, hashedpass]
      );
  
      req.session.user = {
        username: req.body.username,
        id: newUserQuery.rows[0].id,
      };
      res.json({ loggedIn: true, username: req.body.username });
    } else {
      res.json({ loggedIn: false, status: "Username taken" });
    }}