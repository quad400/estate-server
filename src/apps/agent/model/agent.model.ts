import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../../common/db/abstract.schema';

export type AgentDocument = Agent & Document;

@Schema({ versionKey: false, timestamps: true })
export class Agent extends AbstractDocument {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  phone: string;

  @Prop({ type: String })
  image: string;

  @Prop({ type: String, ref: 'User', required: true })
  user: string;
}

export const AgentSchema = SchemaFactory.createForClass(Agent);
