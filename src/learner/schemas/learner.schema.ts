import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Role } from 'src/roles/schemas/role.schema';
import { Vocabulary } from 'src/vocabulary/schemas/vocabulary.schema';

export type LearnerDocument = HydratedDocument<Learner>;

@Schema()
export class Learner {
    @Prop({ required: true })
    userId: mongoose.Schema.Types.ObjectId;


    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: Vocabulary.name })
    A1: Vocabulary[];

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: Vocabulary.name })
    dA1: Vocabulary[];

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: Vocabulary.name })
    A2: Vocabulary[];

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: Vocabulary.name })
    dA2: Vocabulary[];

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: Vocabulary.name })
    B1: Vocabulary[];

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: Vocabulary.name })
    dB1: Vocabulary[];

}

export const LearnerSchema = SchemaFactory.createForClass(Learner);