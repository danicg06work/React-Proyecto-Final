import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import { User, Game } from './models/index.js';
import authRoutes from './routes/authRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Seed function
const seedDatabase = async () => {
    try {
        const gamesCount = await Game.count();
        if (gamesCount === 0) {
            console.log('Seeding database...');

            const dbPath = path.join(__dirname, '../db.json');
            if (fs.existsSync(dbPath)) {
                const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
                if (data.videojuegos) {
                    // Create a default admin user
                    let adminUser = await User.findOne({ where: { username: 'admin' } });
                    if (!adminUser) {
                        const hashedPassword = await bcrypt.hash('123456', 8);
                        adminUser = await User.create({
                            username: 'admin',
                            password: hashedPassword,
                            role: 'admin'
                        });
                        console.log('Admin user created (username: admin, password: 123456)');
                    }

                    const gamesToCreate = data.videojuegos.map(g => ({
                        nombre: g.nombre,
                        descripcion: g.descripcion,
                        fecha_lanzamiento: g.fecha_lanzamiento,
                        compania: g.compania,
                        plataformas: g.plataformas, // Sequelize will stringify if DataTypes.JSON
                        categorias: g.categorias,
                        precio: g.precio,
                        imagen: g.imagen,
                        video: g.video,
                        userId: adminUser.id
                    }));

                    await Game.bulkCreate(gamesToCreate);
                    console.log(`Database seeded with ${gamesToCreate.length} games`);
                }
            } else {
                console.log('db.json not found for seeding');
            }
        }
    } catch (error) {
        console.error('Seeding error:', error);
    }
};

// Start server
sequelize.sync({ force: false })
    .then(async () => {
        console.log('Database connected');
        await seedDatabase();
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => console.error('Database connection error:', err));
