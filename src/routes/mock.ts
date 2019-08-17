import { NextFunction, Request, Response, Router } from 'express';
import fs from 'fs';
import ReadLine from 'readline';
import uniqid from 'uniqid';
import Comment, { IComment } from '../models/comment.model';
import Menu, { IMenu } from '../models/menu.model';
import Store from '../models/store.model';

const mockRouter = Router();

mockRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mockDataReadStream =
      fs.createReadStream('/Users/mcc/Workspace/codesquad/repo/hackerton-815/storeMock.csv');

    const readLine = ReadLine.createInterface({
      input: mockDataReadStream
    });

    readLine.on('line', line => {
      const inputs = line.split(',');
      const store = new Store({
        id: uniqid(),
        name: inputs[0],
        tel: inputs[1],
        address: inputs[2],
        description: inputs[3],
        imageUrl: inputs[4],
      });
      store.save((err, product) => {
        console.log(err);
      });
    });

    res.status(202).send({
      links: {
        rel: 'self',
        href: '/stores',
        action: 'GET',
      },
    });
  } catch (error) {
    next(error);
  }
});

mockRouter.delete('/removeAll', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Store.deleteMany({});

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

function getRandom(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; // The maximum is exclusive and the minimum is inclusive
}

mockRouter.post('/comments', async (req: Request, res: Response, next: NextFunction) => {
  const commentArr = [
    {writerName: '부정이', content: '하..', score: 1.0 },
    {writerName: '살짝 부정이', content: '별로네요', score: 2.4 },
    {writerName: '보통이', content: '먹을만해요', score: 3.2 },
    {writerName: '살짝 긍정이', content: '맛있어요', score: 4.0 },
    {writerName: '긍정이', content: '여기 너무 맛있어요!', score: 5.0 },
  ];
  try {
    const stores = await Store.find({ deletedAt: { $exists: false }});
    for (const store of stores) {
      const upper = getRandom(4, 5), lower = getRandom(1, 2), commentsNum = getRandom(1, 20);
      for (let i = 0; i < commentsNum; ++i) {
        const pickComment = getRandom(lower, upper);
        const { writerName, content, score } = commentArr[pickComment];
        const comment: IComment = new Comment({
          id: uniqid(),
          writerName,
          content,
          score,
        });

        await Store.findOneAndUpdate({
          id: store.id,
          deletedAt: { $exists: false },
        }, {
          $inc: { totalScore: score, commentSize: 1 },
          $push: { comments: comment },
          modifiedAt: new Date(),
        });
      }
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

mockRouter.post('/menus', async (req: Request, res: Response, next: NextFunction) => {
  const menuArr = [
    { name: '김치찌개', price: 7000 },
    { name: '순대국밥', price: 7000 },
    { name: '뼈다귀해장국', price: 7000 },
    { name: '차돌짬뽕', price: 8000 },
    { name: '마늘 빵(바게트 아님)', price: 5300 },
    { name: '짜장면', price: 7000 },
    { name: '도련님 도시락', price: 4000 },
    { name: '와퍼', price: 7400 },
    { name: '돈코츠라멘', price: 8000 },
    { name: '회덮밥', price: 8000 },
    { name: '뚝배기불고기', price: 8000 },
    { name: '떡볶이 모듬 세트', price: 7000 },
    { name: '치킨', price: 17000 },
    { name: '묵은지 참치 주먹밥', price: 3000 },
    { name: '더블 치즈 버거', price: 7000 },
    { name: '멍게 비빔밥', price: 7000 },
    { name: '치즈 돈까스', price: 10000 },
    { name: '초계국수', price: 8000 },
    { name: '제육덮밥', price: 3500 },
  ];
  try {
    const stores = await Store.find({ deletedAt: { $exists: false }});
    for (const store of stores) {
      const commentsNum = getRandom(1, 10);
      for (let i = 0; i < commentsNum; ++i) {
        const pickComment = getRandom(0, menuArr.length);
        const { name, price } = menuArr[pickComment];
        const menu: IMenu = new Menu({
          id: uniqid(),
          name,
          price,
        });

        await Store.findOneAndUpdate({
          id: store.id,
          deletedAt: { $exists: false },
        }, {
          $push: { menus: menu },
          modifiedAt: new Date(),
        });
      }
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

mockRouter.delete('/menus', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stores = await Store.find({ deletedAt: { $exists: false }});
    for (const store of stores) {
      const commentsNum = getRandom(1, 10);
      for (let i = 0; i < commentsNum; ++i) {
        await Store.findOneAndUpdate({
          id: store.id,
          deletedAt: { $exists: false },
        }, {
          $set: { menus: [] },
          modifiedAt: undefined,
        });
      }
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});


// mockRouter.delete('/comments', async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const stores = await Store.find({ deletedAt: { $exists: false }});
//     for (const store of stores) {
//         await Store.findOneAndUpdate({
//           id: store.id,
//           deletedAt: { $exists: false },
//         }, {
//           $inc: { totalScore: 0, commentSize: 0 },
//           $push: { comment },
//           modifiedAt: new Date(),
//         });
//       }
//     }
//   } catch (error) {
//     next(error);
//   }
// });



// mockRouter.post('/comments/:id', async (req: Request, res: Response, next: NextFunction) => {

//   } catch (error) {
//     next(error);
//   }
// });

export default mockRouter;
