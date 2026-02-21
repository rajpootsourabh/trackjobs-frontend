// src/features/jobs/components/JobView/InstructionsSection.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
    Paper,
    Typography,
    Button,
    Box,
    IconButton,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    ImageList,
    ImageListItem,
    ImageListItemBar,
    Tooltip,
    CircularProgress
} from '@mui/material';
import {
    AttachFile,
    Image,
    Delete,
    Download,
    Visibility,
    AddPhotoAlternate,
    Close,
    InsertDriveFile,
    PictureAsPdf,
    Description,
    Edit,
    Save,
    Cancel,
    NoteAdd,
    Notes,
    OpenInFull
} from '@mui/icons-material';
import SectionHeader from '../../../../components/common/form/SectionHeader';
import EllipsisText from '../../../../components/common/EllipsisText';
import { useToast } from '../../../../components/common/ToastProvider';
import jobService from '../../services/jobService';
import { useParams } from 'react-router-dom';

// Helper function to get icon based on file type
const getFileIcon = (fileType, fileName) => {
    if (fileType === 'image') return <Image color="primary" />;
    if (fileType === 'pdf') return <PictureAsPdf color="error" />;
    if (fileType === 'document') return <Description color="primary" />;

    const extension = fileName?.split('.').pop()?.toLowerCase() || '';
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension)) {
        return <Image color="primary" />;
    }
    if (extension === 'pdf') return <PictureAsPdf color="error" />;

    return <AttachFile color="action" />;
};

// Helper function to format file size
const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

const InstructionsSection = ({
    instructions: initialInstructions = '',
    onUpdate,
    jobId: propJobId
}) => {
    const { id: urlId } = useParams();
    const currentJobId = propJobId || urlId;

    const { showToast } = useToast();
    const textRef = useRef(null);
    const [isTruncated, setIsTruncated] = useState(false);
    
    // State for edit dialog
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    // State for instructions
    const [instructions, setInstructions] = useState(initialInstructions);
    const [tempInstructions, setTempInstructions] = useState('');
    const [updating, setUpdating] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    // State for attachments
    const [attachments, setAttachments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showAttachments, setShowAttachments] = useState(false);

    // Update local state when props change
    useEffect(() => {
        setInstructions(initialInstructions);
    }, [initialInstructions]);

    // Check if text needs truncation
    useEffect(() => {
        if (textRef.current && instructions) {
            const lineHeight = parseInt(getComputedStyle(textRef.current).lineHeight);
            const maxHeight = lineHeight * 3; // 3 lines
            setIsTruncated(textRef.current.scrollHeight > maxHeight);
        }
    }, [instructions]);

    // Fetch attachments when component mounts
    useEffect(() => {
        if (currentJobId) {
            fetchAttachments();
        }
    }, [currentJobId]);

    const fetchAttachments = async () => {
        if (!currentJobId) return;

        try {
            setLoading(true);
            const response = await jobService.getJobById(currentJobId);
            // Sort attachments by created_at in descending order and take latest 8
            const allAttachments = response.data.data.attachments || [];
            const sortedAttachments = [...allAttachments].sort((a, b) =>
                new Date(b.created_at) - new Date(a.created_at)
            ).slice(0, 8);
            setAttachments(sortedAttachments);
        } catch (error) {
            console.error('Error fetching attachments:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle instructions edit
    const handleEdit = () => {
        setTempInstructions(instructions);
        setEditDialogOpen(true);
    };

    const handleEditDialogClose = () => {
        setEditDialogOpen(false);
        setTempInstructions('');
    };

    const handleSave = async () => {
        if (!currentJobId) return;

        setUpdating(true);
        try {
            await jobService.updateJob(currentJobId, { instructions: tempInstructions });
            setInstructions(tempInstructions);
            setEditDialogOpen(false);
            showToast('Instructions updated successfully', 'success');

            if (onUpdate) {
                onUpdate({ instructions: tempInstructions });
            }
        } catch (error) {
            console.error('Error updating instructions:', error);
            showToast('Failed to update instructions', 'error');
        } finally {
            setUpdating(false);
            setTempInstructions('');
        }
    };

    const handleReadMoreClick = (e) => {
        e.stopPropagation();
        handleEdit();
    };

    const handleFileUpload = async (event) => {
        const files = event.target.files;
        if (!files || files.length === 0 || !currentJobId) return;

        setUploading(true);

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const response = await jobService.addAttachment(currentJobId, file, file.name);
                const newAttachment = response.data.data;

                // Add new attachment to the beginning and keep only latest 8
                setAttachments(prev => {
                    const updated = [newAttachment, ...prev];
                    return updated.slice(0, 8);
                });
                showToast(`File "${file.name}" uploaded successfully`, 'success');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            showToast('Failed to upload file', 'error');
        } finally {
            setUploading(false);
            event.target.value = '';
        }
    };

    const handleRemoveAttachment = async (attachmentId, fileName) => {
        if (!currentJobId) return;

        try {
            await jobService.deleteAttachment(currentJobId, attachmentId);
            setAttachments(prev => prev.filter(a => a.id !== attachmentId));
            showToast(`File "${fileName}" deleted successfully`, 'success');
        } catch (error) {
            console.error('Error deleting attachment:', error);
            showToast('Failed to delete file', 'error');
        }
    };

    const handleDownload = (url, fileName) => {
        if (url) {
            window.open(url, '_blank');
        }
    };

    const handleImageClick = (image) => {
        setSelectedImage(image);
    };

    const handleCloseImage = () => {
        setSelectedImage(null);
    };

    const isImage = (file) => {
        return file.file_type === 'image' ||
            ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(file.extension?.toLowerCase());
    };

    const hasAttachments = attachments.length > 0;
    const hasInstructions = instructions && instructions.trim().length > 0;

    return (
        <>
            <Paper sx={{
                p: 3,
                borderRadius: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'auto',
                maxHeight: 600
            }}>
                <SectionHeader number="2" title="Instructions & Notes" />

                {/* Instructions Section */}
                <Box sx={{
                    mb: 2,
                    ...(!hasInstructions && !hasAttachments ? { flex: 1 } : {})
                }}>
                    <Box
                        sx={{
                            position: 'relative',
                            bgcolor: hasInstructions ? 'grey.50' : 'transparent',
                            p: hasInstructions ? 2.5 : 0,
                            borderRadius: 1,
                            minHeight: hasInstructions ? 'auto' : '80px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            border: !hasInstructions ? '2px dashed' : 'none',
                            borderColor: 'grey.300',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            '&:hover': {
                                bgcolor: hasInstructions ? 'grey.100' : 'grey.100',
                                borderColor: 'primary.main',
                                '& .add-icon': {
                                    color: 'primary.main',
                                    transform: 'scale(1.1)'
                                },
                                '& .edit-icon, & .expand-icon': {
                                    opacity: 1
                                }
                            }
                        }}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                        onClick={handleEdit}
                    >
                        {hasInstructions ? (
                            <Box sx={{ position: 'relative', width: '100%' }}>
                                <Typography
                                    ref={textRef}
                                    variant="body1"
                                    sx={{
                                        color: 'text.primary',
                                        lineHeight: 1.3,
                                        fontSize: '0.95rem',
                                        pr: 4,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'normal',
                                        wordBreak: 'break-word',
                                    }}
                                >
                                    {instructions}
                                </Typography>

                                {isTruncated && (
                                    <Button
                                        size="small"
                                        startIcon={<OpenInFull fontSize="small" />}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleReadMoreClick(e);
                                        }}
                                        sx={{
                                            mt: 0.5,
                                            textTransform: 'none',
                                            fontSize: '0.8rem',
                                            color: 'primary.main'
                                        }}
                                    >
                                        Read more
                                    </Button>
                                )}

                                {/* Pencil icon that appears on hover */}
                                <IconButton
                                    className="edit-icon"
                                    size="small"
                                    sx={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                        opacity: 0,
                                        transition: 'opacity 0.2s',
                                        bgcolor: 'background.paper',
                                        boxShadow: 1,
                                        '&:hover': {
                                            bgcolor: 'primary.main',
                                            color: 'white'
                                        }
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEdit();
                                    }}
                                >
                                    <Edit fontSize="small" />
                                </IconButton>
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    py: 2,
                                    gap: 1
                                }}
                            >
                                <NoteAdd
                                    className="add-icon"
                                    sx={{
                                        fontSize: 32,
                                        color: 'grey.400',
                                        transition: 'all 0.2s ease'
                                    }}
                                />
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: 'text.secondary',
                                        fontWeight: 500
                                    }}
                                >
                                    Click to add instructions
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: 'text.disabled',
                                        textAlign: 'center'
                                    }}
                                >
                                    Add details about the job requirements, steps, or special notes
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>

                {/* Action Buttons - File Upload - Only visible when attachments exist */}
                {hasAttachments && (
                    <Box sx={{ display: 'flex', gap: 2, mb: 2, mt: 1, flexWrap: 'wrap' }}>
                        <Button
                            startIcon={uploading ? <CircularProgress size={20} /> : <AttachFile />}
                            variant="outlined"
                            size="small"
                            onClick={() => document.getElementById('file-upload-input').click()}
                            disabled={uploading}
                            sx={{ textTransform: 'none' }}
                        >
                            {uploading ? 'Uploading...' : 'Attach Photos/Files'}
                        </Button>

                        {showAttachments && (
                            <Button
                                startIcon={<AddPhotoAlternate />}
                                variant="contained"
                                size="small"
                                onClick={() => document.getElementById('file-upload-input').click()}
                                disabled={uploading}
                                sx={{ textTransform: 'none' }}
                            >
                                Upload from Device
                            </Button>
                        )}
                    </Box>
                )}

                {/* Hidden file input - Always present but triggered by buttons */}
                <input
                    type="file"
                    id="file-upload-input"
                    style={{ display: 'none' }}
                    multiple
                    onChange={handleFileUpload}
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip"
                />

                {/* Attachments Grid */}
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : attachments.length > 0 ? (
                    <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Recent Files ({attachments.length}/8)
                            </Typography>
                        </Box>
                        <ImageList
                            sx={{
                                width: '100%',
                                maxHeight: 300,
                                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))!important',
                                gap: '8px!important'
                            }}
                            cols={4}
                            rowHeight={100}
                        >
                            {attachments.map((item) => (
                                <ImageListItem
                                    key={item.id}
                                    sx={{
                                        cursor: 'pointer',
                                        borderRadius: 1,
                                        overflow: 'hidden',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        '&:hover': {
                                            '& .image-overlay': {
                                                opacity: 1
                                            }
                                        }
                                    }}
                                >
                                    {isImage(item) ? (
                                        <>
                                            <img
                                                src={item.url}
                                                alt={item.file_name}
                                                loading="lazy"
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    transition: 'transform 0.3s'
                                                }}
                                                onClick={() => handleImageClick(item)}
                                            />
                                            <ImageListItemBar
                                                title={item.file_name.length > 15 ? item.file_name.substring(0, 12) + '...' : item.file_name}
                                                subtitle={item.formatted_size}
                                                sx={{
                                                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, transparent)',
                                                    '& .MuiImageListItemBar-title': {
                                                        fontSize: '0.65rem',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis'
                                                    },
                                                    '& .MuiImageListItemBar-subtitle': {
                                                        fontSize: '0.6rem'
                                                    }
                                                }}
                                            />
                                            <Box
                                                className="image-overlay"
                                                sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    bgcolor: 'rgba(0,0,0,0.5)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: 0.5,
                                                    opacity: 0,
                                                    transition: 'opacity 0.2s'
                                                }}
                                            >
                                                <Tooltip title="Preview">
                                                    <IconButton
                                                        size="small"
                                                        sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.2)' }}
                                                        onClick={() => handleImageClick(item)}
                                                    >
                                                        <Visibility fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Download">
                                                    <IconButton
                                                        size="small"
                                                        sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.2)' }}
                                                        onClick={() => handleDownload(item.url, item.file_name)}
                                                    >
                                                        <Download fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Remove">
                                                    <IconButton
                                                        size="small"
                                                        sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.2)' }}
                                                        onClick={() => handleRemoveAttachment(item.id, item.file_name)}
                                                    >
                                                        <Delete fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </>
                                    ) : (
                                        <Box
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                bgcolor: 'grey.100',
                                                p: 0.5,
                                                textAlign: 'center',
                                                position: 'relative'
                                            }}
                                        >
                                            {getFileIcon(item.file_type, item.file_name)}
                                            <Typography variant="caption" sx={{ mt: 0.5, fontSize: '0.6rem', wordBreak: 'break-word' }}>
                                                {item.file_name.length > 15 ? item.file_name.substring(0, 12) + '...' : item.file_name}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.55rem' }}>
                                                {item.formatted_size}
                                            </Typography>

                                            {/* Overlay for non-image files */}
                                            <Box
                                                className="image-overlay"
                                                sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    bgcolor: 'rgba(0,0,0,0.5)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: 0.5,
                                                    opacity: 0,
                                                    transition: 'opacity 0.2s',
                                                    '&:hover': {
                                                        opacity: 1
                                                    }
                                                }}
                                            >
                                                <Tooltip title="Download">
                                                    <IconButton
                                                        size="small"
                                                        sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.2)' }}
                                                        onClick={() => handleDownload(item.url, item.file_name)}
                                                    >
                                                        <Download fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Remove">
                                                    <IconButton
                                                        size="small"
                                                        sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.2)' }}
                                                        onClick={() => handleRemoveAttachment(item.id, item.file_name)}
                                                    >
                                                        <Delete fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </Box>
                                    )}
                                </ImageListItem>
                            ))}
                        </ImageList>
                    </Box>
                ) : (
                    /* Empty State for Attachments */
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            py: 4,
                            px: 2,
                            bgcolor: 'grey.50',
                            borderRadius: 2,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            border: '2px dashed',
                            borderColor: 'grey.300',
                            minHeight: 120,
                            '&:hover': {
                                bgcolor: 'grey.100',
                                borderColor: 'primary.main',
                                '& .upload-icon': {
                                    color: 'primary.main',
                                    transform: 'scale(1.1)'
                                }
                            }
                        }}
                        onClick={() => document.getElementById('file-upload-input').click()}
                    >
                        <AttachFile
                            className="upload-icon"
                            sx={{
                                fontSize: 32,
                                color: 'grey.400',
                                mb: 1,
                                transition: 'all 0.2s ease'
                            }}
                        />
                        <Typography
                            variant="body2"
                            sx={{
                                color: 'text.secondary',
                                fontWeight: 500,
                                textAlign: 'center'
                            }}
                        >
                            No attachments yet
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                color: 'text.disabled',
                                textAlign: 'center',
                                mt: 0.5
                            }}
                        >
                            Click to upload photos, PDFs, or documents
                        </Typography>
                    </Box>
                )}
            </Paper>

            {/* Edit Instructions Dialog */}
            <Dialog
                open={editDialogOpen}
                onClose={handleEditDialogClose}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        minHeight: '60vh',
                        maxHeight: '80vh'
                    }
                }}
            >
                <DialogTitle sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    pb: 2
                }}>
                    <Typography variant="h6">
                        {hasInstructions ? 'Edit Instructions' : 'Add Instructions'}
                    </Typography>
                    <IconButton onClick={handleEditDialogClose} size="small">
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers sx={{ py: 3 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            autoFocus
                            multiline
                            rows={12}
                            fullWidth
                            value={tempInstructions}
                            onChange={(e) => setTempInstructions(e.target.value)}
                            placeholder="Enter detailed job instructions..."
                            variant="outlined"
                            disabled={updating}
                            sx={{
                                '& .MuiInputBase-root': {
                                    fontSize: '0.95rem',
                                    lineHeight: 1.6
                                }
                            }}
                        />
                        
                        {/* Optional attachments section in dialog */}
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Attachments (Optional)
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <Button
                                    startIcon={uploading ? <CircularProgress size={20} /> : <AttachFile />}
                                    variant="outlined"
                                    size="small"
                                    onClick={() => document.getElementById('dialog-file-upload').click()}
                                    disabled={uploading}
                                    sx={{ textTransform: 'none' }}
                                >
                                    {uploading ? 'Uploading...' : 'Upload Files'}
                                </Button>
                            </Box>
                            <input
                                type="file"
                                id="dialog-file-upload"
                                style={{ display: 'none' }}
                                multiple
                                onChange={handleFileUpload}
                                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip"
                            />
                            
                            {/* Show current attachments count if any */}
                            {attachments.length > 0 && (
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                    {attachments.length} file(s) attached to this job
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Button onClick={handleEditDialogClose} color="inherit">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        startIcon={updating ? <CircularProgress size={16} /> : <Save />}
                        disabled={updating || !tempInstructions.trim()}
                    >
                        {updating ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Image Preview Dialog */}
            <Dialog
                open={Boolean(selectedImage)}
                onClose={handleCloseImage}
                maxWidth="lg"
                fullWidth
            >
                {selectedImage && (
                    <>
                        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" noWrap sx={{ maxWidth: '80%' }}>
                                {selectedImage.file_name}
                            </Typography>
                            <IconButton onClick={handleCloseImage}>
                                <Close />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent dividers>
                            <Box sx={{ textAlign: 'center' }}>
                                <img
                                    src={selectedImage.url}
                                    alt={selectedImage.file_name}
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '70vh',
                                        objectFit: 'contain'
                                    }}
                                />
                                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                                    <Chip
                                        label={`Size: ${selectedImage.formatted_size}`}
                                        size="small"
                                    />
                                    {selectedImage.uploaded_by && (
                                        <Chip
                                            label={`Uploaded by: ${typeof selectedImage.uploaded_by === 'object'
                                                ? (selectedImage.uploaded_by.full_name || selectedImage.uploaded_by.name)
                                                : `User ${selectedImage.uploaded_by}`
                                                }`}
                                            size="small"
                                        />
                                    )}
                                    <Chip
                                        label={selectedImage.uploaded_at}
                                        size="small"
                                    />
                                </Box>
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                startIcon={<Download />}
                                onClick={() => window.open(selectedImage.url, '_blank')}
                            >
                                Download
                            </Button>
                            <Button onClick={handleCloseImage}>Close</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </>
    );
};

export default InstructionsSection;