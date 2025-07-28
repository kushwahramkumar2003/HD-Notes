import { Router } from 'express';
import { createNote, getNotes, deleteNote } from '../controllers/notesController';

const router = Router();

router.post('/', createNote);
router.get('/', getNotes);
router.delete('/:id', deleteNote);

export default router;