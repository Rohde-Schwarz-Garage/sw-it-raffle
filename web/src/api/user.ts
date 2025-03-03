import RaffleAPI from "./api";
import { CreateUserRequest, WelcomePage } from "./types";

export default class UserAPI {
    private readonly endpoint = "/Users";
    private readonly api: RaffleAPI;
    
    accessPassword?: string;


    public constructor(api: RaffleAPI) {
        this.api = api;
    }


    public setAccessPassword(password?: string) {
        this.accessPassword = password;
    }

    public async createUser(request: CreateUserRequest) {
        await this.api.post(`${this.endpoint}/CreateUser`, this.accessPassword, request);
    }
}