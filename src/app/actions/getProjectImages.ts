'use server';

import fs from 'fs';
import path from 'path';

export async function getProjectImages(folderPath: string): Promise<string[]> {
    try {
        const publicDir = path.join(process.cwd(), 'public');
        const projectDir = path.join(publicDir, folderPath);

        // Sanity check to prevent directory traversal
        if (!projectDir.startsWith(publicDir)) {
            console.error('Invalid directory access attempt:', folderPath);
            return [];
        }

        if (!fs.existsSync(projectDir)) {
            console.warn('Project directory not found:', folderPath);
            return [];
        }

        const files = await fs.promises.readdir(projectDir);

        const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

        const images = files
            .filter(file => imageExtensions.includes(path.extname(file).toLowerCase()))
            .map(file => path.join(folderPath, file).replace(/\\/g, '/')) // Ensure web-friendly paths
            .sort((a, b) => {
                // Try natural sort if files are numbered
                return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
            });

        return images;

    } catch (error) {
        console.error('Error fetching project images:', error);
        return [];
    }
}
