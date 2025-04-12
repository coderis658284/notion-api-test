import { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

const _token = "token"
const _db_id = "db"

const notion = axios.create({
    baseURL: 'https://api.notion.com/v1',
    headers: {
        Authorization: `Bearer ${_token}`,
        'Notion-Version': '2022-06-28',
    }
});

// Get users
export const getUsers = async (_req: Request, res: Response) => {

    const { data } = await notion.post(`/databases/${_db_id}/query`);
    console.log(data);

    const users = data.results.map((user: any) => ({
        id: user.id,
        name: user.properties.Name.title[0]?.plain_text,
        email: user.properties.Email.email,
        role: user.properties.Role.rich_text[0]?.plain_text,
    }));
    res.json(users);
};

// Create User
export const createUser = async (req: Request, res: Response) => {
    const { name, email, role } = req.body;

    if (!name || !email || !role) {
        res.status(400).json({ error: "Please provide name, email, and role." });
    } else {
        try {
            // 👇 Query Notion for existing email
            const queryResponse = await notion.post(`/databases/${_db_id}/query`, {
                filter: {
                    property: "Email",
                    email: {
                        equals: email,
                    },
                },
            });

            if (queryResponse.data.results.length > 0) {
                res.status(400).json({ error: "Email already exists." });
            } else {

                // 👇 If no duplicate, proceed with creation
                await notion.post('/pages', {
                    parent: { database_id: _db_id },
                    properties: {
                        Name: { title: [{ text: { content: name } }] },
                        Email: { email: email },
                        Role: { rich_text: [{ text: { content: role } }] },
                    }
                });
                res.status(201).json({ message: 'User created' });
            }
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
};

// Update User
export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email, role } = req.body;
    await notion.patch(`/pages/${id}`, {
        properties: {
            Name: { title: [{ text: { content: name } }] },
            Email: { email: email },
            Role: { rich_text: [{ text: { content: role } }] },
        }
    });
    res.json({ message: 'User updated' });
};

// Delete User
export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    await notion.patch(`/pages/${id}`, { archived: true });
    res.json({ message: 'User deleted' });
};
