import express from 'express';
import path from 'path';
import http from 'http';
import socketIO from 'socket.io';

import LuckyNumbersGame from './luckyNumbersGame';

const port: number = 3000;

class App {
  private server: http.Server;
  private port: number;

  private io: socketIO.Server;
  private game: LuckyNumbersGame;

  constructor(port: number) {
    this.port = port;

    const app = express();
    app.use(express.static(path.join(__dirname, '..', 'client')));

    this.server = new http.Server(app);
    this.io = new socketIO.Server(this.server);

    this.game = new LuckyNumbersGame();
    
    this.io.on('connection', (socket: socketIO.Socket) => {
      console.log('a user connected:', socket.id);

      this.game.LuckyNumbers[socket.id] = Math.floor(Math.random() * 10);

      socket.emit('message', `Hello, ${socket.id}, your lucky number is ${this.game.LuckyNumbers[socket.id]}`);

      socket.broadcast.emit('message', `Everybody, say hello to ${socket.id}`);

      socket.on('disconnect', function() {
        console.log('socket disconnect:', socket.id);
      });
    });

    setInterval(() => {
      let randomNumber: number = Math.floor(Math.random() * 10);
      let winners: string[] = this.game.GetWinners(randomNumber);
      if (winners.length) {
        winners.forEach((w) => {
          this.io.to(w).emit('message', '*** You are the winner ***');
        });
      }
      this.io.emit('random', randomNumber);
    }, 1000);
  }

  public Start(): void {
    this.server.listen(this.port, () => {
      console.log(`Server listening on port: ${this.port}`);
    });
  }
}

new App(port).Start();
