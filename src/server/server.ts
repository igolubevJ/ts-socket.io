import http from 'http';
import SocketIO from 'socket.io';

const port: number = 3000;

class App {
  private server: http.Server;
  private port: number;

  constructor(port: number) {
    this.port = port;

    this.server = new http.Server();
    const io = new SocketIO.Server(this.server);
  }

  public Start(): void {
    this.server.listen(this.port, () => {
      console.log(`Server listening on port: ${this.port}`);
    });
  }
}

new App(port).Start();
