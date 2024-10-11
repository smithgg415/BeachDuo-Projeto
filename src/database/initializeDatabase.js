export async function initializeDatabase(database) {
    try {
        await database.execAsync(`
        DROP TABLE IF EXISTS duplas;


        DROP TABLE IF EXISTS users;
        
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            senha TEXT NOT NULL DEFAULT '12345678',
            role TEXT NOT NULL DEFAULT 'USER',
            created_at DATE DEFAULT CURRENT_TIMESTAMP,
            updated_at DATE
        );

          CREATE TABLE IF NOT EXISTS duplas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            jogadorOne TEXT NOT NULL,
            jogadorTwo TEXT NOT NULL,
            torneio TEXT NOT NULL,
            created_at DATE DEFAULT CURRENT_TIMESTAMP,
            updated_at DATE
            );
        INSERT OR REPLACE INTO users (username, senha, role) VALUES ('Giacomelli', '12345678', 'ADMIN');
        INSERT OR REPLACE INTO users (username, senha, role) VALUES ('user', '12345678', 'USER');
        INSERT OR REPLACE INTO users (username, senha, role) VALUES ('super', '12345678', 'SUPER');
        `);
    }
    catch (error) {
        console.error(error);
    }
}