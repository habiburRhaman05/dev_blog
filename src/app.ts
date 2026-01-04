import express, { type Express, type Request, type Response } from 'express';
import { connectToDatabase } from './config/db';
import { applyMiddleware } from './middleware';
import { envConfig } from './config/env';
import { notFound } from './middleware/notFound';
import { errorHandler } from './middleware/errorHandler';
import postRouter from './modules/post/post.router';
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth';
import userRouter from './modules/user/user.router';
import { corsConfig } from './config/cors';
import cors from "cors"
import commentRouter from './modules/comment/comment.router';
import postControllers from './modules/post/post.controller';

const app: Express = express();
app.use(cors(corsConfig))
app.all('/api/auth/*splat', toNodeHandler(auth));
app.use(express.json({ limit: '1mb' }));
app.use("/api/v1/post",postRouter)
app.use("/api/v1/user",userRouter)
app.use("/api/v1/comment",commentRouter)
app.set("trust proxy", 1);
app.get("/welcome-page",(req,res)=>{
  res.send("welcome to our my app")
})
// app.get("/welcome-page",postControllers.getAllPosts)
export const startServer = async () => {

try {

    applyMiddleware(app);

    const PORT = envConfig.PORT || 5000;
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`🚀 Server is running on port ${PORT}`);
    });


  } catch (error) {
    console.error('❌ Error initializing app:', error);
    process.exit(1);
  }
};
app.use(notFound);
app.use(errorHandler);


export default app;
