const users= require('./Users')
const data = require('./forumsData.json')
const fs = require('fs');
const express = require('express');
const { response } = require('express');
const cors = require('cors');

const app = express();

app.use(express.json())
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  next();
});

// ***** data file ***** //

const writeData = () =>{
	process.nextTick( () => 
		fs.writeFile('./forumsData.json', JSON.stringify(data), (err) =>{
			if(err){
				next(err)
			}
		})
	)

}

// ***** error helper ***** //
const createError = (code, msg, data) => {
	const err = new Error(msg)
	err.statusCode = code
	err.data = data || "";
	return err;
}

// ***** Users ***** //
const readUsers = (req, res, next) => {
	const users = data.users;
	res.status(200).json({users});
}

const createUser = (req, res, next) => {
	const {user} = req.body;

	if(!user){
		throw createError(400, "invalid user", user || "");
	}
	user.id = new Date().getTime();
	user.favrites = []
	data.users.push(user);
	writeData();
	res.status(201).json({user});
}

const readUser = (req, res, next) => {
	const {userId} = req.params;
	const user = data.users.find(u => u.id === +userId);
	if(user){
		res.status(200).json({user});
	} else {
		res.status(404).json({msg: `user id ${userId} was not found`})
	}
}

const updateUser = (req, res, next) => {
	const {userId} = req.params;
	const {user} = req.body;

	if(!user || !userId){
		res.status(400).json({msg: "invalid user"});
	}
	const userIndex = data.users.findIndex(u => u.id === +userId);
	user.id = +userId
	user.favorites = data.users[userIndex].favorites;
	data.users[userIndex] = user;
	writeData();
	res.status(200).json({user});
}

const deletetUser = (req, res, next) => {
	const userId = req.params;
	if(!userId){
		res.status(400).json({msg: "invalid userId"});
		return;
	}
	const user = data.users.find(u => u.id === +userId);
	if(!user ){
		throw createError(404, "User was not found", userId);
	}
	data.users = data.users.filter(u => u.id !== userId);
	writeData();
	res.status(200).json({user});
}

const loginUser = (req, res, next) => {
	const {username, password} = req.body;
	if(!username || !password){
		res.status(400).json({msg: "invalid username or password"});
		return;
	}
	const user = data.users.find(u => u.email === username);
	if(!user){
		res.status(404).json({msg: `User ${username} was not found`});
		return;
	}
	if(user.password !== password){
		res.status(401).json({msg: `Invalid password for ${username}`});
		return;
	}
	res.status(200).json({user: user});
}

const readUserFav = (req, res, next) => {
	const {userId} = req.params;
	const user = data.users.find(u => u.id === +userId);

	if(!user){
		res.status(404).json({msg: `user id ${userId} was not found`})
		return;
	}
	const comments = []
	user.favorites.forEach(fav => {
		const forum = data.forums.find(f => f.id === fav.forumId)
		const comment = forum.comments.find(c => c.id ===fav.commentId)
		comments.push(comment);
	})
	res.status(200).json({favorites:comments});
}

const addFavComment = (req, res, next) => {
	const {userId} = req.params;
	const {forumId, commentId} = req.body;

	if(!userId){
		res.status(400).json({msg: "invalid userId"});
		return;
	}
	const user = data.users.find(u => u.id === +userId)
	if(!user){
		res.status(404).json({msg: `Could not find user ${userId}`});
		return;
	}
	
	user.favorites.push({forumId, commentId})
	res.status(200).json({forumId, commentId});
}
const removeFavComment = (req, res, next) => {

}


// ***** Comments ***** //
const readComments = (req, res, next) => {
	const {forumId} = req.params;
	const forum = data.forums.find(f => f.id === +forumId)
	if(!forum || ! forumId){
		throw createError(404, `forum ${forumId} was not found`)
	}
	res.json({comments: forum.comments})
}
const createComment = (req, res, next) => {
	
}
const readComment = (req, res, next) => {
	
}
const updateComment = (req, res, next) => {

}
const deletetComment = (req, res, next) => {

}

// ***** Forms ***** //
const readForums = (req, res, next) => {
	const forums = data.forums;
	res.status(200).json({forums});
}
const createForum = (req, res, next) => {
	const forum = req.body;
	console.log(forum)
	if(!forum.name){
		throw createError(400, "invalid forum", forum);
	}
	forum.id = new Date().getTime();
	forum.comments = [];
	data.forums.push(forum);
	writeData();
	res.status(201).json({forum});
}
const readForum = (req, res, next) => {
	const {forumId} = req.params;
	if(!forumId){
		throw createError(400, "invalid forumId", forumId);
	}
	const forum = data.forums.find(f => f.id === +forumId);
	if(!forum){
		throw createError(404, `forumId ${forumId} was not found`, forumId);
	}	
	res.status(200).json({forum});
}

const updateForum = (req, res, next) => {
	const {forumId} = req.params;
	const forum = req.body;

	if(!forum.name || !forumId){
		throw createError(400, "invalid forum", {forumId, forum});
	}
	const forumPos = data.forums.findIndex(f => f.id === +forumId)
	if(forumPos === -1){
		throw createError(404, "forum was not found", {forumId, forum});
	}
	forum.id = forumId
	forum.comments = data.forums[forumPos].comments
	data.forums[forumPos] = forum;
	writeData();
	res.status(201).json({forum});
}
const deletetForum = (req, res, next) => {

}

// ***** general error handler ***** //
app.use((error, req, res, next) => {
	if(!error.statusCode || error.statusCode === 500){
		console.log(error);
	}
  const statusCode = error.statusCode || 500;
  const message = error.msg;
  const data = error.data || "";

  res.status(statusCode).json({ok:false, message, data });
});

app.use("/users", users);
app.get("/forums", readForums);
app.get("/forums/:forumId", readForum);
app.post("/forums", createForum);
app.put("/forums/:forumId", updateForum);
// app.delete("/forums/:forumId", deletetForum);


app.get("/users", readUsers);
app.get("/users/:userId", readUser);
app.post("/users", createUser);
app.put("/users/:userId", updateUser);
// app.delete("/users/:userId", deletetUser);

app.get("/users/:userId/fav", readUserFav);
app.post("/users/:userId/fav", addFavComment);
app.delete("/users/:userId/fav/:favId", deletetUser);
// app.post("/login", loginUser);


app.get("/forums/:forumId/comments", readComments);
app.get("/forums/:forumId/comments/:commentId", readComment);
app.post("/forums:fourmId/comments", createComment);
app.put("/forums/:forumId/comments/:commentId", updateComment);
app.delete("/forums/:forumId/comments/:commentId", deletetComment);

app.listen(5000)