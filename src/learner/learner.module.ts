import { Module } from '@nestjs/common';
import { LearnerService } from './learner.service';
import { LearnerController } from './learner.controller';
import { Learner, LearnerSchema } from './schemas/learner.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { VocabularyService } from 'src/vocabulary/vocabulary.service';
import { Vocabulary, VocabularySchema } from 'src/vocabulary/schemas/vocabulary.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Learner.name, schema: LearnerSchema }]),
    MongooseModule.forFeature([{ name: Vocabulary.name, schema: VocabularySchema }]),
  ],
  controllers: [LearnerController],
  providers: [LearnerService, VocabularyService]
})
export class LearnerModule { }
