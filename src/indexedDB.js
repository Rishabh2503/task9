import { openDB } from 'idb';

const dbPromise = openDB('blog-db', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('posts')) {
      db.createObjectStore('posts', { keyPath: 'id', autoIncrement: true });
    }
  },
});

export const addPost = async (post) => {
  const db = await dbPromise;
  return db.add('posts', post);
};

export const getPosts = async () => {
  const db = await dbPromise;
  return db.getAll('posts');
};

export const deletePost = async (id) => {
  const db = await dbPromise;
  return db.delete('posts', id);
};

export const updatePost = async (post) => {
  const db = await dbPromise;
  return db.put('posts', post);
};
