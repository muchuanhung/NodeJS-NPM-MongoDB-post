const http = require("http");
const Post = require("./models/post.js");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.MONGODB_PASSWORD
);
// 連接資料庫
mongoose
  .connect(DB)
  .then(() => {
    console.log("資料庫連線成功");
  })
  .catch((error) => {
    console.log(error);
  });

const requestListener = async (req, res) => {
  //回傳的標頭定義
  const headers = {
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Content-Length, X-Requested-With",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Method": "PATCH, POST, GET, OPTIONS, DELETE",
    "Content-Type": "application/json",
  };
  let body = "";
  // 接收 post API的body資料
  req.on("data", (chunk) => {
    console.log("chunk");
    body += chunk;
  });

  // 處理不同的請求方式
  // 取得貼文
  if (req.url == "/posts" && req.method == "GET") {
    const getPost = await Post.find();
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: "success",
        data: getPost,
      })
    );
    res.end();
    // 新增貼文
  } else if (req.url == "/posts" && req.method == "POST") {
    req.on("end", async () => {
      try {
        // 取的 POST 的資料
        const postData = JSON.parse(body);
        const addPost = await Post.create(postData);
        console.log(postData);
        res.writeHead(200, headers);
        res.write(
          JSON.stringify({
            status: "success",
            data: addPost,
          })
        );
        res.end();
      } catch (err) {
        res.writeHead(400, headers);
        res.write(
          JSON.stringify({
            status: "error",
            message: "資料傳輸或建立失敗",
            errors: err.errors,
          })
        );
        res.end();
      }
    });
    // 刪除所有貼文
  } else if (req.url == "/posts" && req.method == "DELETE") {
    await Post.deleteMany({});
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: "success",
        data: null,
      })
    );
    res.end();
    // 刪除單一貼文
  } else if (req.url.startsWith("/posts/") && req.method == "DELETE") {
    const deleteId = url.split("/").pop();
    try {
      const deletedPost = await Post.findByIdAndDelete(deleteId);
      res.writeHead(200, headers);
      res.write(
        JSON.stringify({
          status: "success",
          data: deletedPost,
        })
      );
      res.end();
    } catch (error) {
      res.writeHead(400, headers);
      res.write(
        JSON.stringify({
          status: "error",
          message: "刪除單筆貼文失敗",
          error,
        })
      );
      res.end();
    }
    // 編輯單一貼文
  } else if (req.url.startsWith("/posts/") && req.method == "PATCH") {
    const editId = url.split("/").pop();
    req.on("end", async () => {
      try {
        // 取得PATCH 的資料
        const data = JSON.parse(body);
        const editPosts = await Post.findByIdAndUpdate(editId, data, {
          new: true,
          runValidators: true,
        });
        res.writeHead(200, headers);
        res.write(
          JSON.stringify({
            status: "success",
            posts: editPosts,
          })
        );
        res.end();
      } catch (error) {
        res.writeHead(400, headers);
        res.write(
          JSON.stringify({
            status: "error",
            message: "編輯單筆貼文失敗",
            error,
          })
        );
        res.end();
      }
    });
  }
  // 跨網域設定
  else if (req.url == "/posts" && req.method == "OPTIONS") {
    res.writeHead(200, headers);
    res.end();
  }
  // 404無對應路由
  else {
    res.writeHead(404, headers);
    res.write(
      JSON.stringify({
        status: "false",
        message: "無此路由",
      })
    );
    res.end();
  }
};
const server = http.createServer(requestListener);
server.listen(process.env.PORT);
