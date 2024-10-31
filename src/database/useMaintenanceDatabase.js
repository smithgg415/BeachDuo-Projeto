import { useSQLiteContext } from 'expo-sqlite';

export function useMaintenanceDatabase() {
    const database = useSQLiteContext();

    async function resetDatabase() {
        try {
            await database.withTransactionAsync(async () => {
                await database.execAsync(`DROP TABLE IF EXISTS duplas`);
                await database.execAsync(`DROP TABLE IF EXISTS users`);
                await database.execAsync(`DROP INDEX IF EXISTS idx_users_nome`);
                
                await database.execAsync(`
                    CREATE TABLE users (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        username TEXT NOT NULL UNIQUE,
                        senha TEXT NOT NULL DEFAULT '12345678',
                        role TEXT NOT NULL DEFAULT 'USER',
                        created_at DATE DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATE
                    );
                `);

                await database.execAsync(`
                    CREATE TABLE duplas (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        jogadorOne TEXT NOT NULL,
                        jogadorTwo TEXT NOT NULL,
                        torneio TEXT NOT NULL,
                        created_at DATE DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATE
                    );
                `);
                await database.execAsync(`
                    CREATE TABLE torneios (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        nome TEXT NOT NULL,
                        data_torneio DATE NOT NULL,
                        local TEXT NOT NULL,
                        foto TEXT NOT NULL,
                        descricao TEXT NOT NULL,
                        created_at DATE DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATE
                    );
                `);

                await database.execAsync(`CREATE INDEX IF NOT EXISTS idx_users_username ON users (username);`);
                await database.execAsync(`CREATE INDEX IF NOT EXISTS idx_duplas_torneio ON duplas (torneio);`);
                
                await database.execAsync(`INSERT OR REPLACE INTO users (username, senha, role) VALUES ('Giacomelli', '12345678', 'ADMIN');`);
                await database.execAsync(`INSERT OR REPLACE INTO users (username, senha, role) VALUES ('user', '12345678', 'USER');`);
                await database.execAsync(`INSERT OR REPLACE INTO users (username, senha, role) VALUES ('super', '12345678', 'SUPER');`);
            });

            console.log("Banco de dados resetado com sucesso!");
        } catch (error) {
            console.log("Erro ao resetar banco de dados", error);
        }
    }

    async function importUsers() {
        const URL = "https://api.mockaroo.com/api/d13be700?count=10&key=da02a8b0";
        try {
            const response = await fetch(URL);
            const users = await response.text();
            await database.withTransactionAsync(async () => {
                users.split(/\r?\n/).forEach(async (line) => {
                    try {
                        await database.execAsync(line);
                    } catch (error) {
                        console.log("Erro ao importar usuario", error);
                        throw error;
                    }
                });
            });
            console.log("Usuarios importados com sucesso!");
        } catch (error) {
            console.log("Erro ao importar usuarios", error);
        }
    }
    async function importDuplas() {
        const URL = "https://api.mockaroo.com/api/9650b130?count=10&key=da02a8b0";
        try {
            const response = await fetch(URL);
            const duplas = await response.text();
            await database.withTransactionAsync(async () => {
                duplas.split(/\r?\n/).forEach(async (line) => {
                    try {
                        await database.execAsync(line);
                    } catch (error) {
                        console.log("Erro ao importar duplas", error);
                        throw error;
                    }
                });
            });
            console.log("Duplas importadas com sucesso!");
        } catch (error) {
            console.log("Erro ao importar duplas", error);
        }
    }
    async function importTorneios() {
        const URL = "https://api.mockaroo.com/api/affe55e0?count=10&key=da02a8b0";
        try {
            const response = await fetch(URL);
            const torneios = await response.text();
            await database.withTransactionAsync(async () => {
                torneios.split(/\r?\n/).forEach(async (line) => {
                    try {
                        await database.execAsync(line);
                    } catch (error) {
                        console.log("Erro ao importar torneios", error);
                        throw error;
                    }
                });
            });
            console.log("Torneios importados com sucesso!");
        } catch (error) {
            console.log("Erro ao importar torneios", error);
        }
    }
    async function deleteAll(){
        try {
            await database.execAsync(`DELETE FROM users`);
            await database.execAsync(`DELETE FROM duplas`);
            await database.execAsync(`DELETE FROM torneios`);
            console.log("Tudo deletado com sucesso!");
        } catch (error) {
            console.log("Erro ao deletar tudo", error);
        }
    }

    return { resetDatabase, importUsers, importDuplas, importTorneios, deleteAll };
}
