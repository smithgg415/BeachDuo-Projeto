import { useSQLiteContext } from "expo-sqlite";
export function useDuplasDatabase(){
    const database = useSQLiteContext();
    async function createDupla({jogadorOne, jogadorTwo, torneio }) {
        // console.log("createDupla: ", {jogadorOne, jogadorTwo, torneio})
        const statment = await database.prepareAsync(`
            INSERT INTO duplas (jogadorOne, jogadorTwo, torneio) VALUES ($jogadorOne, $jogadorTwo, $torneio);
            `);
            try {
                const result = await statment.executeAsync({ $jogadorOne: jogadorOne, $jogadorTwo: jogadorTwo, $torneio: torneio });
                const insertedID = result.lastInsertRowId.toString();
                return{insertedID};
            
        } catch (error) {
            console.log(error);
            throw error;

        } finally {
            await statment.finalizeAsync();
        }
    }
    return{createDupla}
}