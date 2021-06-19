export class User {

    constructor(
        public id?: string,
        public firstname?: string,
        public lastname?: string,
        public image?: string,
        public description?: string,
        public cash?: boolean,
        public ec_card?: boolean,
        public kreditcard?: boolean,
        public paypal?: boolean,
        public imagePublic?: boolean,   
        public lastnamePublic?: boolean,   
        public awardsPublic?: boolean,         
        ) { }
}