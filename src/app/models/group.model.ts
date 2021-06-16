import {User} from "./user.model";

export class Group {
  users: User[];
  constructor(public id: string, public name: string) {
  }
}
