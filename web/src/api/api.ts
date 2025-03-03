
import AdminAPI from "./admin";
import { APIError, BooleanResult, UserRoleResult, WelcomePage } from "./types";
import UserAPI from "./user";

export default class RaffleAPI {
    public static Instance: RaffleAPI;

    public readonly apiEndpoint: string;

    public readonly admin: AdminAPI;
    public readonly user: UserAPI;


    public constructor(baseUrl: string, updateInstance = true) {
        if (updateInstance) RaffleAPI.Instance = this;

        this.apiEndpoint = baseUrl + "/api/v1"
        this.admin = new AdminAPI(this);
        this.user = new UserAPI(this);
    }


    public async passwordUsed(password: string): Promise<BooleanResult> {
        return await this.get("/Users/PasswordUsed", password);
    }

    public async checkRole(password: string): Promise<UserRoleResult> {
        return await this.get("/Users/CheckRole", password);
    }

    public async getWelcomePage(): Promise<WelcomePage> {
        let accessPassword = this.admin.accessPassword ?? this.user.accessPassword;
        return await this.get("/Users/GetWelcomePage", accessPassword);
    }

    public async get<T>(path: string, auth: string | undefined): Promise<T> {
        return await this.request<T>(path, "GET", auth);
    }

    public async post<T>(path: string, auth: string | undefined, data?: object): Promise<T> {
        return await this.request<T>(path, "POST", auth, data);
    }

    public async patch<T>(path: string, auth: string | undefined, data?: object): Promise<T> {
        return await this.request<T>(path, "PATCH", auth, data);
    }

    public async delete<T>(path: string, auth: string | undefined, data?: object): Promise<T> {
        return await this.request<T>(path, "DELETE", auth, data);
    }

    private async request<T>(path: string, method: string, auth: string | undefined, data?: object): Promise<T> {
        if (!auth) throw new APIError(401, { error: "No auth password provided" });

        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Bearer ${auth}`);

        const request = new Request(this.apiEndpoint + path, {
            method: method,
            headers: headers,
            body: data ? JSON.stringify(data) : null,
        });

        let response;
        let json;
        try {
            response = await fetch(request);
            const text = await response.text();
            json = text ? JSON.parse(text) : undefined;
        } catch (e) {
            throw new APIError(500, { err: e });
        }

        if (!response.ok) throw new APIError(response.status, json);
        return json as T;
    }
}