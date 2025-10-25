import express from 'express';
import dotenv from 'dotenv';// Load variables from .env
import connectDB from './DB/Connection.js'
import cookieParser from 'cookie-parser';
// import { RedisStore } from 'connect-redis';
// import { createClient } from 'redis';
import expressSession from 'express-session';
import usertypeDefs from './models/user-type-def.js'
import challenge_typeDefs from './models/challenge-type-def.js'
import challenge_resolvers from './models/Challenges/challenge-resolvers.js'
import userresolvers from './models/User/user-resolvers.js'
import matchresolvers from './models/Match/match-resolvers.js'
import { mergeTypeDefs } from '@graphql-tools/merge';
import { mergeResolvers } from '@graphql-tools/merge';
import isloggedin from './middleware/isloggedIn.js';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { expressMiddleware } from '@as-integrations/express4';

// ✅ What expressMiddleware gives you:
// Single server (app.listen(...)) for REST and GraphQL
// Shared session/cookie/auth logic
import { ApolloServer } from '@apollo/server';
import cors from 'cors';

// so when user login so session is stored in server & session id is given to cookie and store in browser, when i open a anther page so cookie sent session to server to confirm the info.
export const typeDefs = mergeTypeDefs([
  usertypeDefs,
  challenge_typeDefs,
  // matchresolvers
]);

export const resolvers = mergeResolvers([
  userresolvers,
  challenge_resolvers,
  // matchresolvers
]);

const apolloserver = new ApolloServer({ typeDefs, resolvers });

await apolloserver.start();


dotenv.config();
const app = express();
connectDB();

const httpServer = http.createServer(app);

const sessionMiddleware =
  expressSession({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    //       What it means: "Only save the session if something changed"

    // Why set to false:

    // Better performance (avoids unnecessary saves)

    // Prevents race conditions (multiple writes for same session)

    // What happens if true:

    // Saves session to store on every request (wastes resources)


    saveUninitialized: false,
    // What it means: "Don't save empty sessions"

    // Why set to false:

    // Complies with privacy laws (GDPR)

    // Saves storage space

    // Prevents session flooding attacks

    // When it saves: Only when you modify req.session (e.g., req.session.user = ...)


    // cookie settings
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // Session expires in 1 day (optional)
      secure: process.env.NODE_ENV === 'production',
      // The cookie will only be sent if you're using a secure HTTPS connection (with the 🔒 lock in the browser
      // if secure value is false so Cookie will work on http:// too (like localhost)
      // if secure value is true so Cookie will only work on https:// (with the 🔒 lock in the browser) which means it will be used only on production server
      // in this case we have set NODE_ENV in .env file as production so this will be FALSE as we are using in development mode & when it is production ready so we will set it to TRUE.


      httpOnly: true,  // Blocks JavaScript cookie access (XSS protection)
      // When you use cookies in web apps (like when someone logs in), the browser stores a cookie — usually holding a session ID. That session ID is how your app remembers who the user is.
      //setting it true will block JavaScript from accessing the cookie, which helps protect against cross-site scripting (XSS) attacks.

      // Say your website has a security hole (a bug) called an XSS attack (Cross-Site Scripting).

      // What is XSS?
      // A hacker manages to inject their own malicious JavaScript into your webpage (maybe through a comment box or form).

      // That JavaScript could try to do: "document.cookie"
      // to steal the user's session cookie.
      // If that cookie holds the session ID, the hacker can pretend to be that user and access their account.

      //by setting it to true the cookie is invisble.



      sameSite: 'lax'  // Prevents CSRF attacks (use 'strict' for sensitive apps)
      // I open a legit site, and it stores a cookie in the browser. Then I visit a bogus website where the hacker has written invisible code that triggers the browser to send a request to the legit site to perform some action. The browser checks the SameSite setting on the cookie and decides whether or not to include the cookie in the request. If SameSite=Strict, the request is still sent — but without the cookie, so the action fails.

      //There are 3 option in this: none,strict,lax
      //none: the cookie will be sent in all requests, including cross-site requests.

      //Scenerio: I am already logged in to:myreal website then  see the following result

      // STRICT MODE
      // if i come to website by clicking a link or button so i will be logged out 
      // ✅ Browser does send the request to yourbank.com
      // ❌ BUT browser does NOT send the cookie
      // 🚫 So the bank doesn’t know who you are
      // 🧊 You’re treated as logged out
      // SameSite=Strict = You must already be on the site for the cookie to work.
      // If you came from another site (even by clicking a link), cookie gets blocked ❌



      // LAX MODE
      //if i come to website by clicking a link or button so i will still be logged in.
      // 🔐 Still protected from CSRF

    }
  })

app.use(sessionMiddleware);

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  }
});

// io.use(...)
// This tells your Socket.IO server:
// “Before allowing a new client to connect, run this function first.”

// (socket, next) => { ... }
// This is the function that runs for every new client connection.
// socket means the connection info from the client.

// next means “go ahead and connect” or “stop because of error.”

// sessionMiddleware(socket.request, {}, next)
// This runs your Express session code on the socket’s HTTP request.
// It reads the cookie from the client’s connection.
// It finds the user’s session (the info saved when they logged in).
// It attaches that session info to socket.request.session.
// Calls next() to let the connection proceed.

// Reject unauthorized users.

io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next); //socket.request → the underlying HTTP request that initiated the WebSocket upgrade. Other connection metadata.  
});


// Store metadata for rooms here
const roomData = {};
const players = {}
const roomName = ['room1', 'room2'];

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)
  console.log(socket.request.session.user.username)
  socket.on('joinRoom', async () => {
    for (let index = 0; index < roomName.length; index++) {
      const roomname = roomName[index];
      const username = socket.request.session.user.username
      socket.emit('welcome', { username });

      if (roomData[roomname] && io.sockets.adapter.rooms.get(roomname)) {
        if (io.sockets.adapter.rooms.get(roomname).size < 2 && roomData[roomname].status == 'waiting') {   // used to retrieve a Set of socket.ids that are currently connected to a specific room.
          socket.join(roomname);
          players.player2 = {
            username: socket.request.session.user.username,
            socketID: socket.id,
            score: 0,
            room: roomname,
          }
          roomData[roomname].players.push(players.player2)
          roomData[roomname].status = 'ready';
          let roominfo=roomData[roomname];
          let usernames=roominfo.players.map(player => player.username)

          const matchinfo = await matchresolvers.Mutation.createMatch(
            null, // parent
            { input: usernames}, // args
          )
          
          io.to(roomname).emit('2players_connected',{ matchinfo });

          const playerData = roomData[roomname].players.map(p => ({
            username: p.username,
            score: p.score
          }));

          setTimeout(() => {
            io.to(roomname).emit('Gaming_screen', { playerData });
          }, 6000);

          break;
        }
      } else if (Object.keys(roomData).length == 2) {
        console.log('No rooms are available this time')
      } else {
        // console.log('soketname', socket.request.session.user.username)
        socket.join(roomname);
        roomData[roomname] = {
          players: [],
          status: 'waiting',
        };
        players.player1 = {
          username: socket.request.session.user.username,
          socketID: socket.id,
          score: 0,
          room: roomname,
        };
        roomData[roomname].players.push(players.player1)
        break;
      }
    }
  });

  socket.on('disconnect', () => {
    console.log(`User ${socket.id} disconnected. Reason:`);
    for (let index in roomData) {
      const index1 = roomData[index].players.findIndex(
        p => p.socketID == socket.id
      );

      if (index1 > -1) {
        roomData[index].players.splice(index1, 1);

        if (roomData[index].players.length == 0) {
          delete roomData[index];
        } else {
          // io.to(index).emit('other_player_left');
        }
      }
    }
  })

  socket.on('move_forward', () => {
    for (let index in roomData) {
      const index1 = roomData[index].players.findIndex(
        p => p.socketID == socket.id
      )

      if (index1 > -1) {
        if (roomData[index].players[index1].score == 50) {
          io.to(index).emit('end_for_all');
          break;
        }

        roomData[index].players[index1].score += 10;
        // console.log(index1);

        const playerData = roomData[index].players.map(p => ({
          username: p.username,
          score: p.score
        }))
        io.to(index).emit('Gaming_screen', { playerData });
        break;
      }

    }
  })



});

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
// It lets your server understand JSON in the request body.
//Think of it like a JSON translator between client and server.
//enable to read data from {req.body}
// for APIs

app.use(express.urlencoded({ extended: true }));
// Lets your server read form data from <form> submissions (like from login/signup pages).
//If extended: false: only allows simple objects
// If extended: true: allows nested objects (like user[name]=sarthak)
//Think: Used for HTML forms (vs. express.json() which is for APIs)

app.use(cookieParser())
// 🍪 Lets you read cookies from incoming requests
//Without cookieParser(): req.cookies  // → undefined ❌
//With it: req.cookies  // → { sessionId: 'abc123', theme: 'dark' } ✅

// app.use(express.static(path.join(__dirname,'public')))
// Tells Express: “Anything inside /public folder is available to the browser.


// This tells your server: “Whenever someone visits any URL that starts with /, use the usersRoute file to decide what to do.”


//This attaches your Apollo Server (your GraphQL engine) to your Express app.
// So now, Express knows:
// "When a request comes to / , Apollo Server will take over and respond to it."


app.use('/graphql', expressMiddleware(apolloserver, {
  context: async ({ req, res }) => {
    // This part builds a contex object that will be passed to all your GraphQL resolvers (the functions that return data).
    // Inside here, you can access:
    // req — the incoming request (includes headers, session, cookies, etc.)
    // return { req, user: req.session?.user };
    const loggedIn = await isloggedin(req);
    return { req, res, loggedIn };

    // If the session exists, get the user from it. If not, return undefined.”
  },
}));


httpServer.listen(process.env.PORT, () => {
  console.log(`🚀 Server running: http://localhost:${process.env.PORT}`);
});