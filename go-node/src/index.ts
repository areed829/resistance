import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = new http.Server(app);
const io = new Server(server);

const documents: any = {};

io.on('connection', (socket) => {
  let previousId: string;

  const safeJoin = (currentId: string) => {
    socket.leave(previousId);
    socket.join(currentId);
    console.log(`User ${socket.id} joined room ${currentId}`);
    previousId = currentId;
  };

  socket.on('getDoc', (docId) => {
    safeJoin(docId);
    socket.emit('document', documents[docId]);
  });

  socket.on('addDoc', (doc) => {
    documents[doc.id] = doc;
    safeJoin(doc.id);
    io.emit('documents', Object.keys(documents));
    socket.emit('document', doc);
  });

  socket.on('editDoc', (doc) => {
    documents[doc.id] = doc;
    socket.to(doc.id).emit('document', doc);
  });

  io.emit('documents', Object.keys(documents));

  console.log(`Socket ${socket.id} has connected`);
});

server.listen(4444, () => {
  console.log('Listening on port 4444');
});
