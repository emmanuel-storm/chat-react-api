import { Injectable } from '@nestjs/common'
import { OpenAI } from 'openai'

@Injectable()
export class ChatService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async translateMessage(
    message: string,
  ): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      temperature: 0.2,
      messages: [
        {
          role: 'user',
          content: `traduit ce message en anglais tout le temps ${message}`,
        },
      ],
    });

    return response.choices[0].message.content.trim();
  }

  async validateMessage(message: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: `Verify the accuracy of the following message: "${message}" and provide a clear and concise response.`,
          },
        ],
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('Erreur lors de la validation du message :', error);
      return 'Erreur lors de la validation du message.';
    }
  }
}
