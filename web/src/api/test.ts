import RaffleAPI from "./api";
import { UserRole, WelcomePage } from "./types";

export default async function testApiCalls(baseUrl: string, adminPassword: string) {
    try {
        console.log("Starting API test");
        const api = new RaffleAPI(baseUrl, false);
        api.admin.setAccessPassword(adminPassword);

        console.log("Creating User Password");
        const userPw = await api.admin.createPassword();
        api.user.setAccessPassword(userPw.value);

        console.log("Listing User Passwords");
        assertEquals(1, (await api.admin.getPasswords()).length);

        console.log("Checking User Password Role");
        assertEquals(UserRole.User, (await api.checkRole(userPw.value)).role);

        console.log("Updating Welcome Page");
        const newWelcomePage = { title: "Hello, World!", description: "Description test", image: "Base64 Image" } as WelcomePage;
        await api.admin.updateWelcomePage(newWelcomePage);

        console.log("Fetching Welcome Page");
        const welcomePage = await api.user.getWelcomePage();
        assertEquals(newWelcomePage.title, welcomePage.title);
        
        console.log("Creating User");
        await api.user.createUser({ name: "Max Musterfrau", email: "haha@lol.de", mobile: "-49314159" });

        console.log("Listing Users");
        const users = await api.admin.getUsers();
        assertEquals(1, users.length);

        console.log("Updating User Ticket Count");
        await api.admin.updateTicketCount({ id: users[0].id, tickets: 20 });

        console.log("Beginning Raffle");
        const raffle = await api.admin.startRaffle();
        assertEquals(users[0].name, raffle.winnerName);

        console.log("Listing Raffles");
        assertEquals(1, (await api.admin.getRaffles()).length);

        console.log("Deleting Raffle");
        await api.admin.deleteRaffle(raffle.id);

        console.log("Deleting User");
        await api.admin.deleteUser(users[0].id);

        console.log("Deleting Password");
        await api.admin.deletePassword(userPw.id);
    } catch(e) {
        console.log(e);
    }
}

function assertEquals<T>(a: T, b: T) {
    if (a != b && a !== b) throw new Error(`Assertion failed: ${a} != ${b}`);
}