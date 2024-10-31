export async function initializeDatabase(database) {
    try {
        await database.execAsync(`
           /* DROP TABLE IF EXISTS duplas;

            DROP TABLE IF EXISTS users;
            
            DROP TABLE IF EXISTS torneios;
            
            DROP INDEX IF EXISTS idx_users_username;
            
            DROP INDEX IF EXISTS idx_duplas_torneio;*/

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

             CREATE TABLE IF NOT EXISTS torneios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                local TEXT NOT NULL, 
                data_torneio DATE NOT NULL,
                foto TEXT NOT NULL,
                descricao TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME
            );

            CREATE INDEX IF NOT EXISTS idx_users_username ON users (username);
            CREATE INDEX IF NOT EXISTS idx_duplas_torneio ON duplas (torneio);

            
            /*INSERT OR REPLACE INTO users (username, senha, role) VALUES ('Giacomelli', '12345678', 'ADMIN');
            
            INSERT OR REPLACE INTO users (username, senha, role) VALUES ('user', '12345678', 'USER');

            INSERT OR REPLACE INTO users (username, senha, role) VALUES ('super', '12345678', 'SUPER');*/
            `);
    } catch (error) {
        console.error("Erro ao criar tabelas:", error);
    }
}
