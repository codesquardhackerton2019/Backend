import mongoose from 'mongoose';
import s3 from '../config/aws';
import converter from '../config/converter';
import Article, { IArticle } from '../models/article.model';
import Comment from '../models/comment.model';
import { removeUndefinedFields } from '../util/fieldset';
import { S3_BUCKET } from '../util/secrets';

interface IArticleInfo {
  article : IArticle;
  rawHtml : string;
  writer  : {};
}

interface IPatchArticleInput {
  _id           : IArticle['_id'];
  title?        : IArticle['title'];
  markdownKey?  : IArticle['markdownKey'];
  heroImageUrl? : IArticle['heroImageUrl'];
}

interface IArticleLikeInput {
  articleId  : IArticle['_id'];
  likeUserId : string;
}

async function getRawArticleById(articleId): Promise<IArticleInfo> {
  try {
    await Article.updateOne({
      _id: articleId,
      deletedAt: { $exists: false },
    },
    { $inc: { hits: 1 }});

    const articles = await Article.aggregate([
      { $match: {
          _id: mongoose.Types.ObjectId(articleId),
          deletedAt: { $exists: false },
        }
      },
      { $project: {
        title        : true,
        markdownKey  : true,
        heroImageUrl : true,
        writerId     : true,
        hits         : true,
        createdAt    : true,
        modifiedAt   : true,
        deletedAt    : true,
        likeUsers    : { $size: { $ifNull: [ '$likeUsers', [] ] }},
        comments     : { $size: { $ifNull: [ '$comments', [] ] }},
      }},
    ]);

    await Article.populate(articles[0], { path: 'writerId'});

    const articleRawHtml = await (s3.getObject({
      Bucket: S3_BUCKET,
      Key: articles[0].markdownKey,
    }).promise());

    const rawMarkdown = await articleRawHtml.Body.toString('utf-8');

    return {
      article: articles[0],
      rawHtml: converter.makeHtml(rawMarkdown),
      writer: articles[0].writerId,
    };
  } catch (error) {
    throw error;
  }
}

async function createArticle({
  writerId,
  title,
  markdownKey,
  heroImageUrl,
}): Promise<{}> {
  try {
    return await Article.create({ writerId, title, markdownKey, heroImageUrl, createdAt: new Date(), hits: 0 });
  } catch (error) {
    throw error;
  }
}

async function getArticles(page = 1, pageSize = 8): Promise<IArticle[]> {
  try {
    return await Article.find(
      { deletedAt: { $exists: false } },
      undefined,
      { skip: (page - 1) * pageSize, limit: pageSize }
    ).sort('-createdAt')
      .populate('writerId');
  } catch (error) {
    throw error;
  }
}

async function getArticlesByUserId(userId: string, page: number, pageSize = 9): Promise<IArticle[]> {
  try {
    return await Article.aggregate([
      {
        $match: {
          writerId: mongoose.Types.ObjectId(userId),
          deletedAt: { $exists: false },
        }
      },
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * pageSize },
      { $limit: pageSize },
      {
        $project: {
          _id: 1,
          title: 1,
          writerId: 1,
          markdownKey: 1,
          heroImageUrl: 1,
          hits: 1,
          createdAt: 1,
          modifiedAt: 1,
          comments: { $size: { $ifNull: [ '$comments', [] ] } },
          likeUsers: { $size: { $ifNull: [ '$likeUsers', [] ] } },
        }
      }
    ]);
  } catch (error) {
    throw error;
  }
}

async function deleteArticle(articleId: IArticle['_id']): Promise<{}> {
  try {
    return await Article.updateOne({ _id: articleId }, { deletedAt: new Date() });
  } catch (error) {
    throw error;
  }
}

async function patchArticleById({
  _id,
  title,
  markdownKey,
  heroImageUrl,
}: IPatchArticleInput): Promise<{}> {
  try {
    const result = await Article.updateOne({
      _id,
      deletedAt: { $exists: false }
    }, removeUndefinedFields({title, markdownKey, heroImageUrl, modifiedAt: new Date() }));
    return result;
  } catch (error) {
    throw error;
  }
}

async function likeArticle({
  articleId,
  likeUserId,
}: IArticleLikeInput): Promise<void> {
  try {
    await Article.updateOne(
      { _id: articleId, deletedAt: { $exists: false } },
      { $addToSet: { likeUsers: mongoose.Types.ObjectId(likeUserId) }}
    );
  } catch (error) {
    throw error;
  }
}

async function retractLikeArticle({
  articleId,
  likeUserId,
}: IArticleLikeInput): Promise<void> {
  try {
    await Article.updateOne(
      { _id: articleId, deletedAt: { $exists: false } },
      { $pull: { likeUsers: likeUserId }}
    );
  } catch (error) {
    throw error;
  }
}

async function checkLikeArticle({
  articleId,
  likeUserId,
}: IArticleLikeInput): Promise<boolean> {
  try {
    const result = await Article.findOne({
      _id: articleId,
      likeUsers: { $in: likeUserId },
      deletedAt: { $exists: false },
    });
    return result ? true : false;
  } catch (error) {
    throw error;
  }
}

async function getArticleShortInfo(articleId): Promise<IArticle> {
  try {
    const aggregateResult: IArticle[] = await Article.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(articleId),
          deletedAt: { $exists: false },
        }
      },
      {
        $project: {
          _id: 1,
          title: 1,
          writerId: 1,
          markdownKey: 1,
          heroImageUrl: 1,
          hits: 1,
          createdAt: 1,
          modifiedAt: 1,
          comments: { $size: { $ifNull: [ '$comments', [] ] } },
          likeUsers: { $size: { $ifNull: [ '$likeUsers', [] ] } },
        }
      }
    ]);

    const article = aggregateResult[0];
    if (article) await Article.populate(article, { path: 'writerId' });

    return article;
  } catch (error) {
    throw error;
  }
}

async function getComments({
  articleId,
  userId,
  page,
}): Promise<any> {
  try {
    const addFieldsQuery = userId ? { $addFields: {
        likedComment: {
          $map: {
            input: '$comments.likeUsers',
            as: 'likeUsers',
            in: { $in: [mongoose.Types.ObjectId(userId), '$$likeUsers']}
          }
        }
      }
    } : undefined;

    const aggregateQuery: any[] = [
      { $match: { _id: mongoose.Types.ObjectId(articleId), deletedAt: { $exists: false } } },
      { $project: { comments: 1 } },
      { $unwind: { path: '$comments' } },
      { $sort: { 'comments.createdAt': -1 } },
      { $group: { _id: '$_id', comments: { $push: '$comments' } } },
      { $project: { comments: { $slice: [ '$comments', page * 25, 25 ] } } },
    ];

    if (addFieldsQuery) aggregateQuery.push(addFieldsQuery);

    let comments = await Article.aggregate(aggregateQuery);

    if (comments) {
      comments = await Article.populate(comments, {
        path: 'comments.writerId',
        model: 'User',
      });
    }

    return comments[0] || { comments: [], likedComment: [] };
  } catch (error) {
    throw error;
  }
}

async function createComment({
  articleId,
  userId,
  content,
}): Promise<void> {
  try {
    const newComment = new Comment({
      writerId: userId,
      content,
      createdAt: new Date(),
    });

    await Article.updateOne({
      _id: articleId,
      deletedAt: { $exists: false },
    },
    { $push: { comments: newComment }}
    );

  } catch (error) {
    throw error;
  }
}

async function removeComment({
  articleId,
  commentId,
}): Promise<void> {
  try {
    await Article.updateOne(
      { _id: articleId, deletedAt: { $exists: false } },
      { $pull: { comments: { _id: mongoose.Types.ObjectId(commentId) } } }
    );

  } catch (error) {
    throw error;
  }
}

async function likeComment({
  articleId,
  commentId,
  userId,
}): Promise<void> {
  try {
    await Article.updateOne({
        '_id': articleId,
        'deletedAt': { $exists: false },
        'comments._id': commentId
      },
      { $addToSet: {
          'comments.$.likeUsers': mongoose.Types.ObjectId(userId),
        }
      },
    );

  } catch (error) {
    throw error;
  }
}

async function retractLikeComment ({
  articleId,
  commentId,
  userId,
}): Promise<void> {
  try {
    await Article.updateOne({
      '_id': articleId,
      'deletedAt': { $exists: false },
      'comments._id': commentId
    },
    { $pull: {
        'comments.$.likeUsers': mongoose.Types.ObjectId(userId),
      }
    },
  );
  } catch (error) {
    throw error;
  }
}

export default {
  getRawArticleById,
  createArticle,
  getArticlesByUserId,
  getArticles,
  deleteArticle,
  patchArticleById,
  likeArticle,
  retractLikeArticle,
  checkLikeArticle,
  getArticleShortInfo,
  getComments,
  createComment,
  removeComment,
  likeComment,
  retractLikeComment,
};
