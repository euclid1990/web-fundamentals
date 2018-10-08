import db from './db';

export default class Guard {
  static async store(user) {
    try {
      await db.user.put(user, 1);
      return user;
    } catch (error) {
      return null;
    }
  }

  static async get() {
    try {
      return await db.user.get(1);
    } catch (error) {
      return null;
    }
  }

  static async delete() {
    try {
      return await db.user.delete(1);
    } catch (error) {
      return null;
    }
  }

  static async isAuthenticated() {
    let user = await Guard.get();
    if (!user) return false;
    return true;
  }
}
