import {User} from "./user.model";

export class Group {
  constructor(public id?: string,
              public name?: string,
              public members?: User[],
              public creator?: User) {
  }
}
