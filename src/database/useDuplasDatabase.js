import { useSQLiteContext } from "expo-sqlite";

export function useDuplasDatabase() {
    const database = useSQLiteContext();

    async function createDupla({ jogadorOne, jogadorTwo, torneio }) {
        const statement = await database.prepareAsync(`
            INSERT INTO duplas (jogadorOne, jogadorTwo, torneio) VALUES ($jogadorOne, $jogadorTwo, $torneio);
        `);
        try {
            const result = await statement.executeAsync({ $jogadorOne: jogadorOne, $jogadorTwo: jogadorTwo, $torneio: torneio });
            const insertedID = result.lastInsertRowId.toString();
            return { insertedID };
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }

    async function getAllDuplas() {
        try {
            const result = await database.getAllAsync(`
                SELECT * FROM duplas
            `);
            return result;
        } catch (error) {
            console.error("useDuplasDatabase.getAllDuplas: ", error);
            throw error;
        }
    }

    async function deleteDupla(id) {
        const statement = await database.prepareAsync(`
            DELETE FROM duplas WHERE id = $id;
        `);
        try {
            await statement.executeAsync({ $id: id });
        } catch (error) {
            console.error("useDuplasDatabase.deleteDupla: ", error);
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }

    return {
        createDupla,
        getAllDuplas,
        deleteDupla,
    };
}
