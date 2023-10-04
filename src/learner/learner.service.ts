import { Injectable } from '@nestjs/common';
import { CreateLearnerDto } from './dto/create-learner.dto';
import { UpdateLearnerDto } from './dto/update-learner.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Vocabulary, VocabularyDocument } from 'src/vocabulary/schemas/vocabulary.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Learner, LearnerDocument } from './schemas/learner.schema';
import { IUser } from 'src/users/users.interface';
import { VocabularyService } from 'src/vocabulary/vocabulary.service';

@Injectable()
export class LearnerService {
  constructor(
    @InjectModel(Vocabulary.name)
    private vocabModel: SoftDeleteModel<VocabularyDocument>,
    @InjectModel(Learner.name)
    private learnModel: SoftDeleteModel<LearnerDocument>,

    private vocabService: VocabularyService
  ) { }
  async create(createLearnerDto: CreateLearnerDto, user: IUser) {
    const getA1 = await this.vocabModel.find().select('A1').exec()
    const A2 = await this.vocabModel.find({ type: "A2" })
    const B1 = await this.vocabModel.find({ type: "B1" })
    // return await this.learnModel.create({
    //   userId: user._id,
    //   A1: A1,
    //   A2: A2,
    //   B1: B1
    // });
    return await this.vocabService.findAllbyType("")
  }

  findAll() {
    return `This action returns all learner`;
  }

  findOne(id: number) {
    return `This action returns a #${id} learner`;
  }

  update(id: number, updateLearnerDto: UpdateLearnerDto) {
    return `This action updates a #${id} learner`;
  }

  remove(id: number) {
    return `This action removes a #${id} learner`;
  }
}
