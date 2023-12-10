import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io'
import { ChatService } from './chat.service'

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  server: Socket;

  @SubscribeMessage('chat-message')
  handleChatMessage(client: any, payload: any): void {
    this.server.emit('chat-message', payload);
  }

  handleConnection(client: any, ...args: any[]) {
    console.log('client connected ', client.id);
  }

  handleDisconnect(client: any): any {
    console.log('client disconnected ', client.id);
  }

  users: object[] = [];
  @SubscribeMessage('add-user')
  setUserName(client: any, payload: any): void {
    const user: object = {
      id: client.id,
      name: payload.username,
    };
    this.users.push(user);
    console.log(this.users);
    client.emit('get-user', user);
  }

  @SubscribeMessage('chat-translate-message')
  async handleTranslateMessage(client: any, payload: any): Promise<void> {
    const { content } = payload;

    const translatedMessage = await this.chatService.translateMessage(content);

    console.log("content handle translate");

    const messageData = {
      content: translatedMessage,
      timeSent: new Date().toISOString(),
      username: payload.username,
    };

    this.server.emit('chat-translate-message', messageData);
  }

  @SubscribeMessage('chat-validate-message')
  async handleValidateMessage(client: any, payload: any): Promise<void> {
    try {
      const { messageToValidate } = payload;

      console.log('Received message to validate:', messageToValidate);

      const validationResult = await this.chatService.validateMessage(messageToValidate);

      console.log('Validation result:', validationResult);

      const messageData = {
        content: validationResult,
        timeSent: new Date().toISOString(),
        username: "adminOpenai",
      };

      console.log('Sending validated message to client:', messageData);

      client.emit('chat-validate-message', messageData);
    } catch (error) {
      console.error('Error handling validated message:', error);
    }
  }
}
