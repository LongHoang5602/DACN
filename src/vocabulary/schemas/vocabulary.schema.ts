import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Role } from 'src/roles/schemas/role.schema';

export type VocabularyDocument = HydratedDocument<Vocabulary>;

@Schema()
export class Vocabulary {
    @Prop()
    vocab: string;

    @Prop()
    mean: string;

    @Prop()
    type: string;

}

export const VocabularySchema = SchemaFactory.createForClass(Vocabulary);