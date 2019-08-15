import uniqid from 'uniqid';
import Store, { IStore } from '../models/store.model';

export interface ICreateStoreInput {
  name        : IStore['name'];
  tel         : IStore['tel'];
  address     : IStore['address'];
  imageUrl?   : IStore['imageUrl'];
}

async function getStores(size = 9): Promise<IStore[]> {
  try {
    // const stores: IStore[] = await Store.find({
    //   deletedAt: { $exists: false }
    // },
    // '-_id -__v -comments -menus', {
    //   skip: page * limit,
    //   limit,
    // });
    const stores: IStore[] = await Store.aggregate([
      { $match: { deletedAt: { $exists: false } } },
      { $sample: { size }},
      { $project: {
        _id: 0,
        id: 1,
        name: 1,
        tel: 1,
        address: 1,
        totalScore: 1,
        commentSize: 1,
        imageUrl: 1,
        createdAt: 1,
        modifiedAt: 1,
      }},
    ]);

    return stores;
  } catch (error) {
    throw error;
  }
}

async function getStore(id: string): Promise<IStore> {
  try {
    const store = await Store.findOne(
      { id, deletedAt: { $exists: false } },
      '-_id -__v'
    );

    return store;
  } catch (error) {
    throw error;
  }
}

async function createStore({
name,
tel,
address,
imageUrl,
}: ICreateStoreInput): Promise<IStore> {
  try {
    const store: IStore = new Store({
      id: uniqid(),
      name,
      tel,
      address,
      imageUrl,
    });

    await store.save();

    return store;
  } catch (error) {
    throw error;
  }
}

export default {
  getStores,
  getStore,
  createStore,
};
