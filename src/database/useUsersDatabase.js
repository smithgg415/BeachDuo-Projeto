import { useSQLiteContext } from "expo-sqlite";
export function useUsersDatabase() {
    const database = useSQLiteContext();
    async function authUser({ username, senha }) {
        // console.log("authUser username: ", username, " fr- senha: ", senha);
        try {
            const result = await database.getFirstAsync(`
                
                SELECT id, username, role FROM users WHERE username = '${username}' AND senha = '${senha}'
                
                `);
            return result;
        } catch (error) {
            console.error("useUsersDatabase.authUser: ", error);
            throw error;
        }
    }
    const createUser = async ({ username, senha }) => {
        const statement = await database.prepareAsync(`
            INSERT INTO users (username, senha) VALUES ($username, $senha);
        `);
        try {
            const result = await statement.executeAsync({ $username: username, $senha: senha });
            const insertedID = result.lastInsertRowId.toString();
            return { insertedID };
        } catch (error) {
            console.log("Erro na criação do usuário:", error);
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }
    const deleteAccount = async (username, senha) => {
        let statement;
        try {
            statement = await database.prepareAsync(`
                DELETE FROM users WHERE username = $username AND senha = $senha
            `);

            const result = await statement.executeAsync({
                $username: username,
                $senha: senha
            });

            if (result.rowsAffected > 0) {
                console.log("Conta deletada com sucesso");
                return { success: true };
            } else {
                console.log("Nenhuma conta encontrada com esse username e senha");
                return { success: false };
            }
        } catch (error) {
            console.error("Erro ao deletar conta:", error);
            throw error;
        } finally {
            if (statement) {
                await statement.finalizeAsync();
            }
        }
    };



    const userExists = async (username) => {
        try {
            const result = await database.getFirstAsync(`
            SELECT id FROM users WHERE username = '${username}'
          `);

            return result !== undefined;
        } catch (error) {
            console.error("Erro ao verificar se o usuário existe:", error);
            throw error;
        }
    };
    async function getAllUsers() {
        try {
            const result = await database.getAllAsync(`
                SELECT id, username FROM users
                `);
            return result;
        } catch (error) {
            console.error("useUsersDatabase.getAllUsers: ", error);
            throw error;
        }
    }
    return {
        authUser, getAllUsers, createUser, deleteAccount, userExists
    }
}