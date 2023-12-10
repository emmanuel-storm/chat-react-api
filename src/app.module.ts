import { Module } from '@nestjs/common';
import { ChatGateway } from './chat/chat.gateway';
import { ChatModule } from './chat/chat.module';
import { ChatService } from "src/chat/chat.service"

@Module({
  imports: [ChatModule],
  controllers: [],
  providers: [ChatGateway, ChatService],
})
export class AppModule {}
