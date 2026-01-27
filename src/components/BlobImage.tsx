'use client';

import { motion } from 'framer-motion';
import styles from './BlobImage.module.css';

interface BlobImageProps {
    src: string;
    alt: string;
}

export default function BlobImage({ src, alt }: BlobImageProps) {
    // Blob path data from CodePen/Gist
    const pathData = "M43.1,-68.5C56.2,-58.6,67.5,-47.3,72.3,-33.9C77.2,-20.5,75.5,-4.9,74.2,11.3C72.9,27.6,71.9,44.5,63.8,57.2C55.7,69.8,40.6,78.2,25.5,79.2C10.4,80.1,-4.7,73.6,-20.9,69.6C-37.1,65.5,-54.5,63.9,-66,54.8C-77.5,45.8,-83.2,29.3,-85.7,12.3C-88.3,-4.8,-87.7,-22.3,-79.6,-34.8C-71.5,-47.3,-55.8,-54.9,-41.3,-64.2C-26.7,-73.6,-13.4,-84.7,0.8,-86C15,-87.2,29.9,-78.5,43.1,-68.5Z";

    return (
        <div className={styles.container}>
            <svg
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.svg}
                width="100%"
                height="100%"
                aria-labelledby="t"
            >
                <image
                    href={src}
                    x="0"
                    y="0"
                    width="200"
                    height="200"
                    clipPath="url(#blobClip)"
                    preserveAspectRatio="xMidYMid slice"
                />

                <clipPath id="blobClip">
                    <path
                        d={pathData}
                        transform="translate(100 100)"
                    />
                </clipPath>

                <path
                    className={styles.blob}
                    d={pathData}
                    transform="translate(100 100)"
                    fill="none"
                />

                <path
                    id="textPath"
                    d={pathData}
                    transform="translate(100 100)"
                    fill="none"
                    stroke="none"
                    pathLength="100"
                />

                <text className={styles.textContent}>
                    <textPath href="#textPath" startOffset="0%">
                        ❤ MADE WITH LOVE ❤ MADE WITH LOVE ❤ MADE WITH LOVE ❤ MADE WITH LOVE
                        <animate attributeName="startOffset" from="0%" to="100%" dur="15s" repeatCount="indefinite" />
                    </textPath>
                    <textPath href="#textPath" startOffset="100%">
                        ❤ MADE WITH LOVE ❤ MADE WITH LOVE ❤ MADE WITH LOVE ❤ MADE WITH LOVE
                        <animate attributeName="startOffset" from="-100%" to="0%" dur="15s" repeatCount="indefinite" />
                    </textPath>
                </text>
            </svg>
        </div>
    );
}
