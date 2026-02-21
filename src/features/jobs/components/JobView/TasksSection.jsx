// src/features/jobs/components/JobView/TasksSection.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
    Paper,
    Box,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Typography,
    Checkbox,
    Divider,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Menu,
    MenuItem,
    Tooltip
} from '@mui/material';
import {
    Add,
    TaskAlt,
    RadioButtonUnchecked,
    Close,
    MoreVert,
    Delete,
    Edit,
    Event
} from '@mui/icons-material';
import SectionHeader from '../../../../components/common/form/SectionHeader';
import EllipsisText from '../../../../components/common/EllipsisText';

const TasksSection = ({
    tasks = [],
    onAddTask,
    onToggleTask,
    onDeleteTask,
    onEditTask
}) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [newTask, setNewTask] = useState({ name: '', dueDate: '', description: '' });
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const listRef = useRef(null);

    useEffect(() => {
        // Scroll to bottom when new task is added
        if (listRef.current && tasks.length > 0) {
            const { scrollTop, scrollHeight, clientHeight } = listRef.current;
            const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
            if (isNearBottom) {
                setTimeout(() => {
                    if (listRef.current) {
                        listRef.current.scrollTop = listRef.current.scrollHeight;
                    }
                }, 100);
            }
        }
    }, [tasks.length]);

    const hasTasks = tasks && tasks.length > 0;
    const completedCount = tasks.filter(task => task.completed).length;

    const handleOpenAddDialog = () => {
        setEditingTask(null);
        setNewTask({ name: '', dueDate: '', description: '' });
        setOpenDialog(true);
    };

    const handleOpenEditDialog = (task) => {
        setEditingTask(task);
        
        // Format the date properly for the date input (YYYY-MM-DD)
        let formattedDate = '';
        if (task.due_date) {
            const date = new Date(task.due_date);
            // Check if date is valid
            if (!isNaN(date.getTime())) {
                formattedDate = date.toISOString().split('T')[0];
            }
        }
        
        setNewTask({
            name: task.name || '',
            dueDate: formattedDate,
            description: task.description || ''
        });
        setOpenDialog(true);
        handleMenuClose();
    };

    const handleSaveTask = () => {
        if (!newTask.name.trim()) return;

        const taskData = {
            name: newTask.name,
            due_date: newTask.dueDate || null,
            description: newTask.description || null
        };

        if (editingTask) {
            // Handle edit
            onEditTask?.(editingTask.id, taskData);
        } else {
            // Handle add
            onAddTask(taskData);
        }

        setNewTask({ name: '', dueDate: '', description: '' });
        setOpenDialog(false);
        setEditingTask(null);
    };

    const handleMenuOpen = (event, task) => {
        setAnchorEl(event.currentTarget);
        setSelectedTask(task);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedTask(null);
    };

    const handleDeleteClick = () => {
        if (selectedTask) {
            onDeleteTask(selectedTask.id);
        }
        handleMenuClose();
    };

    const handleInputChange = (e) => {
        setNewTask({
            ...newTask,
            [e.target.name]: e.target.value
        });
    };

    const handleSetTodayDate = () => {
        const today = new Date().toISOString().split('T')[0];
        setNewTask({ ...newTask, dueDate: today });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Check if date is today
        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        }
        // Check if date is tomorrow
        if (date.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow';
        }

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const isOverdue = (dateString) => {
        if (!dateString) return false;
        const dueDate = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return dueDate < today;
    };

    const showScrollbar = tasks.length > 4;

    return (
        <>
            <Paper sx={{
                p: 2.5,
                borderRadius: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                minHeight: 400
            }}>
                {/* Header */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: hasTasks ? 1.5 : 0,
                    px: 0.5
                }}>
                    <Box>
                        <SectionHeader number="3" title="Tasks & Checklist" />
                        {hasTasks && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                {completedCount} of {tasks.length} completed ({Math.round((completedCount / tasks.length) * 100)}%)
                            </Typography>
                        )}
                    </Box>
                    
                    {/* Add Task button - Only visible when tasks exist */}
                    {hasTasks && (
                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<Add />}
                            onClick={handleOpenAddDialog}
                            sx={{ textTransform: 'none' }}
                        >
                            Add task
                        </Button>
                    )}
                </Box>

                {/* Empty State - Shows when no tasks exist */}
                {!hasTasks ? (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            py: 4,
                            px: 2,
                            flex: 1,
                            minHeight: 300
                        }}
                    >
                        <TaskAlt sx={{ fontSize: 48, color: 'grey.300', mb: 1.5 }} />
                        <Typography variant="body1" color="text.secondary" gutterBottom fontWeight={500}>
                            No tasks yet
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, textAlign: 'center', maxWidth: 250 }}>
                            Add tasks to track what needs to be done for this job
                        </Typography>
                        <Button
                            variant="contained"
                            size="medium"
                            startIcon={<Add />}
                            onClick={handleOpenAddDialog}
                            sx={{ textTransform: 'none' }}
                        >
                            Add your first task
                        </Button>
                    </Box>
                ) : (
                    /* Tasks List - Shows when tasks exist */
                    <List
                        ref={listRef}
                        sx={{
                            flex: 1,
                            mt: 0.5,
                            overflow: 'auto',
                            px: 0.5,
                            pr: showScrollbar ? 0.5 : 0.5,
                            '&::-webkit-scrollbar': {
                                width: '6px',
                            },
                            '&::-webkit-scrollbar-track': {
                                background: '#f1f1f1',
                                borderRadius: '10px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                background: '#c1c1c1',
                                borderRadius: '10px',
                                '&:hover': {
                                    background: '#a8a8a8',
                                },
                            },
                            maxHeight: tasks.length > 4 ? '350px' : 'none',
                        }}
                    >
                        {tasks.map((task, index) => {
                            const overdue = !task.completed && isOverdue(task.due_date);

                            return (
                                <React.Fragment key={task.id}>
                                    <ListItem
                                        sx={{
                                            px: 1.5,
                                            py: 0.8,
                                            alignItems: 'flex-start',
                                            '&:hover': {
                                                bgcolor: 'action.hover',
                                                borderRadius: 1,
                                                '& .task-actions': {
                                                    opacity: 1
                                                }
                                            }
                                        }}
                                        secondaryAction={
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                                minWidth: 90,
                                                justifyContent: 'flex-end'
                                            }}>
                                                <Tooltip title={task.due_date ? new Date(task.due_date).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                }) : 'No due date'}>
                                                    <Box sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 0.5,
                                                        color: overdue ? 'error.main' : 'text.secondary'
                                                    }}>
                                                        <Event sx={{ fontSize: 14 }} />
                                                        <Typography
                                                            variant="caption"
                                                            sx={{
                                                                fontWeight: overdue ? 600 : 400,
                                                                color: 'inherit'
                                                            }}
                                                        >
                                                            {formatDate(task.due_date)}
                                                        </Typography>
                                                    </Box>
                                                </Tooltip>
                                                <Box
                                                    className="task-actions"
                                                    sx={{
                                                        opacity: 0,
                                                        transition: 'opacity 0.2s'
                                                    }}
                                                >
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => handleMenuOpen(e, task)}
                                                    >
                                                        <MoreVert fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        }
                                    >
                                        <ListItemIcon sx={{ minWidth: 40, mt: -0.5 }}>
                                            <Checkbox
                                                edge="start"
                                                checked={task.completed}
                                                onChange={() => onToggleTask(task.id)}
                                                icon={<RadioButtonUnchecked fontSize="small" />}
                                                checkedIcon={<TaskAlt fontSize="small" color="success" />}
                                                size="small"
                                                sx={{
                                                    color: 'primary.main',
                                                    '&.Mui-checked': {
                                                        color: 'success.main',
                                                    }
                                                }}
                                            />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Box sx={{ width: '100%' }}>
                                                    <EllipsisText
                                                        text={task.name}
                                                        sx={{
                                                            textDecoration: task.completed ? 'line-through' : 'none',
                                                            color: task.completed ? 'text.secondary' : 'text.primary',
                                                            fontWeight: task.completed ? 400 : 500,
                                                            fontSize: '0.875rem',
                                                            lineHeight: 1.5
                                                        }}
                                                    />
                                                    {task.description && (
                                                        <Box sx={{ mt: 0.5, width: '100%' }}>
                                                            <EllipsisText
                                                                text={task.description}
                                                                sx={{
                                                                    color: 'text.secondary',
                                                                    fontSize: '0.75rem',
                                                                    maxWidth: '280px',
                                                                    fontStyle: 'italic',
                                                                    lineHeight: 1.4
                                                                }}
                                                            />
                                                        </Box>
                                                    )}
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                    {index < tasks.length - 1 && (
                                        <Divider sx={{ my: 0.5 }} />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </List>
                )}
            </Paper>

            {/* Task Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => handleOpenEditDialog(selectedTask)}>
                    <ListItemIcon>
                        <Edit fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Edit</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
                    <ListItemIcon>
                        <Delete fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </Menu>

            {/* Add/Edit Task Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ pb: 1 }}>
                    {editingTask ? 'Edit Task' : 'Add New Task'}
                    <IconButton
                        aria-label="close"
                        onClick={() => setOpenDialog(false)}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                        <TextField
                            autoFocus
                            name="name"
                            label="Task Name"
                            fullWidth
                            value={newTask.name}
                            onChange={handleInputChange}
                            placeholder="Enter task description"
                            required
                            size="small"
                        />
                        <TextField
                            name="description"
                            label="Description (Optional)"
                            fullWidth
                            value={newTask.description}
                            onChange={handleInputChange}
                            placeholder="Add more details about this task"
                            multiline
                            rows={2}
                            size="small"
                        />
                        <Box>
                            <TextField
                                name="dueDate"
                                label="Due Date"
                                type="date"
                                fullWidth
                                value={newTask.dueDate}
                                onChange={handleInputChange}
                                InputLabelProps={{ shrink: true }}
                                size="small"
                            />
                            <Button
                                size="small"
                                onClick={handleSetTodayDate}
                                sx={{ mt: 1 }}
                            >
                                Set Today
                            </Button>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={() => setOpenDialog(false)} color="inherit">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSaveTask}
                        variant="contained"
                        disabled={!newTask.name.trim()}
                    >
                        {editingTask ? 'Update Task' : 'Add Task'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default TasksSection;