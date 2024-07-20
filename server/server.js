const express = require("express");
const cor = require("cors");
const ObjectId = require("mongodb").ObjectId;
const passport = require("passport");
require("./passport-auth");
const path = require("path");
const session = require("express-session");
const dotenv = require("dotenv");
const DataBase = require("./dataBase");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const key = require("./keys");
const http = require("http");
const IO = require("socket.io");
const aws = require("aws-sdk");
const sharp = require("sharp");
const axios = require("axios");
dotenv.config();

const db = new DataBase();
const app = express();
const server = http.createServer(app);
const io = IO(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});
let roomMap = {};

let url = key.mangodb.Url;

const storage = multer.memoryStorage();

const s3 = new aws.S3({
	accessKeyId: key.aws.accessKeyId,
	secretAccessKey: key.aws.secretAccessKey,
	region: key.aws.region,
});

app.use(
	cor({
		origin: "*",
		allowedHeaders: [
			"Content-Type",
			"Authorization",
			"Access-Control-Allow-Headers",
		],
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		credentials: true,
	})
);

app.use(express.static(path.join(__dirname,'..', 'build')))

app.use(
	session({
		secret: "your-secret-key",
		resave: false,
		saveUninitialized: true,
	})
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

const upload = multer({ storage });

io.on("connection", (socket) => {
	console.log("user Connected", socket.id);

	socket.on("join-room", (room) => {
		socket.join(room.room);
		socket.emit("joined", { room: room.room });
	});

	socket.on("message", async (message) => {
		db.Insert("chats", [
			{
				message: message.message,
				room: message.room,
				to: message.to,
				from: message.user,
				date: message.date,
			},
		]);

		if (message.room === message.currentChat) {
			let response = await db.Find("users", { email: message.user });
			let requiredData = response.map((ele) => {
				return { photo: ele.photos[0].value, displayName: ele.displayName };
			});
			socket.broadcast.to(message.room).emit("sendMessage", {
				message: message.message,
				room: message.room,
				from: {
					from: message.user,
					photo: requiredData[0].photo,
					displayName: requiredData[0].displayName,
				},
				to: message.to,
			});
			console.log("message from ", socket.id, {
				message: message.message,
				room: message.room,
				from: {
					from: message.user,
					photo: requiredData[0].photo,
					displayName: requiredData[0].displayName,
				},
			});
		} else {
			let response1 = await db.Find("users", { email: message.user });
			let requiredData1 = response1.map((ele) => {
				return { photo: ele.photos[0].value, displayName: ele.displayName };
			});

			let response2 = await db.Find("users", { email: message.to });
			let requiredData2 = await response2.map((ele) => {
				return { photo: ele.photos[0].value, displayName: ele.displayName };
			});
			await socket.broadcast.to(message.room).emit("sendMessage", {
				message: message.message,
				room: message.room,
				from: {
					from: message.user,
					photo: requiredData1[0].photo,
					displayName: requiredData1[0].displayName,
				},
				to: {
					to: message.to,
					photo: requiredData2[0].photo,
					displayName: requiredData2[0].displayName,
				},
			});
		}
	});

	socket.on("create-room", (message) => {
		let rooms = "";
		if (message.to < message.user) {
			rooms = message.to + message.user;
		} else {
			rooms = message.user + message.to;
		}
		if (!Object.keys(roomMap).includes(rooms)) {
			roomMap = {
				...roomMap,
				[rooms]: {
					room: rooms,
					users: [message.user, message.to],
				},
			};
			socket.join(rooms);
			socket.emit("joined in ", { room: rooms });
			io.to(message.to).emit("join-request", { to: message.to, room: rooms });
		}
	});

	socket.on("disconnect", (socket) => {
		console.log(`${socket.id} ${socket} is disconnected`);
	});
});

app.get("/", (req, res) => {
	console.log(path.join(__dirname,'build','index.html'))
	res.sendFile(path.join(__dirname,'..','build','index.html'),(err) => {
		if (err) {
		  res.status(500).send(err);
		}})
});

app.get(
	"/auth/google",
	passport.authenticate("google", {
		scope: ["profile", "email"],
	})
);

app.get(
	"/oauth2callback",
	passport.authenticate("google", { failureRedirect: "/" }),
	async (req, res) => {
		let emails = [];
		Object.keys(req.user.profile.emails).forEach((ele) => {
			emails.push(req.user.profile.emails[ele].value);
		});
		const userData = {
			id: req.user.profile.id,
			displayName: req.user.profile.displayName,
			firstName: req.user.profile.name.givenName,
			lastName: req.user.profile.name.familyName,
			email: emails,
			photos: req.user.profile.photos,
			projects: [],
			rating: 0,
		};
		await db.Find("users", { id: userData.id }).then((data) => {
			if (data.length < 1) {
				db.Insert("users", [userData]);
			} else {
				console.log("welcome back", userData.displayName);
			}
		});
		let response = {
			Authenticated: req.user ? true : false,
			userData,
		};
		res.status(200).send(
			`<script>
            window.opener.postMessage(${JSON.stringify(response)},"*")
            window.close()
        </script>`
		);
	}
);

app.get("/find/:key", async (req, res) => {
	try {
		let emails = [];
		let { key } = req.params;
		let query = { email: { $regex: key, $options: "i" } };
		let field = { _id: 1, email: 1 };
		let response = await db.Find("users", query, { field });
		response.forEach((ele) => {
			emails.push(ele.email);
		});
		emails = emails.flat();
		res.send(JSON.stringify(emails));
	} catch (e) {
		console.log(e);
		res.send([[]]);
	}
});

app.post("/update/project", async (req, res) => {
	let body = req.body;
	body.members.push(body.admin);
	let members = body.members;
	try {
		let query = {
			project_name: { $regex: `${body.project_name}`, $options: "i" },
			admin: body.admin,
			status: "Ongoing",
		};
		let field = {
			_id: 1,
		};

		let response = await db.Find("projects", query, field);

		if (response.length < 1) {
			let insertReturn = await db.Insert("projects", [body]);
			let insertedIds = insertReturn.insertedIds;
			let updateQuery = {
				$or: body.members.map((email) => ({ email: email })),
			};

			let updateValue = { $push: { projects: insertedIds[0] } };
			let updateReturn = await db.Update("users", updateQuery, updateValue);
			res.status(200).send({ message: "Project inserted successfully" });
		} else {
			res.status(200).json({
				message: `A project with name ${body.project_name} by ${body.admin} already exists`,
			});
		}
	} catch (e) {
		console.log(e);
		res.status(500).send("Internal Server Error");
	}
});

app.post("/markAsRead/:ProjectId", async (req, res) => {
	let projectId = new ObjectId(req.params.ProjectId);
	let { module_name, member_name } = req.body;
	try {
		let response = await db.Update(
			"projects",
			{
				_id: projectId,
				"tasks.member_name": member_name,
				"tasks.module_name": module_name,
			},
			{
				$set: {
					"tasks.$[elem].status": "Completed",
					"tasks.$[elem].progress": "100",
				},
			},
			{
				arrayFilters: [
					{
						"elem.member_name": member_name,
						"elem.module_name": module_name,
						"elem.status": { $exists: true },
					},
				],
			}
		);
		response = await db.Update(
			"users",
			{ email: member_name },
			{ $pull: { dependency: { module_name: module_name, _id: projectId } } }
		);
		response = await db.Update(
			"users",
			{},
			{ $pull: { dependency: { dependency: module_name, _id: projectId } } }
		);
		response = await db.Update(
			"users",
			{ email: member_name },
			{
				$pull: {
					tasks: {
						member_name: member_name,
						module_name: module_name,
						_id: projectId,
					},
				},
			}
		);

		res.status(200).send("Marked");
	} catch (e) {
		console.log("Error in morking complete ", e);
	}
});

app.get("/removeProject/:id", async (req, res) => {
	let { id } = req.params;
	console.log(id, req.params);
	id = new ObjectId(id);
	console.log(id);
	try {
		let response1 = await db.Delete("projects", { _id: id });
		let response2 = await db.Delete("users", { tasks: { $pull: { _id: id } } });
		let response3 = await db.Delete("users", {
			dependency: { $pull: { _id: id } },
		});
		res.sendStatus(200);
	} catch (e) {
		console.log("error in deleting the project", e);
		res.sendStatus(404);
	}
});
app.get("/projects/:userEmail", async (req, res) => {
	let { userEmail } = req.params;
	let results = await db.Find(
		"projects",
		{ members: userEmail },
		{ _id: 1, project_name: 1, grp_name: 1 }
	);
	let result = results.map((project) => {
		return {
			name: project.project_name,
			_id: project._id,
			project_name: project.project_name,
			grp_name: project.grp_name,
			members: project.members,
			admin: project.admin,
			status: project.status,
			start_date: project.start_date,
			end_date: project.end_date,
		};
	});
	res.status(200).json({ data: result });
});

app.get("/projects/getChat/:roomname", async (req, res) => {
	let roomname = req.params.roomname;
	try {
		let response = await db.Find(
			"chats",
			{ room: roomname },
			{ message: 1 },
			{ data: 1 }
		);
		console.log("response : ".response);
		res.status(200).json(response);
	} catch (e) {
		console.log("Error in getting the chat ", e);
	}
});

app.get("/projects/getChat/:from/:to", async (req, res) => {
	let { from, to } = req.params;
	try {
		let response1 = await db.Find(
			"chats",
			{ from: from, to: to },
			{ message: 1 },
			{ data: 1 }
		);
		let response2 = await db.Find(
			"chats",
			{ from: to, to: from },
			{ message: 1 },
			{ data: 1 }
		);
		let response = [...response1, ...response2].sort(
			(r1, r2) => new Date(r1.date) - new Date(r2.date)
		);
		res.status(200).json(response);
	} catch (e) {
		console.log("Error in getting the chat second ", e);
	}
});

app.get("/projects/completed/:id", async (req, res) => {
	let id = new ObjectId(req.params.id);
	try {
		let response = await db.Update(
			"projects",
			{ _id: id },
			{ $set: { status: "Completed" } }
		);
		response = await db.Update(
			"users",
			{ projects: id },
			{ $pull: { dependency: { _id: id } } }
		);
		console.log("response of update dependency : ", response);
		response = await db.Update(
			"users",
			{ projects: id },
			{ $pull: { dependency: { _id: id } } }
		);
		console.log("response of update other dependency : ", response);

		response = await db.Update(
			"users",
			{ projects: id },
			{ $pull: { tasks: { _id: id } } }
		);
		console.log("response of update other dependency : ", response);

		res.status(200).send("Marked");
	} catch (e) {
		console.log("Error in getting project completed", e);
		res.sendStatus(404);
	}
});

app.get("/projects/getImg/:id", async (req, res) => {
	let project_id = req.params.id;

	try {
		let response = await s3
			.getObject({
				Bucket: "pro-man-sys",
				Key: `${project_id}/${project_id + "_pic"}`,
			})
			.promise();
		let image = response.Body.toString("base64");
		let mimetype = response.ContentType;
		res.json({ image: `data:${mimetype};base64,${image}` });
	} catch (e) {
		res.sendStatus(404);
	}
});
app.post("/projects/upload/:id", upload.single("file"), async (req, res) => {
	let file = req.file;
	let project_id = req.params.id;
	let buffer = await sharp(file.buffer).resize(200, 200).toBuffer();

	const params = {
		Bucket: key.aws.bucketName,
		Key: `${project_id}/${project_id + "_pic"}`,
		Body: buffer,
		ContentType: file.mimetype,
	};

	try {
		await s3.upload(params).promise();
		res.send({
			message: "Uploaded",
			name: file.filename,
		});
	} catch (e) {
		console.log("Error in uploading to s3", e);
		res.sendStatus(400);
	}
});

app.get("/getRating/:email", async (req, res) => {
	let { email } = req.params;

	try {
		let response = await db.Find("users", { email: email }, { rating: 1 });
		let rating = response[0].rating;
		console.log(response, rating);
		res.status(200).json({ rating: rating });
	} catch (e) {
		console.log("error getting the rating", e);
		res.sendStatus(404);
	}
});

app.get("/getModules/:projectId", async (req, res) => {
	let ProjectId = new ObjectId(req.params.projectId);

	try {
		let response = await db.Find("projects", { _id: ProjectId }, { tasks: 1 });
		let module_name = response[0].tasks.map((ele) => {
			if (
				ele.status.toLowerCase() === "OnGoing".toLowerCase() &&
				Number(ele.progress) === 0
			) {
				return ele.module_name;
			} else {
				return null;
			}
		});
		module_name = module_name.filter((ele) => {
			if (ele === null) {
				return false;
			} else {
				return true;
			}
		});
		res.status(200).json(module_name);
	} catch (e) {
		console.log(e);
		res.sendStatus(404);
	}
});

app.post("/addTask/:id", async (req, res) => {
	let params = req.params.id;
	let body = req.body;
	let id = new ObjectId(params);
	try {
		let updateQuery = { _id: id };
		let updateValue = { $addToSet: { tasks: body } };
		let response = await db.Update("projects", updateQuery, updateValue);
		response = await db.Update(
			"users",
			{ email: body.member_name },
			{ $addToSet: { tasks: { ...body, _id: id } } }
		);

		res.status(200).send(`updated successfully`);
	} catch (e) {
		console.log("error in uploading to database /addTask", e);
	}
});

app.get("/addToS3/:id/:module_name", async (req, res) => {
	let { id, module_name } = req.params;
	try {
		let params = {
			Bucket: "pro-man-sys",
			Key: `${id}/${module_name}/`,
		};
		await s3.putObject(params).promise();
		res.sendStatus(200);
	} catch (e) {
		console.log("error in creatting folders", e);
	}
});

app.get("/removeS3Folder/:id/:module_name", async (req, res) => {
	let { id, module_name } = req.params;
	let folderKey = `${id}/${module_name}/`;
	try {
		let Listparams = { Bucket: "pro-man-sys", Prefix: `${id}/${module_name}/` };
		let listrOfObjects = await s3.listObjectsV2(Listparams).promise();

		if (listrOfObjects.Contents.length <= 1) {
			let deleteParams = {
				Bucket: "pro-man-sys",
				Key: folderKey,
			};
			await s3.deleteObject(deleteParams).promise();
		} else {
			let deleteParams = {
				Bucket: "pro-man-sys",
				Delete: { Objects: [] },
			};

			listrOfObjects.Contents.forEach(({ Key }) => {
				deleteParams.Delete.Objects.push({ Key });
			});

			await s3.deleteObjects(deleteParams).promise();
		}
		res.sendStatus(200);
	} catch (e) {
		console.log("Error in removing the objects bucket", e);
		res.sendStatus(400);
	}
});

app.get("/getS3Folder/:id/:module_name", async (req, res) => {
	let { id, module_name } = req.params;
	let folderKey = `${id}/${module_name}/`;
	try {
		let Listparams = { Bucket: "pro-man-sys", Prefix: folderKey };
		let listrOfObjects = await s3.listObjectsV2(Listparams).promise();
		let contents = await listrOfObjects.Contents;
		res.status(200).json({ contents: contents });
	} catch (e) {
		console.log("Errro in getting the folder ", e);
		res.status(400).json({ contents: null });
	}
});

app.post("/addS3Object", async (req, res) => {
	let { name } = req.body;
	try {
		let params = {
			Bucket: "pro-man-sys",
			Key: name,
		};
		await s3.putObject(params).promise();
		res.sendStatus(200);
	} catch (e) {
		console.log("Error in getting the Objects ", e);
		res.sendStatus(400);
	}
});

app.post("/updateS3Object", async (req, res) => {
	let { content, key } = req.body;
	try {
		let params = {
			Bucket: "pro-man-sys",
			Key: key,
			Body: content,
			ContentType: "text/plain",
		};
		await s3.putObject(params).promise();
		res.sendStatus(200);
	} catch (e) {
		console.log("Error in getting the Objects ", e);
		res.sendStatus(400);
	}
});
app.post("/removeS3Object", async (req, res) => {
	let { key } = req.body;
	console.log(key);
	try {
		let params = {
			Bucket: "pro-man-sys",
			Key: key,
		};
		await s3.deleteObject(params).promise();
		res.status(200).json({ res: "done" });
	} catch (e) {
		console.log("Error in removing the objects ", e);
		res.sendStatus(404);
	}
});

app.post("/getS3Object", async (req, res) => {
	let key = req.body.key;
	console.log(key);
	try {
		let params = {
			Bucket: "pro-man-sys",
			Key: key,
		};
		let response = await s3.getObject(params).promise();
		const fileContent = response.Body.toString("utf-8");
		res.send({ data: fileContent });
	} catch (e) {
		console.log("Error in the gettting the s3 object", e.message);
	}
});

app.post("/setTask/:id", async (req, res) => {
	let params = req.params.id;
	let body = req.body;
	let id = new ObjectId(params);
	try {
		let updateQuery = { _id: id };
		let updateValue = {
			$pull: {
				tasks: { member_name: body.member_name, module_name: body.module_name },
			},
		};
		let response = await db.Update("projects", updateQuery, updateValue);
		console.log("response of update task : ", response);
		response = await db.Update(
			"users",
			{ email: body.member_name },
			{ $pull: { dependency: { module_name: body.module_name, _id: id } } }
		);
		response = await db.Update(
			"users",
			{ email: body.member_name },
			{ $pull: { dependency: { dependency: body.module_name, _id: id } } }
		);
		res.status(200).send(`updated task successfully`);
	} catch (e) {
		console.log("error in uploading to database /addTask", e);
	}
});

app.get("/getTask/:id", async (req, res) => {
	let params = req.params.id;
	let id = new ObjectId(params);

	try {
		let response = await db.Find("projects", { _id: id }, { tasks: 1 });
		let tasks = response.map((grpName) => {
			return grpName.tasks;
		});
		res.status(200).send(tasks[0]);
	} catch (e) {
		console.log("Error in getTask", e);
		res.sendStatus(500);
	}
});

app.get("/users/:email", async (req, res) => {
	let emails = req.params.email;
	try {
		let response = await db.Find("users", { email: emails }, { email: 1 });
		let email = response.map((ele) => {
			return ele.email.flat();
		});
		res.status(200).json({ email: email.flat() });
	} catch (e) {
		console.log("Error in getting email ", e);
		res.sendStatus(500);
	}
});

app.get("/users/email/:email", async (req, res) => {
	let email = req.params.email;

	try {
		let response = await db.Find("users", { email: email }, { id: 1 });
		let id = response.map((ele) => {
			return ele.id;
		});
		res.status(200).json({ id: id[0] });
	} catch (e) {
		console.log("Error in getting id ", e);
		res.sendStatus(404);
	}
});

app.get("/:userid/remove/:module_name/:ProjectID", async (req, res) => {
	let { userid, module_name, ProjectID } = req.params;
	ProjectID = new ObjectId(ProjectID);
	try {
		let updateQuery = { id: userid };
		let updateValue = {
			$pull: { tasks: { module_name: module_name, _id: ProjectID } },
		};
		let response = await db.Update("users", updateQuery, updateValue);
		res.status(200).send("done");
	} catch (e) {
		console.log("Error in updating users task ", e);
		res.sendStatus(404);
	}
});

app.get("/users/tasks/:id", async (req, res) => {
	let id = req.params.id;

	try {
		let response = await db.Find("users", { id: id }, { tasks: 1 });
		let tasks = response.map((ele) => {
			return ele.tasks;
		});
		res.status(200).json({ tasks: [...tasks] });
	} catch (e) {
		console.log("Error in getting task of the user ", e);
	}
});

app.post("/users/:id/addDependency", async (req, res) => {
	let data = req.body;
	let id = req.params.id;
	data._id = new ObjectId(data._id);
	try {
		let response = db.Update(
			"users",
			{ id: id },
			{ $addToSet: { dependency: data } }
		);
		res.status(200).send("inserted");
	} catch (e) {
		console.log("Error in adding dependency ", e);
		res.send(500).send("error");
	}
});

app.use("/users/getProfile/:email", async (req, res) => {
	try {
		let response = await db.Find("users", { email: req.params.email });
		let requiredData = response.map((ele) => {
			return { photo: ele.photos[0].value, displayName: ele.displayName };
		});
		res.status(200).json(requiredData);
	} catch (e) {
		console.log("Error in getting the photos ", e);
		res.sendStatus(404);
	}
});

app.post("/setRating/:email", async (req, res) => {
	let { rating } = req.body;
	try {
		let response = await db.Find("users", { email: req.params.email });
		if (response.length > 0) {
			rating = (response[0].rating + rating) / 2;
		}
		await db.Update(
			"users",
			{ email: req.params.email },
			{ $set: { rating: rating } }
		);
		res.status(200).json({ message: "done" });
	} catch (e) {
		console.log(e);
		res.sendStatus(404);
	}
});
app.get("/getDependency/:id/:ProjectId/:module_name", async (req, res) => {
	let { id, ProjectId, module_name } = req.params;
	ProjectId = new ObjectId(ProjectId);
	try {
		let response = await db.Find("users", {
			id: `${id}`,
			dependency: { $elemMatch: { module_name: module_name, _id: ProjectId } },
		});
		if (response.length >= 1) {
			let dependency = response.map((user) => {
				return user.dependency.map((depen) => {
					if (
						ProjectId.equals(depen._id) &&
						module_name === depen.module_name
					) {
						return {
							dependency: depen.dependency,
							status: depen.status,
						};
					} else {
						return [];
					}
				});
			});

			dependency = dependency.flat().filter((ele) => {
				if (Array.isArray(ele) && ele.length < 1) {
					return false;
				} else {
					return true;
				}
			});
			res.status(200).json(dependency);
		} else {
			res.status(200).json([]);
		}
	} catch (e) {
		console.log("Error in getting dependency", e);
		res.sendStatus(404);
	}
});

app.post("/compile", async (req, res) => {
	const { source_code, language_id, stdin } = req.body;
	const encodedCode = Buffer.from(source_code).toString("base64");

	const options = {
		method: "POST",
		url: "https://judge0-ce.p.rapidapi.com/submissions",
		params: { base64_encoded: "true", fields: "*" },
		headers: {
			"content-type": "application/json",
			"x-rapidapi-host": "judge0-ce.p.rapidapi.com",
			"x-rapidapi-key": "4650c17130msh6a8f22f0625110cp136180jsn93d3d1b2afc7",
		},
		data: {
			source_code: encodedCode,
			language_id: language_id,
			stdin: Buffer.from(stdin).toString("base64"),
			expected_output: "",
			cpu_time_limit: "2",
			memory_limit: "128000",
		},
	};

	try {
		// Send the code to Judge0
		const response = await axios.request(options);
		const token = response.data.token;

		// Check the status of the submission
		const resultOptions = {
			method: "GET",
			url: `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
			params: { base64_encoded: "true", fields: "*" },
			headers: {
				"x-rapidapi-host": "judge0-ce.p.rapidapi.com",
				"x-rapidapi-key": "4650c17130msh6a8f22f0625110cp136180jsn93d3d1b2afc7",
			},
		};

		let resultResponse;
		do {
			resultResponse = await axios.request(resultOptions);
			console.log("in waitting queue");
		} while (resultResponse.data.status.description === "In Queue");

		// Send the result back to the client
		const output = Buffer.from(
			resultResponse.data.stdout || resultResponse.data.stderr || "No output",
			"base64"
		).toString("utf-8");
		res.json({ ...resultResponse.data, decodedOutput: output });
	} catch (error) {
		console.error(error);
		res.status(500).send("Error compiling code");
	}
});

server.listen(3000, () => {
	console.log("Server is listening in port 3000");
});
