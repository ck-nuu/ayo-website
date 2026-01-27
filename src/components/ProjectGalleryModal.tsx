'use client';

import React, { useState, useEffect, forwardRef } from 'react';
import {
    Dialog,
    DialogContent,
    IconButton,
    ImageList,
    ImageListItem,
    Slide,
    AppBar,
    Toolbar,
    Typography,
    Box,
    useMediaQuery,
    useTheme,
    CircularProgress,
    Fade
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { X, ChevronLeft, ChevronRight, Grid as GridIcon, Image as ImageIcon, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { getProjectImages } from '@/app/actions/getProjectImages';


interface Project {
    title: string;
    image: string; // cover image
    link?: string | null;
    galleryImages?: string[]; // from database
}

interface ProjectGalleryModalProps {
    isOpen: boolean;
    onClose: () => void;
    project: Project;
}

// Transition for the Dialog
const Transition = forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function ProjectGalleryModal({ isOpen, onClose, project }: ProjectGalleryModalProps) {
    const [images, setImages] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    // Default to 'grid' view
    const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('grid');

    // MUI Hooks
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Force body scroll lock when modal is open
    // This addresses the "double scrollbar" issue by preventing the background page from scrolling
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }
        // Cleanup function to ensure scroll is restored
        return () => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        };
    }, [isOpen]);

    // Fetch images 
    useEffect(() => {
        if (isOpen && project) {
            setIsLoading(true);

            // If project has galleryImages from database, use those
            if (project.galleryImages && project.galleryImages.length > 0) {
                // Combine cover image with gallery images
                const allImages = [project.image, ...project.galleryImages];
                setImages(allImages);
                setCurrentIndex(0);
                setIsLoading(false);
            } else if (project.image.startsWith('/projects/')) {
                // Legacy: fetch from filesystem for local projects
                const folderPath = project.image.substring(0, project.image.lastIndexOf('/'));

                getProjectImages(folderPath).then((fetchedImages) => {
                    if (fetchedImages.length > 0) {
                        const coverIndex = fetchedImages.findIndex(img => img === project.image);
                        setImages(fetchedImages);
                        setCurrentIndex(coverIndex >= 0 ? coverIndex : 0);
                    } else {
                        setImages([project.image]);
                        setCurrentIndex(0);
                    }
                    setIsLoading(false);
                });
            } else {
                // Just the cover image
                setImages([project.image]);
                setCurrentIndex(0);
                setIsLoading(false);
            }
        }
    }, [isOpen, project]);

    // Reset state on close
    useEffect(() => {
        if (!isOpen) {
            const timer = setTimeout(() => {
                setViewMode('grid');
            }, 300);
            return () => clearTimeout(timer);
        } else {
            setViewMode('grid');
        }
    }, [isOpen]);

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity;
    };

    const isSpotify = project.link?.includes('spotify');
    const isApple = project.link?.includes('apple');

    const currentImage = images[currentIndex];

    return (
        <Dialog
            fullScreen
            open={isOpen}
            onClose={onClose}
            TransitionComponent={Transition}
            // Explicitly force hidden overflow on the dialog paper to prevent internal scrolling
            sx={{ '& .MuiDialog-paper': { overflow: 'hidden !important' } }}
            PaperProps={{
                sx: {
                    bgcolor: '#D1F5BE', // Tea Green
                    backgroundImage: 'none',
                    color: '#74226C', // Royal Plum (Scrollbar color)
                    overflow: 'hidden !important' // CRITICAL: Disable Dialog's internal scroll
                }
            }}
        >
            {/* Header / AppBar */}
            <AppBar
                position="fixed"
                sx={{
                    bgcolor: 'transparent',
                    boxShadow: 'none',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 20
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between', minHeight: '64px' }}>
                    <Typography
                        variant="subtitle2"
                        sx={{
                            textTransform: 'uppercase',
                            letterSpacing: '0.2em',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            color: '#74226C',
                            opacity: 0.8
                        }}
                    >
                        {project.title}
                    </Typography>

                    <div className="flex items-center gap-4">
                        {viewMode === 'carousel' && (
                            <IconButton
                                onClick={() => setViewMode('grid')}
                                sx={{ color: '#74226C', opacity: 0.7, '&:hover': { opacity: 1 } }}
                                title="Back to Grid"
                            >
                                <GridIcon size={18} />
                            </IconButton>
                        )}

                        <IconButton
                            edge="end"
                            color="inherit"
                            onClick={onClose}
                            aria-label="close"
                            sx={{ color: '#74226C', opacity: 0.7, '&:hover': { opacity: 1 } }}
                        >
                            <X size={24} />
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>

            {/* Content Area - No Padding on Parent */}
            <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden !important' }}>
                {isLoading ? (
                    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CircularProgress sx={{ color: '#74226C' }} size={30} thickness={2} />
                    </Box>
                ) : (
                    <Box sx={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                        {/* Spacer for Fixed AppBar */}
                        <Box sx={{ height: '64px', flexShrink: 0 }} />

                        {/* GRID VIEW - SCROLLABLE CONTAINER */}
                        <Box sx={{
                            p: isMobile ? 1 : 4,
                            flexGrow: 1,
                            overflowY: 'auto', // ONLY this element scrolls
                            height: '100%',
                            // Custom dark scrollbar
                            '&::-webkit-scrollbar': { width: '8px' },
                            '&::-webkit-scrollbar-track': { background: '#D1F5BE' },
                            '&::-webkit-scrollbar-thumb': { background: '#74226C', borderRadius: '4px' }
                        }}>
                            <ImageList variant="masonry" cols={isMobile ? 2 : 3} gap={isMobile ? 8 : 24}>
                                {images.map((img, index) => (
                                    <ImageListItem
                                        key={img}
                                        sx={{ cursor: 'pointer', overflow: 'hidden' }}
                                        onClick={() => {
                                            setCurrentIndex(index);
                                            setViewMode('carousel');
                                        }}
                                    >
                                        <img
                                            src={img}
                                            alt={`${project.title} ${index + 1}`}
                                            loading="lazy"
                                            style={{
                                                width: '100%',
                                                display: 'block',
                                                transition: 'opacity 0.3s ease',
                                            }}
                                            className="hover:opacity-80 transition-opacity duration-300"
                                        />
                                    </ImageListItem>
                                ))}
                            </ImageList>
                        </Box>

                        {/* CAROUSEL OVERLAY */}
                        <AnimatePresence>
                            {viewMode === 'carousel' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: '#D1F5BE',
                                        zIndex: 10,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        paddingTop: '64px'
                                    }}
                                >
                                    <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <AnimatePresence initial={false} mode="wait">
                                            {currentImage && (
                                                <motion.div
                                                    key={currentIndex}
                                                    className="relative w-full h-full flex items-center justify-center"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    drag="x"
                                                    dragConstraints={{ left: 0, right: 0 }}
                                                    dragElastic={1}
                                                    onDragEnd={(e, { offset, velocity }) => {
                                                        const swipe = swipePower(offset.x, velocity.x);
                                                        if (swipe < -swipeConfidenceThreshold) nextImage();
                                                        else if (swipe > swipeConfidenceThreshold) prevImage();
                                                    }}
                                                >
                                                    <div className="relative w-full h-full p-4 md:p-12">
                                                        <Image
                                                            src={currentImage}
                                                            alt={`Slide ${currentIndex + 1}`}
                                                            fill
                                                            className="object-contain"
                                                            sizes="100vw"
                                                            priority
                                                            style={{ objectFit: 'contain' }}
                                                        />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </Box>

                                    {images.length > 1 && (
                                        <>
                                            <IconButton
                                                onClick={prevImage}
                                                sx={{
                                                    position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)',
                                                    color: '#74226C',
                                                    display: { xs: 'none', md: 'flex' },
                                                    opacity: 0.5,
                                                    '&:hover': { opacity: 1, bgcolor: 'transparent' }
                                                }}
                                            >
                                                <ChevronLeft size={48} strokeWidth={1} />
                                            </IconButton>

                                            <IconButton
                                                onClick={nextImage}
                                                sx={{
                                                    position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)',
                                                    color: '#74226C',
                                                    display: { xs: 'none', md: 'flex' },
                                                    opacity: 0.5,
                                                    '&:hover': { opacity: 1, bgcolor: 'transparent' }
                                                }}
                                            >
                                                <ChevronRight size={48} strokeWidth={1} />
                                            </IconButton>
                                        </>
                                    )}

                                    <Box sx={{
                                        position: 'absolute', bottom: 30, left: 0, right: 0,
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                                        zIndex: 5
                                    }}>
                                        <Typography variant="caption" sx={{ color: '#74226C', opacity: 0.6, letterSpacing: '0.1em' }}>
                                            {currentIndex + 1} of {images.length}
                                        </Typography>

                                        {(isSpotify || isApple) && project.link && (
                                            <a
                                                href={project.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-black/50 hover:text-black transition-colors flex items-center gap-2 text-xs uppercase tracking-widest border border-black/20 rounded-full px-4 py-1"
                                            >
                                                <Music size={12} />
                                                <span>Soundtrack</span>
                                            </a>
                                        )}
                                    </Box>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
}
