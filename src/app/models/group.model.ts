import {User} from "./user.model";

export class Group {
  public name : string;
  users : User[];

  constructor(name : string){
    this.name = name;
    this.users = [];
  }
}
