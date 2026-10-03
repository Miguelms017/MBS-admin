import mysql from "mysql2";

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    //port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}).promise()

export async function get() {
    const result = await pool.query(`
        SELECT * FROM Appts ORDER BY Date ASC`);
    return result;
}

export async function erase(id) {
    const result = await pool.query(`
        DELETE FROM Appts WHERE id = ?`, [id]);
    return result;
}

export async function create(Fname, Lname, phone, email, date, hairstylist, service, description) {
    const result = await pool.query(`
        INSERT INTO Appts (\`First Name\`, \`Last Name\`, \`Phone\`, \`Email\`, \`Date\`, \`Hairstylist\`, \`Service\`, \`Description\`) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [Fname, Lname, phone, email, date, hairstylist, service, description]
    );
    return result;
}

//const answer = await get();
//console.log(answer);