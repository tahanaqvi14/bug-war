import express  from 'express';
import dotenv from 'dotenv';// Load variables from .env
import connectDB from './DB/Connection.js'
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';

import usersRoute from './routes/usersRouter.js';



dotenv.config();
const app = express();
connectDB();

app.use(
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
      secure: process.env.NODE_ENV === 'development', 
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
);


app.use(express.json());
// It lets your server understand JSON in the request body.
//Think of it like a JSON translator between client and server.
//enable to read data from {req.body}
// for APIs

app.use(express.urlencoded({extended:true}));
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

app.use('/',usersRoute);
// This tells your server: “Whenever someone visits any URL that starts with /, use the usersRoute file to decide what to do.”


app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running: http://localhost:${process.env.PORT}`);
});