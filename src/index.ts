import { initServer } from "./app";
import dotenv from "dotenv";
dotenv.config();

async function init() {
    const app = await initServer();
    app.listen(4000, () => {
        console.log('Server is running on http://localhost:4000/graphql');
    });
}
init();  