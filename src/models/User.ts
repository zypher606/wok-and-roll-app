export class User {
  private static instance: User;
  private userData: any;

  public static getInstance(): User {
    if (!User.instance) {
      User.instance = new User();
    }
    return User.instance;
  }

  public get UserData() {
    return this.userData;
  }

  public set UserData(userData: any) {
    this.userData = userData;
  }
}
