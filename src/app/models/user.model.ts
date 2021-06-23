export class User {
  constructor(
    public id?: string,
    public displayName?: string,
    public email?: string,
    public friends?: string[],
    public awards?: string[], 
    public profilePic?: string,
    public description?: string,
    public cash?: boolean,
    public ec_card?: boolean,
    public kreditcard?: boolean,
    public paypal?: boolean,
    public imagePublic?: boolean,    
    public awardsPublic?: boolean,
    public descriptionPublic?: boolean,
    ) {
  }
}
