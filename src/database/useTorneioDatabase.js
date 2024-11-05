import { useSQLiteContext } from "expo-sqlite";

export function useTorneioDatabase() {
    const database = useSQLiteContext();

    async function createTorneio({ nome, data_torneio, local, linkLocal, foto, descricao }) {
        console.log("createTorneio: ", { nome, data_torneio, local, linkLocal, foto, descricao });
        const statement = await database.prepareAsync(`
            INSERT INTO torneios (nome, data_torneio, local, linkLocal, foto, descricao) VALUES ($nome, $data_torneio, $local, $linkLocal, $foto, $descricao);
        `);

        try {
            const result = await statement.executeAsync({ 
                $nome: nome, 
                $data_torneio: data_torneio,
                $local: local, 
                $linkLocal: linkLocal,
                $foto: foto, 
                $descricao: descricao 
            });
            const insertedID = result.lastInsertRowId.toString();
            return { insertedID };
        } catch (error) {
            console.log("Erro na criação do torneio:", error);
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }

    async function getAllTorneios() {
        try {
            const result = await database.getAllAsync(`
                SELECT * FROM torneios
            `);
            return result;
        } catch (error) {
            console.error("useTorneioDatabase.getAllTorneios: ", error);
            throw error;
        }
    }

    const deleteTorneio = async (id) => {
        try {
            await database.execAsync(`
                DELETE FROM torneios WHERE id = ${id}
            `);
            console.log(`Torneio com ID ${id} deletado com sucesso.`);
        } catch (error) {
            console.error("useTorneioDatabase.deleteTorneio: ", error);
            throw error;
        }
    };

    return { createTorneio, getAllTorneios, deleteTorneio };
}
