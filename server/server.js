const mongoose = require('mongoose')
const Document = require('./Document')

mongoose.connect("mongodb://localhost/google_docs_clone", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log("DB connected")

const defaultValue = ""
const io = require('socket.io')(3001, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET","POST"]
    },
})

io.on("connection", (socket) => {
  socket.on("get-document", async (documentId) => { 
    const document = await findOrCreateDocument(documentId);
    socket.join(documentId)
    socket.emit("load-document", document.data);
    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    socket.on("save-document", async (data) => {
      await Document.findByIdAndUpdate(documentId, { data });
    });
  });
});

async function findOrCreateDocument(id) {
  if (id == null) return;

  const document = await Document.findById(id);
  if (document) return document;
  const newDocument = await Document.create({ _id: id, data: defaultValue });
  return newDocument;
}