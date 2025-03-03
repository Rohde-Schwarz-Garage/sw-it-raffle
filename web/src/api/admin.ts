import RaffleAPI from "./api";
import { IdValue, Password, PasswordDetails, Raffle, UpdateTicketCountRequest, User, WelcomePage } from "./types";

export default class AdminAPI {
    private readonly endpoint = "/Admin";
    private readonly api: RaffleAPI;
    
    accessPassword?: string;


    public constructor(api: RaffleAPI) {
        this.api = api;
    }

    public getAccessPassword(): string | undefined {
        return this.accessPassword;
    }

    public setAccessPassword(password?: string) {
        this.accessPassword = password;
    }

    public async createPassword(): Promise<Password> {
        return this.api.post(`${this.endpoint}/CreatePassword`, this.accessPassword);
    }

    public async getPasswords(): Promise<PasswordDetails[]> {
        return this.api.get(`${this.endpoint}/GetPasswords`, this.accessPassword);
    }

    public async deletePassword(id: number) {
        await this.api.delete(`${this.endpoint}/DeletePassword`, this.accessPassword, { id: id } as IdValue);
    }

    public async getUsers(): Promise<User[]> {
        return await this.api.get(`${this.endpoint}/GetUsers`, this.accessPassword);
    }

    public async deleteUser(id: number) {
        await this.api.delete(`${this.endpoint}/DeleteUser`, this.accessPassword, { id: id } as IdValue);
    }

    public async updateTicketCount(request: UpdateTicketCountRequest) {
        await this.api.patch(`${this.endpoint}/UpdateTicketCount`, this.accessPassword, request);
    }

    public async startRaffle(): Promise<Raffle> {
        return await this.api.post(`${this.endpoint}/StartRaffle`, this.accessPassword);
    }

    public async getRaffles(): Promise<Raffle[]> {
        return await this.api.get(`${this.endpoint}/GetRaffles`, this.accessPassword);
    }

    public async deleteRaffle(id: number) {
        await this.api.delete(`${this.endpoint}/DeleteRaffle`, this.accessPassword, { id: id } as IdValue);
    }

    public async updateWelcomePage(request: WelcomePage): Promise<WelcomePage> {
        return await this.api.patch(`${this.endpoint}/UpdateWelcomePage`, this.accessPassword, request);
    }
}