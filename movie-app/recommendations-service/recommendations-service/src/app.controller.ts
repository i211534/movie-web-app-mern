import { Controller, Logger, UnauthorizedException, UseFilters } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BaseRpcExceptionFilter, MessagePattern } from '@nestjs/microservices';
import { RecommendationsService } from './app.service';

@Controller()
@UseFilters(new BaseRpcExceptionFilter())
export class RecommendationsController {
  private readonly logger = new Logger(RecommendationsController.name);

  constructor(
    private readonly recommendationsService: RecommendationsService,
    private readonly jwtService: JwtService,
  ) { }

  @MessagePattern({ cmd: 'get-recommendations' })
  async getRecommendations(data: { userId: string; jwtToken: string }) {
    const { userId, jwtToken } = data;

    this.logger.log(`Received JWT Token: ${jwtToken}`);

    this.logger.log(`User ID from request: ${userId} (Type: ${typeof userId})`);

    try {
      const decoded = this.jwtService.verify(jwtToken);
      this.logger.log(`Decoded Token: ${JSON.stringify(decoded)}`);
      this.logger.log(`User ID from token: ${decoded.sub} (Type: ${typeof decoded.sub})`);

      if (decoded.sub !== userId) {
        this.logger.error(`Token user ID ${decoded.sub} does not match request user ID ${userId}`);
        throw new UnauthorizedException('Token does not match user');
      }
    } catch (error) {
      this.logger.error('Token verification failed', error.stack);
      throw new UnauthorizedException('Invalid token');
    }
    
    const recommendations = await this.recommendationsService.getRecommendations(userId);
  //  console.log('Recommendation Controller:', recommendations);
    return recommendations;
  }
}
