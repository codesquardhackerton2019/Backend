import uniqid from 'uniqid';
import Store, { IStore } from '../models/store.model';

interface ICreateStoreInput {
  name        : IStore['name'];
  tel         : IStore['tel'];
  address     : IStore['address'];
  imageUrl?   : IStore['imageUrl'];
}

async function getStores({
  page = 0,
  limit = 10,
}): Promise<IStore[]> {
  try {
    const stores: IStore[] = await Store.find({
      deletedAt: { $exists: false }
    }, {
      skip: page * limit,
      limit,
    });
    return stores;
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
    const store: IStore = await Store.create({
      id: uniqid(),
      name,
      tel,
      address,
      imageUrl,
    });
    return store;
  } catch (error) {
    throw error;
  }
}


export default {
  getStores,
  createStore,
};
