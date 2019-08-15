import uniqid from 'uniqid';
import Comment, { IComment } from '../models/comment.model';
import Store, { IStore } from '../models/store.model';

export interface ICreateCommentInput {
  writerName : IComment['writerName'];
  content    : IComment['content'];
  score      : IComment['score'];
}

async function createComment({
  writerName,
  content,
  score,
}: ICreateCommentInput, storeId: IStore['id']): Promise<void> {
  try {
    const comment: IComment = new Comment({
      id: uniqid(),
      writerName,
      content,
      score,
    });

    await Store.findOneAndUpdate({
      id: storeId,
      deletedAt: { $exists: false },
    }, {
      $inc: { totalScore: score, commentSize: 1 },
      $push: { comment },
      modifiedAt: new Date(),
    });

  } catch (error) {
    throw error;
  }
}

export default {
  createComment,
};
